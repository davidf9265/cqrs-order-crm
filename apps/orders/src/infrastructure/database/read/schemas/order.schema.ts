import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus } from '../../../../domain/enums/order-status.enum';

@Schema({ _id: false })
class OrderProductSchema {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}
const ProductSchema = SchemaFactory.createForClass(OrderProductSchema);

@Schema({ collection: 'orders_read_model', timestamps: true })
export class OrderModelDefinition {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  customer: string;

  @Prop({ required: true, type: String, enum: OrderStatus })
  status: OrderStatus;

  @Prop({ type: [ProductSchema], default: [] })
  products: OrderProductSchema[];

  @Prop({ required: true, default: 0 })
  totalAmount: number;
}

export type OrderDocument = OrderModelDefinition & Document;
export const OrderSchema = SchemaFactory.createForClass(OrderModelDefinition);
export const OrderSchemaName = 'OrderReadModel';
