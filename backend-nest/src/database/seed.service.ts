import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "../entities";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    try {
      const userCount = await this.userRepository.count();

      if (userCount === 0) {
        this.logger.log("No hay usuarios en la base de datos. Creando usuarios por defecto...");

        const defaultUsers = [
          {
            email: "admin@iga.com",
            password: await bcrypt.hash("admin123", 10),
            name: "Administrador IGA",
            role: UserRole.ADMIN,
          },
          {
            email: "user@iga.com",
            password: await bcrypt.hash("user123", 10),
            name: "Usuario Demo",
            role: UserRole.USER,
          },
        ];

        for (const userData of defaultUsers) {
          const user = this.userRepository.create(userData);
          await this.userRepository.save(user);
          this.logger.log(`Usuario creado: ${userData.email}`);
        }

        this.logger.log("✅ Usuarios por defecto creados exitosamente");
      } else {
        this.logger.log("✅ Usuarios ya existen en la base de datos");
      }
    } catch (error) {
      this.logger.error("❌ Error al crear usuarios por defecto:", error.message);
    }
  }
}
