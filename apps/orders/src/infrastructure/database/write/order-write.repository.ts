import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrderWriteRepository } from '../../../domain/ports/order-write.repository.interface';
import { Order } from '../../../domain/models/order';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderProduct } from '../../../domain/value-objects/order-product';
import { EventPublisher } from '@nestjs/cqrs';

@Injectable()
export class OrderWriteRepository implements IOrderWriteRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemRepo: Repository<OrderItemEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const entity = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!entity) return null;

    const order = new Order(entity.id);
    const products = entity.items.map(i => new OrderProduct(i.productId, i.quantity, Number(i.price)));
    // We recreate the state bypassing the business logic to just load it
    // An alternative is using state hydration
    order['date'] = entity.date;
    order['customer'] = entity.customer;
    order['status'] = entity.status;
    order['products'] = products;

    return order;
  }

  async save(order: Order): Promise<void> {
    let entity = await this.orderRepo.findOne({ where: { id: order.getId() }, relations: ['items'] });
    
    if (!entity) {
      entity = new OrderEntity();
      entity.id = order.getId();
    }

    entity.date = order.getDate();
    entity.customer = order.getCustomer();
    entity.status = order.getStatus();

    // Map domain products to entity items
    // Since items could have been removed, we can simplify by replacing them all
    if (entity.items && entity.items.length > 0) {
      await this.itemRepo.remove(entity.items);
    }

    entity.items = order.getProducts().map(p => {
      const item = new OrderItemEntity();
      item.productId = p.productId;
      item.quantity = p.quantity;
      item.price = p.price;
      return item;
    });

    await this.orderRepo.save(entity);
  }
}
