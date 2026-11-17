import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { config as loadDotenv } from "dotenv";
import { Pool, type PoolClient } from "pg";
import { z } from "zod";

loadDotenv({ path: process.env.ENV_FILE ?? "../.env" });

const environmentSchema = z.object({
  DB_HOST: z.string().min(1).default("localhost"),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_NAME: z.string().min(1).default("golf_commerce"),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
});

async function migrate() {
  const environment = environmentSchema.parse(process.env);
  const pool = new Pool({
    host: environment.DB_HOST,
    port: environment.DB_PORT,
    database: environment.DB_NAME,
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
  });
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    await client.query("SELECT pg_advisory_lock($1)", [827361904]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const migrationDirectory = join(__dirname, "migrations");
    const migrationNames = (await readdir(migrationDirectory))
      .filter((name) => /^\d+_[a-z0-9_]+\.sql$/.test(name))
      .sort();

    for (const name of migrationNames) {
      const applied = await client.query(
        "SELECT 1 FROM schema_migrations WHERE name = $1",
        [name],
      );
      if (applied.rowCount) {
        continue;
      }

      const sql = await readFile(join(migrationDirectory, name), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
          name,
        ]);
        await client.query("COMMIT");
        console.info(`Applied migration ${name}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    try {
      if (client) {
        try {
          await client.query("SELECT pg_advisory_unlock($1)", [827361904]);
        } finally {
          client.release();
        }
      }
    } finally {
      await pool.end();
    }
  }
}

migrate().catch((error: unknown) => {
  console.error("Database migration failed:", error);
  process.exitCode = 1;
});
