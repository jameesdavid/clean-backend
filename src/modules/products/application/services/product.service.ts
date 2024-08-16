import { Inject, Injectable } from "@nestjs/common";
import { CreateProductUseCase } from "../../core/application/use-cases/create-product.usecase";
import { Product } from "../../core/domain/entities/product.entity";
import { PRODUCT_REPOSITORY } from "src/config/constants/repositories.constants";

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  createProduct(
    name: string,
    description: string,
    price: number,
  ): Promise<Product> {
    return this.createProductUseCase.execute(name, description, price);
  }
}
