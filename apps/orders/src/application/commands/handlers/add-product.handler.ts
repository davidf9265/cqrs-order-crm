import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddProductCommand } from '../impl/order.commands';
import { IOrderWriteRepository } from '../../../domain/ports/order-write.repository.interface';
import { OrderProduct } from '../../../domain/value-objects/order-product';

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  constructor(
    @Inject(IOrderWriteRepository)
    private readonly repository: IOrderWriteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddProductCommand): Promise<void> {
    const { orderId, product } = command;
    
    const orderData = await this.repository.findById(orderId);
    if (!orderData) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    const order = this.publisher.mergeObjectContext(orderData);
    
    order.addProduct(new OrderProduct(product.productId, product.quantity, product.price));

    await this.repository.save(order);
    order.commit();
  }
}
