import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ChangeOrderStateCommand } from '../impl/order.commands';
import { IOrderWriteRepository } from '../../../domain/ports/order-write.repository.interface';

@CommandHandler(ChangeOrderStateCommand)
export class ChangeOrderStateHandler implements ICommandHandler<ChangeOrderStateCommand> {
  constructor(
    @Inject(IOrderWriteRepository)
    private readonly repository: IOrderWriteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ChangeOrderStateCommand): Promise<void> {
    const { orderId, newState } = command;
    
    // Load Aggregate
    const orderData = await this.repository.findById(orderId);
    if (!orderData) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    const order = this.publisher.mergeObjectContext(orderData);
    
    // Change state
    order.changeState(newState);

    // Save and publish
    await this.repository.save(order);
    order.commit();
  }
}
