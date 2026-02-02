import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Purchase } from "./purchase.entity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "text", nullable: true })
  detail: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  image_url: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  // Relación: Un curso puede tener muchas compras
  @OneToMany(() => Purchase, (purchase) => purchase.course)
  purchases: Purchase[];
}
