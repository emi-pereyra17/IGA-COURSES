import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course, Client, Purchase } from "../entities";
import { CreatePurchaseDto } from "./dto";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
  ) {}

  /**
   * Obtiene la lista completa de cursos disponibles
   * @returns Array de cursos
   */
  async getAllCourses(): Promise<Course[]> {
    try {
      const courses = await this.courseRepository.find({
        order: {
          created_at: "DESC",
        },
      });

      return courses;
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener los cursos");
    }
  }

  /**
   * Obtiene un curso específico por su ID
   * @param id - ID del curso
   * @returns Curso encontrado
   */
  async getCourseById(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    return course;
  }

  /**
   * Crea una nueva compra
   * Primero busca o crea el cliente, luego registra la compra
   * @param createPurchaseDto - Datos de la compra
   * @returns Compra creada con información del curso y cliente
   */
  async createPurchase(
    createPurchaseDto: CreatePurchaseDto,
  ): Promise<Purchase> {
    const { client_name, client_email, client_phone, course_id } =
      createPurchaseDto;

    // 1. Verificar que el curso existe
    const course = await this.courseRepository.findOne({
      where: { id: course_id },
    });

    if (!course) {
      throw new NotFoundException(`Curso con ID ${course_id} no encontrado`);
    }

    // 2. Buscar si el cliente ya existe por email
    let client = await this.clientRepository.findOne({
      where: { email: client_email },
    });

    // 3. Si no existe, crear el cliente
    if (!client) {
      client = this.clientRepository.create({
        name: client_name,
        email: client_email,
        phone: client_phone,
      });

      try {
        await this.clientRepository.save(client);
      } catch (error) {
        // Si hay error de email duplicado (race condition)
        if (error.code === "ER_DUP_ENTRY") {
          client = await this.clientRepository.findOne({
            where: { email: client_email },
          });
        } else {
          throw new InternalServerErrorException(
            "Error al registrar el cliente",
          );
        }
      }
    } else {
      // Si el cliente existe, actualizar su información
      client.name = client_name;
      client.phone = client_phone;
      await this.clientRepository.save(client);
    }

    // 4. Crear la compra con la fecha actual
    const purchase = this.purchaseRepository.create({
      course_id: course.id,
      client_id: client.id,
      purchase_date: new Date(),
    });

    try {
      const savedPurchase = await this.purchaseRepository.save(purchase);

      // 5. Retornar la compra con las relaciones cargadas
      return await this.purchaseRepository.findOne({
        where: { id: savedPurchase.id },
        relations: ["course", "client"],
      });
    } catch (error) {
      throw new InternalServerErrorException("Error al registrar la compra");
    }
  }

  /**
   * Obtiene el historial de compras de un cliente por su email
   * @param email - Email del cliente
   * @returns Array de compras del cliente
   */
  async getPurchasesByEmail(email: string): Promise<Purchase[]> {
    // 1. Buscar el cliente por email
    const client = await this.clientRepository.findOne({
      where: { email },
    });

    if (!client) {
      throw new NotFoundException(`Cliente con email ${email} no encontrado`);
    }

    // 2. Obtener todas las compras del cliente
    const purchases = await this.purchaseRepository.find({
      where: { client_id: client.id },
      relations: ["course", "client"],
      order: {
        purchase_date: "DESC",
      },
    });

    return purchases;
  }

  /**
   * Obtiene el historial de compras de un cliente por su ID
   * @param clientId - ID del cliente
   * @returns Array de compras del cliente
   */
  async getPurchasesByClientId(clientId: number): Promise<Purchase[]> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${clientId} no encontrado`);
    }

    const purchases = await this.purchaseRepository.find({
      where: { client_id: clientId },
      relations: ["course", "client"],
      order: {
        purchase_date: "DESC",
      },
    });

    return purchases;
  }
}
