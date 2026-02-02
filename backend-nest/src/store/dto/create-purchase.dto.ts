import {
  IsString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Regex para prevenir XSS: rechaza < > " ' que podrían inyectar HTML/script.
 * Permite caracteres Unicode para nombres internacionales (áéíóú, ñ, etc.)
 */
const NO_HTML_PATTERN = /^[^<>"']*$/;

export class CreatePurchaseDto {
  @ApiProperty({
    description: "Nombre completo del cliente",
    example: "Juan Pérez García",
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: "El nombre del cliente es requerido" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @MaxLength(100, { message: "El nombre no puede exceder 100 caracteres" })
  @Matches(NO_HTML_PATTERN, {
    message: "El nombre no puede contener caracteres HTML o de script",
  })
  client_name: string;

  @ApiProperty({
    description: "Email del cliente (único)",
    example: "juan.perez@example.com",
  })
  @IsEmail({}, { message: "Debe proporcionar un email válido" })
  @IsNotEmpty({ message: "El email es requerido" })
  @MaxLength(254, { message: "El email no puede exceder 254 caracteres" })
  client_email: string;

  @ApiProperty({
    description: "Número de teléfono del cliente",
    example: "+51987654321",
  })
  @IsString()
  @IsNotEmpty({ message: "El teléfono es requerido" })
  @MaxLength(20, { message: "El teléfono no puede exceder 20 caracteres" })
  @Matches(/^[+]?[\d\s-()]+$/, {
    message:
      "El teléfono debe contener solo números, espacios, guiones, paréntesis o signo +",
  })
  client_phone: string;

  @ApiProperty({
    description: "ID del curso a comprar",
    example: 1,
  })
  @IsInt({ message: "El ID del curso debe ser un número entero" })
  @IsNotEmpty({ message: "El ID del curso es requerido" })
  course_id: number;
}
