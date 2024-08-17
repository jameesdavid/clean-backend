import { Product } from "../entities/product.entity";

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: string, product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
