import { ApiProperty } from "@nestjs/swagger";

export class CourseResponseDto {
  @ApiProperty({ description: "ID del curso" })
  id: number;

  @ApiProperty({ description: "Nombre del curso" })
  name: string;

  @ApiProperty({ description: "Descripción corta del curso" })
  description: string;

  @ApiProperty({ description: "Precio del curso", example: 299.99 })
  price: number;

  @ApiProperty({ description: "Detalle completo del curso", required: false })
  detail?: string;

  @ApiProperty({ description: "URL de la imagen del curso", required: false })
  image_url?: string;

  @ApiProperty({ description: "Fecha de creación" })
  created_at: Date;

  @ApiProperty({ description: "Fecha de última actualización" })
  updated_at: Date;
}
