import { ProductRepository } from "../../domain/repositories/product.repository";
import { Product } from "../../domain/entities/product.entity";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, updateFields: Partial<Product>): Promise<Product> {
    if (!id) {
      throw new Error("Product ID cannot be empty.");
    }
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const updatedProduct = {
      ...existingProduct,
      ...updateFields,
      updatedAt: new Date(),
    };
    return this.productRepository.update(existingProduct.id, updatedProduct);
  }
}
