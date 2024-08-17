import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductOrmEntity } from "../../infrastructure/persistence/entities/product.orm-entity";
import { ProductRepositoryImpl } from "../../infrastructure/persistence/repositories/product.repository";
import { CreateProductUseCase } from "../../core/application/use-cases/create-product.usecase";
import { ProductService } from "../../application/services/product.service";
import { ProductController } from "../controllers/product.controller";
import {
  CREATE_PRODUCT_USE_CASE,
  PRODUCT_REPOSITORY,
  UPDATE_PRODUCT_USE_CASE,
} from "../../../../config/constants/repositories.constants";
import { UpdateProductUseCase } from "../../core/application/use-cases/update-product.usecase";

@Module({
  imports: [],
})
export class ProductModule {
  static register(): DynamicModule {
    return {
      module: ProductModule,
      imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
      controllers: [ProductController],
      providers: [
        {
          inject: [PRODUCT_REPOSITORY],
          provide: CREATE_PRODUCT_USE_CASE,
          useFactory: (repository: ProductRepositoryImpl) =>
            new CreateProductUseCase(repository),
        },
        {
          inject: [PRODUCT_REPOSITORY],
          provide: UPDATE_PRODUCT_USE_CASE,
          useFactory: (repository: ProductRepositoryImpl) =>
            new UpdateProductUseCase(repository),
        },
        {
          provide: PRODUCT_REPOSITORY,
          useClass: ProductRepositoryImpl,
        },
        ProductService,
      ],
      exports: [ProductService],
    };
  }
}
