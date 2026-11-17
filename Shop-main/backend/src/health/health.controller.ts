import { Controller, Get } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Controller("health")
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get("live")
  getLiveness() {
    return { status: "ok" };
  }

  @Get("ready")
  async getReadiness() {
    await this.databaseService.checkConnection();
    return { status: "ok", database: "connected" };
  }
}
