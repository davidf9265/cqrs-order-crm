import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderCreatedEvent } from '../../../domain/events/order.events';
import { IOrderReadRepository } from '../../../domain/ports/order-read.repository.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument, OrderSchemaName } from '../../database/read/schemas/order.schema';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedEventHandler implements IEventHandler<OrderCreatedEvent> {
  constructor(
    @InjectModel(OrderSchemaName) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async handle(event: OrderCreatedEvent) {
    const { orderId, date, customer, products, status } = event;
    
    // Calculates total amoount
    const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    const newOrder = new this.orderModel({
      id: orderId,
      date,
      customer,
      status,
      products: products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price
      })),
      totalAmount,
    });

    await newOrder.save();
  }
}
