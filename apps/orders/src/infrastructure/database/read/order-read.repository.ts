import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrderReadRepository, OrderReadDto } from '../../../domain/ports/order-read.repository.interface';
import { OrderDocument, OrderSchemaName } from './schemas/order.schema';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

@Injectable()
export class OrderReadRepository implements IOrderReadRepository {
  constructor(
    @InjectModel(OrderSchemaName) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async findById(id: string): Promise<OrderReadDto | null> {
    const order = await this.orderModel.findOne({ id }).exec();
    return order ? this.mapToDto(order) : null;
  }

  async findByCustomer(customer: string): Promise<OrderReadDto[]> {
    const orders = await this.orderModel.find({ customer }).exec();
    return orders.map(o => this.mapToDto(o));
  }

  async findByState(state: OrderStatus): Promise<OrderReadDto[]> {
    const orders = await this.orderModel.find({ status: state }).exec();
    return orders.map(o => this.mapToDto(o));
  }

  async getSalesSummary(): Promise<{ totalOrders: number; totalSold: number; topProducts: { productId: string; totalQuantity: number }[] }> {
    const totalOrders = await this.orderModel.countDocuments();
    
    const [result] = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalSold: { $sum: '$totalAmount' }
        }
      }
    ]);

    const topProducts = await this.orderModel.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalQuantity: { $sum: '$products.quantity' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          productId: '$_id',
          totalQuantity: 1,
          _id: 0
        }
      }
    ]);

    return {
      totalOrders,
      totalSold: result ? result.totalSold : 0,
      topProducts,
    };
  }

  private mapToDto(doc: any): OrderReadDto {
    return {
      id: doc.id,
      date: doc.date,
      customer: doc.customer,
      status: doc.status as OrderStatus,
      products: doc.products.map((p: any) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price
      })),
      totalAmount: doc.totalAmount
    }
  }
}
