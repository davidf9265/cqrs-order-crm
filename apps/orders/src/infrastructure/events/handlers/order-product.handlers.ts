import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderProductAddedEvent, OrderProductRemovedEvent } from '../../../domain/events/order.events';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument, OrderSchemaName } from '../../database/read/schemas/order.schema';

@EventsHandler(OrderProductAddedEvent)
export class OrderProductAddedEventHandler implements IEventHandler<OrderProductAddedEvent> {
  constructor(
    @InjectModel(OrderSchemaName) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async handle(event: OrderProductAddedEvent) {
    const { orderId, product } = event;
    const order = await this.orderModel.findOne({ id: orderId });
    if (!order) return;

    // Recalculate everything
    const existingIndex = order.products.findIndex(p => p.productId === product.productId);
    if (existingIndex >= 0) {
      order.products[existingIndex].quantity += product.quantity;
    } else {
      order.products.push({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      });
    }

    order.totalAmount = order.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    await order.save();
  }
}

@EventsHandler(OrderProductRemovedEvent)
export class OrderProductRemovedEventHandler implements IEventHandler<OrderProductRemovedEvent> {
  constructor(
    @InjectModel(OrderSchemaName) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async handle(event: OrderProductRemovedEvent) {
    const { orderId, productId } = event;
    const order = await this.orderModel.findOne({ id: orderId });
    if (!order) return;

    order.products = order.products.filter(p => p.productId !== productId);
    order.totalAmount = order.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    await order.save();
  }
}
