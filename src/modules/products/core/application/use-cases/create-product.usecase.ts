import { Product } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";

interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    this.validateInput(data);
    const product = new Product(
      undefined,
      data.name,
      data.description,
      data.price,
      new Date(),
      new Date(),
    );

    return this.productRepository.save(product);
  }

  private validateInput(data: CreateProductDTO): void {
    const { name, description, price } = data;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error(
        "Product name is required and must be a non-empty string.",
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      throw new Error(
        "Product description is required and must be a non-empty string.",
      );
    }

    if (typeof price !== "number" || price <= 0) {
      throw new Error(
        "Product price is required and must be a positive number.",
      );
    }
  }
}
