import { OrderStatus } from '../enums/order-status.enum';
import { OrderProduct } from '../value-objects/order-product';

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly date: Date,
    public readonly customer: string,
    public readonly products: OrderProduct[],
    public readonly status: OrderStatus,
  ) {}
}

export class OrderStateChangedEvent {
  constructor(
    public readonly orderId: string,
    public readonly newState: OrderStatus,
  ) {}
}

export class OrderProductAddedEvent {
  constructor(
    public readonly orderId: string,
    public readonly product: OrderProduct,
  ) {}
}

export class OrderProductRemovedEvent {
  constructor(
    public readonly orderId: string,
    public readonly productId: string,
  ) {}
}
