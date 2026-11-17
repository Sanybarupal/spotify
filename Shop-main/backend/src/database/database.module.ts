import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool, type PoolConfig } from "pg";
import { DATABASE_POOL } from "./database.constants";
import { DatabaseService } from "./database.service";

@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Pool(configService.getOrThrow<PoolConfig>("database")),
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
