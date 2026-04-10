import { AggregateRoot } from '@nestjs/cqrs';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderProduct } from '../value-objects/order-product';
import {
  OrderCreatedEvent,
  OrderStateChangedEvent,
  OrderProductAddedEvent,
  OrderProductRemovedEvent,
} from '../events/order.events';

export class Order extends AggregateRoot {
  private id: string;
  private date: Date;
  private customer: string;
  private products: OrderProduct[];
  private status: OrderStatus;

  constructor(id?: string) {
    super();
    if (id) {
      this.id = id;
    }
    this.products = [];
  }

  public create(
    id: string,
    date: Date,
    customer: string,
    products: OrderProduct[],
    status: OrderStatus = OrderStatus.CREATED,
  ): void {
    this.id = id;
    this.date = date;
    this.customer = customer;
    this.products = [...products];
    this.status = status;

    this.apply(new OrderCreatedEvent(this.id, this.date, this.customer, this.products, this.status));
  }

  public changeState(newState: OrderStatus): void {
    if (this.status === OrderStatus.CANCELED) {
      throw new Error('Cannot change status of a canceled order');
    }
    if (this.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot change status of a delivered order');
    }

    this.status = newState;
    this.apply(new OrderStateChangedEvent(this.id, this.status));
  }

  public addProduct(product: OrderProduct): void {
    if (this.status === OrderStatus.SHIPPED || this.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot add products to an order that is already shipped or delivered');
    }

    // Check if product already exists, if so, increase quantity
    const existingIndex = this.products.findIndex((p) => p.productId === product.productId);
    if (existingIndex >= 0) {
      const existing = this.products[existingIndex];
      this.products[existingIndex] = new OrderProduct(
        existing.productId,
        existing.quantity + product.quantity,
        existing.price // assuming same price
      );
    } else {
      this.products.push(product);
    }

    this.apply(new OrderProductAddedEvent(this.id, product));
  }

  public removeProduct(productId: string): void {
    if (this.status === OrderStatus.SHIPPED || this.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot remove products from an order that is already shipped or delivered');
    }

    this.products = this.products.filter((p) => p.productId !== productId);
    this.apply(new OrderProductRemovedEvent(this.id, productId));
  }

  // Getters for repository mapping and testing
  public getId(): string {
    return this.id;
  }
  public getCustomer(): string {
    return this.customer;
  }
  public getDate(): Date {
    return this.date;
  }
  public getProducts(): OrderProduct[] {
    return this.products;
  }
  public getStatus(): OrderStatus {
    return this.status;
  }
}
