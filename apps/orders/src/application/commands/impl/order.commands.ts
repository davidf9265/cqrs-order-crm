import { OrderStatus } from '../../../domain/enums/order-status.enum';

export class OrderProductDto {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number,
  ) {}
}

export class CreateOrderCommand {
  constructor(
    public readonly orderId: string, // Normally a UUID generator or sequence
    public readonly customer: string,
    public readonly products: OrderProductDto[],
  ) {}
}

export class ChangeOrderStateCommand {
  constructor(
    public readonly orderId: string,
    public readonly newState: OrderStatus,
  ) {}
}

export class AddProductCommand {
  constructor(
    public readonly orderId: string,
    public readonly product: OrderProductDto,
  ) {}
}

export class RemoveProductCommand {
  constructor(
    public readonly orderId: string,
    public readonly productId: string,
  ) {}
}
