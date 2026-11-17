import { z } from "zod";

const environmentSchema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DB_HOST: z.string().min(1).default("localhost"),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_NAME: z.string().min(1).default("golf_commerce"),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
});

export default () => {
  const environment = environmentSchema.parse(process.env);

  return {
    api: {
      port: environment.API_PORT,
    },
    database: {
      host: environment.DB_HOST,
      port: environment.DB_PORT,
      database: environment.DB_NAME,
      user: environment.DB_USER,
      password: environment.DB_PASSWORD,
    },
  };
};
