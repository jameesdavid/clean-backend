import { Product } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { UpdateProductUseCase } from "./update-product.usecase";

describe("UpdateProductUseCase", () => {
  let updateProductUseCase: UpdateProductUseCase;
  let mockProductRepository: ProductRepository;

  beforeEach(() => {
    mockProductRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    updateProductUseCase = new UpdateProductUseCase(mockProductRepository);
  });

  it("should update an existing product", async () => {
    const existingProduct = new Product(
      "1",
      "Product1",
      "Description1",
      100,
      new Date(),
      new Date(),
    );
    const updateFields = { name: "UpdatedProduct1", price: 150 };
    const updatedProduct = new Product(
      "1",
      "UpdatedProduct1",
      "Description1",
      150,
      new Date(),
      new Date(),
    );

    (mockProductRepository.findById as jest.Mock).mockResolvedValue(
      existingProduct,
    );
    (mockProductRepository.update as jest.Mock).mockResolvedValue(
      updatedProduct,
    );

    const result = await updateProductUseCase.execute("1", updateFields);

    expect(result).toEqual(updatedProduct);
    expect(mockProductRepository.findById).toHaveBeenCalledWith("1");
    expect(mockProductRepository.update).toHaveBeenCalledWith("1", {
      ...existingProduct,
      ...updateFields,
      updatedAt: expect.any(Date),
    });
  });

  it("should throw an error if the product id is an empty string", async () => {
    (mockProductRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateProductUseCase.execute("", { name: "UpdatedProduct1" }),
    ).rejects.toThrow("Product ID cannot be empty.");
  });

  it("should throw an error if the product is not found", async () => {
    (mockProductRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateProductUseCase.execute("1", { name: "UpdatedProduct1" }),
    ).rejects.toThrow("Product not found");

    expect(mockProductRepository.findById).toHaveBeenCalledWith("1");
  });
});
