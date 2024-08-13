import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./interface/modules/product.module";
import ormConfig from "./config/ormconfig";

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ProductModule.register()],
})
export class AppModule {}
