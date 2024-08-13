import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductOrmEntity } from "../../infrastructure/persistence/entities/product.orm-entity";
import { ProductRepositoryImpl } from "../../infrastructure/persistence/repositories/product.repository";
import { CreateProductUseCase } from "../../core/application/use-cases/create-product.usecase";
import { ProductService } from "../../application/services/product.service";
import { ProductController } from "../controllers/product.controller";
import { PRODUCT_REPOSITORY } from "src/config/constants/repositories.constants";

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
          inject: [ProductRepositoryImpl],
          provide: PRODUCT_REPOSITORY,
          useFactory: (repository: ProductRepositoryImpl) =>
            new CreateProductUseCase(repository),
        },
        ProductRepositoryImpl,
        ProductService,
      ],
      exports: [PRODUCT_REPOSITORY],
    };
  }
}
