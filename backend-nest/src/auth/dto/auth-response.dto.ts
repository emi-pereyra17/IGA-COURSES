import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../entities";

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "admin@iga.com" })
  email: string;

  @ApiProperty({ example: "Administrador IGA" })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: "2026-01-30T00:00:00.000Z" })
  created_at: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: "Token JWT de acceso" })
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
