import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RemoveProductCommand } from '../impl/order.commands';
import { IOrderWriteRepository } from '../../../domain/ports/order-write.repository.interface';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler implements ICommandHandler<RemoveProductCommand> {
  constructor(
    @Inject(IOrderWriteRepository)
    private readonly repository: IOrderWriteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveProductCommand): Promise<void> {
    const { orderId, productId } = command;
    
    const orderData = await this.repository.findById(orderId);
    if (!orderData) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    const order = this.publisher.mergeObjectContext(orderData);
    
    order.removeProduct(productId);

    await this.repository.save(order);
    order.commit();
  }
}
