import { ApiProperty } from "@nestjs/swagger";

export class PurchaseResponseDto {
  @ApiProperty({ description: "ID de la compra" })
  id: number;

  @ApiProperty({ description: "ID del curso comprado" })
  course_id: number;

  @ApiProperty({ description: "ID del cliente" })
  client_id: number;

  @ApiProperty({ description: "Fecha y hora de la compra" })
  purchase_date: Date;

  @ApiProperty({ description: "Información del curso", type: "object" })
  course: {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
  };

  @ApiProperty({ description: "Información del cliente", type: "object" })
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}
