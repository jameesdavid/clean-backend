export class Product {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
