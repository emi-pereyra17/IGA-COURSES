import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: "Health check" })
  getHello() {
    return {
      success: true,
      message:
        "IGA Courses API - Backend NestJS está funcionando correctamente",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("health")
  @ApiOperation({ summary: "Verificar estado de la API" })
  healthCheck() {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }
}
