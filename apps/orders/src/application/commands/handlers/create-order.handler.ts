import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateOrderCommand } from '../impl/order.commands';
import { Order } from '../../../domain/models/order';
import { OrderProduct } from '../../../domain/value-objects/order-product';
import { IOrderWriteRepository } from '../../../domain/ports/order-write.repository.interface';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(IOrderWriteRepository)
    private readonly repository: IOrderWriteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    const { orderId, customer, products } = command;
    
    // Check if duplicate? Omitted for simplicity/idempotency

    const orderProducts = products.map((p) => new OrderProduct(p.productId, p.quantity, p.price));
    
    // We instantiate the Aggregate
    const order = this.publisher.mergeObjectContext(new Order());
    order.create(orderId, new Date(), customer, orderProducts, OrderStatus.CREATED);

    // Save to Database
    await this.repository.save(order);

    // Dispatch Events
    order.commit();
  }
}
