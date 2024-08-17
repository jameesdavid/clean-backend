import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
} from "@nestjs/common";
import { ProductService } from "../../application/services/product.service";
import { Product } from "../../core/domain/entities/product.entity";
import { UpdateProductDto } from "../dto/update-product.dto";
import { CreateProductDto } from "../dto/create-product.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  listProducts(): Promise<Product[]> {
    return this.productService.listProducts();
  }

  @Get(":id")
  getProduct(@Param("id") id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Patch(":id")
  updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(":id")
  deleteProduct(@Param("id") id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
