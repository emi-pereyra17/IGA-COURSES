import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Course } from "./course.entity";
import { Client } from "./client.entity";

@Entity("purchases")
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  course_id: number;

  @Column({ type: "int" })
  client_id: number;

  @Column({ type: "datetime" })
  purchase_date: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  // Relación: Muchas compras pertenecen a un curso
  @ManyToOne(() => Course, (course) => course.purchases, { eager: true })
  @JoinColumn({ name: "course_id" })
  course: Course;

  // Relación: Muchas compras pertenecen a un cliente
  @ManyToOne(() => Client, (client) => client.purchases, { eager: true })
  @JoinColumn({ name: "client_id" })
  client: Client;
}
