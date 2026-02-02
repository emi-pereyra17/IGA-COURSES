import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, AuthResponseDto, UserResponseDto } from "./dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { GetUser } from "./decorators/get-user.decorator";
import { Public } from "./decorators/public.decorator";
import { User } from "../entities";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Registra un nuevo usuario
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Registrar nuevo usuario",
    description: "Crea una nueva cuenta de usuario en el sistema",
  })
  @ApiResponse({
    status: 201,
    description: "Usuario registrado exitosamente",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "El email ya está registrado",
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  async register(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    registerDto: RegisterDto,
  ): Promise<{ success: boolean; message: string; data: AuthResponseDto }> {
    const result = await this.authService.register(registerDto);

    return {
      success: true,
      message: "Usuario registrado exitosamente",
      data: result,
    };
  }

  /**
   * POST /auth/login
   * Inicia sesión de usuario
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Iniciar sesión",
    description: "Autentica un usuario y devuelve un token JWT",
  })
  @ApiResponse({
    status: 200,
    description: "Login exitoso",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Credenciales inválidas",
  })
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    loginDto: LoginDto,
  ): Promise<{ success: boolean; message: string; data: AuthResponseDto }> {
    const result = await this.authService.login(loginDto);

    return {
      success: true,
      message: "Login exitoso",
      data: result,
    };
  }

  /**
   * GET /auth/profile
   * Obtiene el perfil del usuario autenticado
   */
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Obtener perfil de usuario",
    description: "Devuelve la información del usuario autenticado",
  })
  @ApiResponse({
    status: 200,
    description: "Perfil obtenido exitosamente",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "No autorizado",
  })
  async getProfile(
    @GetUser() user: User,
  ): Promise<{ success: boolean; message: string; data: UserResponseDto }> {
    const profile = await this.authService.getProfile(user.id);

    return {
      success: true,
      message: "Perfil obtenido exitosamente",
      data: profile,
    };
  }

  /**
   * GET /auth/validate
   * Valida si el token JWT es válido
   */
  @Get("validate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Validar token",
    description: "Verifica si el token JWT es válido",
  })
  @ApiResponse({
    status: 200,
    description: "Token válido",
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido o expirado",
  })
  async validateToken(
    @GetUser() user: User,
  ): Promise<{ success: boolean; message: string; valid: boolean; user: UserResponseDto }> {
    const profile = await this.authService.getProfile(user.id);

    return {
      success: true,
      message: "Token válido",
      valid: true,
      user: profile,
    };
  }
}
