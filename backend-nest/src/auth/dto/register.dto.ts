import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../entities";

/** Previene XSS: rechaza < > " ' que podrían inyectar HTML/script */
const NO_HTML_PATTERN = /^[^<>"']*$/;

export class RegisterDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "usuario@example.com",
  })
  @IsEmail({}, { message: "El email debe ser válido" })
  @IsNotEmpty({ message: "El email es requerido" })
  @MaxLength(254, { message: "El email no puede exceder 254 caracteres" })
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "password123",
    minLength: 6,
  })
  @IsString({ message: "La contraseña debe ser un texto" })
  @IsNotEmpty({ message: "La contraseña es requerida" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @MaxLength(100, { message: "La contraseña no puede exceder 100 caracteres" })
  password: string;

  @ApiProperty({
    description: "Nombre completo del usuario",
    example: "Juan Pérez",
  })
  @IsString({ message: "El nombre debe ser un texto" })
  @IsNotEmpty({ message: "El nombre es requerido" })
  @MinLength(2, { message: "El nombre debe tener al menos 2 caracteres" })
  @MaxLength(100, { message: "El nombre no puede exceder 100 caracteres" })
  @Matches(NO_HTML_PATTERN, {
    message: "El nombre no puede contener caracteres HTML o de script",
  })
  name: string;

  @ApiProperty({
    description: "Rol del usuario",
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole, { message: "El rol debe ser 'admin' o 'user'" })
  @IsOptional()
  role?: UserRole;
}
