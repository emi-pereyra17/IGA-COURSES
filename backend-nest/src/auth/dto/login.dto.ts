import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/** Previene XSS: rechaza < > que permitirían inyectar HTML/script (emails válidos pueden tener " ') */
const NO_ANGLE_BRACKETS = /^[^<>]*$/;

export class LoginDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "admin@iga.com",
  })
  @IsEmail({}, { message: "El email debe ser válido" })
  @IsNotEmpty({ message: "El email es requerido" })
  @MaxLength(254, { message: "El email no puede exceder 254 caracteres" })
  @Matches(NO_ANGLE_BRACKETS, {
    message: "El email no puede contener caracteres HTML o de script",
  })
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "admin123",
    minLength: 6,
  })
  @IsString({ message: "La contraseña debe ser un texto" })
  @IsNotEmpty({ message: "La contraseña es requerida" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @MaxLength(100, { message: "La contraseña no puede exceder 100 caracteres" })
  password: string;
}
