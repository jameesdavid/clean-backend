import { Controller, Post, Body } from "@nestjs/common";
import { ProductService } from "../../application/services/product.service";
import { Product } from "../../core/domain/entities/product.entity";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(
    @Body("name") name: string,
    @Body("description") description: string,
    @Body("price") price: number,
  ): Promise<Product> {
    return this.productService.createProduct(name, description, price);
  }
}
