import { Product } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    name: string,
    description: string,
    price: number,
  ): Promise<Product> {
    const product = new Product(
      undefined,
      name,
      description,
      price,
      new Date(),
      new Date(),
    );

    return this.productRepository.save(product);
  }
}
