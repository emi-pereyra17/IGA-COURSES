import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { ParseEmailPipe } from "../common/pipes/parse-email.pipe";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { StoreService } from "./store.service";
import {
  CreatePurchaseDto,
  PurchaseResponseDto,
  CourseResponseDto,
} from "./dto";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Store - API Cliente")
@Controller("courses")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * GET /courses
   * Obtiene la lista completa de cursos disponibles
   */
  @Get()
  @ApiOperation({
    summary: "Listar todos los cursos",
    description: "Devuelve la lista completa de cursos disponibles para compra",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de cursos obtenida exitosamente",
    type: [CourseResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  async getCourses() {
    const courses = await this.storeService.getAllCourses();

    return {
      success: true,
      message: "Cursos obtenidos exitosamente",
      data: courses,
    };
  }

  /**
   * GET /courses/:id
   * Obtiene el detalle de un curso específico
   */
  @Get(":id")
  @ApiOperation({
    summary: "Obtener detalle de un curso",
    description: "Devuelve la información completa de un curso específico",
  })
  @ApiParam({
    name: "id",
    description: "ID del curso",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Curso encontrado",
    type: CourseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Curso no encontrado",
  })
  async getCourse(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number,
  ) {
    const course = await this.storeService.getCourseById(id);

    return {
      success: true,
      message: "Curso obtenido exitosamente",
      data: course,
    };
  }
}

@ApiTags("Purchases - API Cliente")
@Controller("purchases")
export class PurchaseController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * POST /purchases
   * Crea una nueva compra
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Registrar una compra",
    description:
      "Crea o actualiza un cliente y registra la compra de un curso con la fecha actual",
  })
  @ApiResponse({
    status: 201,
    description: "Compra registrada exitosamente",
    type: PurchaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Curso no encontrado",
  })
  async createPurchase(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createPurchaseDto: CreatePurchaseDto,
  ) {
    const purchase = await this.storeService.createPurchase(createPurchaseDto);

    return {
      success: true,
      message: "Compra registrada exitosamente",
      data: purchase,
    };
  }

  /**
   * GET /purchases/:email
   * Obtiene el historial de compras de un cliente por email
   */
  @Get(":email")
  @ApiOperation({
    summary: "Obtener historial de compras por email",
    description:
      "Devuelve todos los cursos comprados por un cliente específico",
  })
  @ApiParam({
    name: "email",
    description: "Email del cliente",
    example: "juan.perez@example.com",
  })
  @ApiResponse({
    status: 200,
    description: "Historial de compras obtenido",
    type: [PurchaseResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: "Cliente no encontrado",
  })
  async getPurchasesByEmail(
    @Param("email", ParseEmailPipe) email: string,
  ) {
    const purchases = await this.storeService.getPurchasesByEmail(email);

    return {
      success: true,
      message: "Historial de compras obtenido exitosamente",
      data: purchases,
      count: purchases.length,
    };
  }

  /**
   * GET /purchases/client/:clientId
   * Obtiene el historial de compras de un cliente por ID
   */
  @Get("client/:clientId")
  @ApiOperation({
    summary: "Obtener historial de compras por ID de cliente",
    description:
      "Devuelve todos los cursos comprados por un cliente específico usando su ID",
  })
  @ApiParam({
    name: "clientId",
    description: "ID del cliente",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Historial de compras obtenido",
    type: [PurchaseResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: "Cliente no encontrado",
  })
  async getPurchasesByClientId(
    @Param("clientId", new ParseIntPipe({ errorHttpStatusCode: 400 }))
    clientId: number,
  ) {
    const purchases = await this.storeService.getPurchasesByClientId(clientId);

    return {
      success: true,
      message: "Historial de compras obtenido exitosamente",
      data: purchases,
      count: purchases.length,
    };
  }
}
