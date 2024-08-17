import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepository } from "../../../core/domain/repositories/product.repository";
import { ProductOrmEntity } from "../entities/product.orm-entity";
import { Product } from "../../../core/domain/entities/product.entity";

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const productOrm = this.repository.create(product);
    const result = await this.repository.save(productOrm);
    return new Product(
      result.id,
      result.name,
      result.description,
      result.price,
      result.createdAt,
      result.updatedAt,
    );
  }

  async findById(id: string): Promise<Product | null> {
    const productOrm = await this.repository.findOne({ where: { id } });
    if (!productOrm) return null;
    return new Product(
      productOrm.id,
      productOrm.name,
      productOrm.description,
      productOrm.price,
      productOrm.createdAt,
      productOrm.updatedAt,
    );
  }

  async findAll(): Promise<Product[]> {
    const productsOrm = await this.repository.find();
    return productsOrm.map(
      (productOrm) =>
        new Product(
          productOrm.id,
          productOrm.name,
          productOrm.description,
          productOrm.price,
          productOrm.createdAt,
          productOrm.updatedAt,
        ),
    );
  }

  async update(id: string, product: Product): Promise<Product> {
    await this.repository.update(id, product);
    return product;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
