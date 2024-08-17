import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../../core/domain/entities/product.entity";
import {
  CREATE_PRODUCT_USE_CASE,
  PRODUCT_REPOSITORY,
  UPDATE_PRODUCT_USE_CASE,
} from "../../../../config/constants/repositories.constants";
import { CreateProductUseCase } from "../../core/application/use-cases/create-product.usecase";
import { UpdateProductUseCase } from "../../core/application/use-cases/update-product.usecase";
import { ProductRepository } from "../../core/domain/repositories/product.repository";
import { UpdateProductDto } from "../../interface/dto/update-product.dto";
import { CreateProductDto } from "../../interface/dto/create-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @Inject(CREATE_PRODUCT_USE_CASE)
    private readonly createProductUseCase: CreateProductUseCase,
    @Inject(UPDATE_PRODUCT_USE_CASE)
    private readonly updateProductUseCase: UpdateProductUseCase,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.execute(createProductDto);
  }

  async listProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const partialProduct: Partial<Product> = {
      ...updateProductDto,
    };
    return this.updateProductUseCase.execute(id, partialProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }
}
