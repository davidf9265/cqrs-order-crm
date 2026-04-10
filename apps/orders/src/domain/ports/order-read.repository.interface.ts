import { OrderStatus } from '../../domain/enums/order-status.enum';

export class OrderReadDto {
  id: string;
  date: Date;
  customer: string;
  status: OrderStatus;
  products: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
}

export interface IOrderReadRepository {
  findById(id: string): Promise<OrderReadDto | null>;
  findByCustomer(customer: string): Promise<OrderReadDto[]>;
  findByState(state: OrderStatus): Promise<OrderReadDto[]>;
  getSalesSummary(): Promise<{ totalOrders: number; totalSold: number; topProducts: { productId: string; totalQuantity: number }[] }>;
}

export const IOrderReadRepository = Symbol('IOrderReadRepository');
