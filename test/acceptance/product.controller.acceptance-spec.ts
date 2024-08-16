import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "../../src/modules/products/interface/modules/product.module";
import { ProductOrmEntity } from "../../src/modules/products/infrastructure/persistence/entities/product.orm-entity";

describe("ProductController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [ProductOrmEntity],
          synchronize: true,
        }),
        ProductModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/products (POST) - should create a new product", () => {
    return request(app.getHttpServer())
      .post("/products")
      .send({ name: "Product 1", description: "Description 1", price: 100.0 })
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: expect.any(String),
          name: "Product 1",
          description: "Description 1",
          price: 100.0,
        });
      });
  });
});
