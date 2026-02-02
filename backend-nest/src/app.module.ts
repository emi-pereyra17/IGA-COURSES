import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";
import { StoreModule } from "./store/store.module";
import { AuthModule } from "./auth/auth.module";
import { Course, Client, Purchase, User } from "./entities";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production" ? ".env.docker" : ".env",
    }),

    // Configuración de TypeORM para MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 3306),
        username: configService.get<string>("DB_USERNAME", "root"),
        password: configService.get<string>("DB_PASSWORD", ""),
        database: configService.get<string>("DB_DATABASE", "iga_courses"),
        entities: [Course, Client, Purchase, User],
        synchronize: false, // ⚠️ IMPORTANTE: false para usar el schema SQL existente
        logging: configService.get<string>("NODE_ENV") === "development",
        timezone: "Z", // UTC
      }),
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    AuthModule,
    StoreModule,
  ],
  controllers: [],
  providers: [
    // Guard global para JWT (todas las rutas requieren autenticación por defecto)
    // Las rutas públicas deben usar @Public() decorator
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
