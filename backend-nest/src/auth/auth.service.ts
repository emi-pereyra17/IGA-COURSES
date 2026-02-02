import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "../entities";
import { LoginDto, RegisterDto, AuthResponseDto, UserResponseDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, role } = registerDto;

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("El email ya está registrado");
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role || UserRole.USER,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException("Error al crear el usuario");
    }

    // Generar token JWT
    const token = this.generateJwtToken(user);

    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Autentica un usuario y genera un token JWT
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      throw new UnauthorizedException("Usuario desactivado");
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Generar token JWT
    const token = this.generateJwtToken(user);

    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    return this.sanitizeUser(user);
  }

  /**
   * Genera un token JWT para el usuario
   */
  private generateJwtToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Remueve datos sensibles del usuario
   */
  private sanitizeUser(user: User): UserResponseDto {
    const { password, ...result } = user;
    return result as UserResponseDto;
  }

  /**
   * Verifica y decodifica un token JWT
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }
}
