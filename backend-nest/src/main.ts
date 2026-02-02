import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma los tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de CORS - Solo orígenes permitidos (whitelist estricta)
  // Rechaza "*" para evitar que sitios no confiables consuman la API
  const corsOrigin = configService.get<string>("CORS_ORIGIN", "http://localhost:5173");
  const allowedOrigins =
    corsOrigin === "*" || !corsOrigin.trim()
      ? ["http://localhost:5173"]
      : corsOrigin.split(",").map((o) => o.trim()).filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Peticiones sin Origin (ej: Postman, curl, mismo origen) se permiten
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false); // Bloquea orígenes no autorizados
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Prefijo global para todas las rutas
  app.setGlobalPrefix("api");

  // Configuración de Swagger (Documentación)
  const config = new DocumentBuilder()
    .setTitle("IGA Courses API - Cliente")
    .setDescription(
      "API para gestión de cursos gastronómicos y compras de clientes",
    )
    .setVersion("1.0")
    .addTag("Store", "Endpoints para gestión de cursos")
    .addTag("Purchases", "Endpoints para gestión de compras")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Obtener puerto de las variables de entorno
  const port = configService.get<number>("PORT", 3000);

  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🚀  IGA Courses API - Backend NestJS                   ║
  ║                                                           ║
  ║   📡  API disponible en: http://localhost:${port}/api       ║
  ║   📚  Documentación: http://localhost:${port}/api/docs      ║
  ║   🌐  Ambiente: ${configService.get("NODE_ENV", "development").toUpperCase()}                              ║
  ║   🗄️   Base de datos: ${configService.get("DB_HOST", "localhost")}:${configService.get("DB_PORT", 3306)}                      ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
