export class OrderProduct {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number,
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
  }
}
