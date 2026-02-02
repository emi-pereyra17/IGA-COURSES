import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from "@nestjs/common";

/**
 * Pipe que valida que un parámetro sea un email válido.
 * Previene inyección de valores maliciosos en rutas que usan email como parámetro.
 */
@Injectable()
export class ParseEmailPipe implements PipeTransform<string, string> {
  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  private static readonly MAX_LENGTH = 254;

  transform(value: string): string {
    if (!value || typeof value !== "string") {
      throw new BadRequestException("El email es requerido");
    }
    const trimmed = value.trim();
    if (trimmed.length > ParseEmailPipe.MAX_LENGTH) {
      throw new BadRequestException("El email no puede exceder 254 caracteres");
    }
    if (!ParseEmailPipe.EMAIL_REGEX.test(trimmed)) {
      throw new BadRequestException("El formato del email no es válido");
    }
    return trimmed;
  }
}
