import { Test, TestingModule } from "@nestjs/testing";
import { ProductRepositoryImpl } from "./product.repository";
import { ProductOrmEntity } from "../entities/product.orm-entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../../core/domain/entities/product.entity";

describe("ProductRepositoryImpl", () => {
  let productRepositoryImpl: ProductRepositoryImpl;
  let repository: Repository<ProductOrmEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepositoryImpl,
        {
          provide: getRepositoryToken(ProductOrmEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    productRepositoryImpl = module.get<ProductRepositoryImpl>(
      ProductRepositoryImpl,
    );
    repository = module.get<Repository<ProductOrmEntity>>(
      getRepositoryToken(ProductOrmEntity),
    );
  });

  it("should save a product", async () => {
    const productOrmEntity = new ProductOrmEntity();
    productOrmEntity.id = undefined;
    productOrmEntity.name = "Product 1";
    productOrmEntity.description = "Description 1";
    productOrmEntity.price = 100.0;
    productOrmEntity.createdAt = new Date();
    productOrmEntity.updatedAt = new Date();

    jest.spyOn(repository, "create").mockReturnValue(productOrmEntity as any);
    jest.spyOn(repository, "save").mockResolvedValue(productOrmEntity);

    const product = new Product(
      productOrmEntity.id,
      productOrmEntity.name,
      productOrmEntity.description,
      productOrmEntity.price,
      productOrmEntity.createdAt,
      productOrmEntity.updatedAt,
    );

    const result = await productRepositoryImpl.save(product);

    expect(result).toEqual(product);
  });

  it("should find a product by id", async () => {
    const productOrmEntity = new ProductOrmEntity();
    productOrmEntity.id = "f4bc787b-0185-44c0-af1d-175d903a1388";
    productOrmEntity.name = "Product 1";
    productOrmEntity.description = "Description 1";
    productOrmEntity.price = 100.0;
    productOrmEntity.createdAt = new Date();
    productOrmEntity.updatedAt = new Date();

    jest.spyOn(repository, "findOne").mockResolvedValue(productOrmEntity);

    const result = await productRepositoryImpl.findById(
      "f4bc787b-0185-44c0-af1d-175d903a1388",
    );

    expect(result).toEqual(
      new Product(
        productOrmEntity.id,
        productOrmEntity.name,
        productOrmEntity.description,
        productOrmEntity.price,
        productOrmEntity.createdAt,
        productOrmEntity.updatedAt,
      ),
    );
  });
});
