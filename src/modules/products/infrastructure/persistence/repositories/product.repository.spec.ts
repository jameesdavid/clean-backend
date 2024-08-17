import { Test, TestingModule } from "@nestjs/testing";
import { ProductRepositoryImpl } from "./product.repository";
import { ProductOrmEntity } from "../entities/product.orm-entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
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

  it("should find all products", async () => {
    const productOrmEntities = [
      {
        id: "1",
        name: "Product 1",
        description: "Description 1",
        price: 100.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Product 2",
        description: "Description 2",
        price: 200.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(repository, "find").mockResolvedValue(productOrmEntities as any);

    const result = await productRepositoryImpl.findAll();

    expect(result).toEqual(
      productOrmEntities.map(
        (entity) =>
          new Product(
            entity.id,
            entity.name,
            entity.description,
            entity.price,
            entity.createdAt,
            entity.updatedAt,
          ),
      ),
    );
  });

  it("should update a product", async () => {
    const updateData: Partial<Product> = {
      name: "Updated Product",
      price: 150.0,
      updatedAt: new Date(),
    };
    const productOrmEntity = new ProductOrmEntity();
    productOrmEntity.id = "1";
    productOrmEntity.name = "Product 1";
    productOrmEntity.description = "Description 1";
    productOrmEntity.price = 100.0;
    productOrmEntity.createdAt = new Date();
    productOrmEntity.updatedAt = new Date();

    const updatedProductOrmEntity = {
      ...productOrmEntity,
      ...updateData,
    };

    jest
      .spyOn(repository, "update")
      .mockResolvedValue(updatedProductOrmEntity as any);

    const updatedProduct = new Product(
      updatedProductOrmEntity.id,
      updatedProductOrmEntity.name,
      updatedProductOrmEntity.description,
      updatedProductOrmEntity.price,
      updatedProductOrmEntity.createdAt,
      updatedProductOrmEntity.updatedAt,
    );

    const result = await productRepositoryImpl.update("1", updatedProduct);

    expect(result).toEqual(updatedProduct);
  });

  it("should delete a product", async () => {
    const productId = "1";
    const deleteResult: DeleteResult = {
      raw: {},
      affected: 1,
    };
    jest.spyOn(repository, "delete").mockResolvedValue(deleteResult);

    await productRepositoryImpl.delete(productId);

    expect(repository.delete).toHaveBeenCalledWith(productId);
  });
});
