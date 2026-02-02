import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreController, PurchaseController } from "./store.controller";
import { StoreService } from "./store.service";
import { Course, Client, Purchase } from "../entities";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Client, Purchase])],
  controllers: [StoreController, PurchaseController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
