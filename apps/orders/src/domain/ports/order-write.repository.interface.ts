import { Order } from '../models/order';

export interface IOrderWriteRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

export const IOrderWriteRepository = Symbol('IOrderWriteRepository');
