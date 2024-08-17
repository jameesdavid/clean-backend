import { CreateProductUseCase } from "./create-product.usecase";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { Product } from "../../domain/entities/product.entity";

describe("CreateProductUseCase", () => {
  let createProductUseCase: CreateProductUseCase;
  let mockProductRepository: ProductRepository;

  beforeEach(() => {
    mockProductRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createProductUseCase = new CreateProductUseCase(mockProductRepository);
  });

  it("should create a new product", async () => {
    const inputData = {
      name: "Product 1",
      description: "Description 1",
      price: 100.0,
    };
    const product = new Product(
      undefined,
      inputData.name,
      inputData.description,
      inputData.price,
      expect.any(Date),
      expect.any(Date),
    );
    (mockProductRepository.save as jest.Mock).mockResolvedValue(product);

    const result = await createProductUseCase.execute(inputData);

    expect(mockProductRepository.save).toHaveBeenCalledWith(product);
    expect(result).toEqual(product);
  });
});
