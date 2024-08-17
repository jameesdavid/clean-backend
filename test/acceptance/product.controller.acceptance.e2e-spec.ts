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
        ProductModule.register(),
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

  it("/products (GET) - should return a list of products", async () => {
    await request(app.getHttpServer())
      .post("/products")
      .send({ name: "Product 2", description: "Description 2", price: 200.0 });

    return request(app.getHttpServer())
      .get("/products")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: "Product 2",
              description: "Description 2",
              price: 200.0,
            }),
          ]),
        );
      });
  });

  it("/products/:id (PATCH) - should update a product", async () => {
    const createResponse = await request(app.getHttpServer())
      .post("/products")
      .send({ name: "Product 3", description: "Description 3", price: 300.0 });

    const productId = createResponse.body.id;

    return request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send({ name: "Updated Product 3" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: productId,
          name: "Updated Product 3",
          description: "Description 3",
          price: 300.0,
        });
      });
  });

  it("/products/:id (DELETE) - should delete a product", async () => {
    const createResponse = await request(app.getHttpServer())
      .post("/products")
      .send({ name: "Product 4", description: "Description 4", price: 400.0 });

    const productId = createResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200)
      .then(async () => {
        await request(app.getHttpServer())
          .get(`/products/${productId}`)
          .expect(404);
      });
  });

  it("/products (POST) - should return 400 for invalid data", () => {
    return request(app.getHttpServer())
      .post("/products")
      .send({ name: "", description: "Description with no name", price: -10 })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          expect.arrayContaining([
            expect.stringContaining("name should not be empty"),
            expect.stringContaining("price must be a positive number"),
          ]),
        );
      });
  });
});
