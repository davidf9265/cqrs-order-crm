import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderStateChangedEvent } from '../../../domain/events/order.events';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument, OrderSchemaName } from '../../database/read/schemas/order.schema';

@EventsHandler(OrderStateChangedEvent)
export class OrderStateChangedEventHandler implements IEventHandler<OrderStateChangedEvent> {
  constructor(
    @InjectModel(OrderSchemaName) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async handle(event: OrderStateChangedEvent) {
    const { orderId, newState } = event;
    
    await this.orderModel.updateOne({ id: orderId }, { $set: { status: newState } }).exec();
  }
}
