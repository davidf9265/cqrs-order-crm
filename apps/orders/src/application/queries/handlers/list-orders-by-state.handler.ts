import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListOrdersByStateQuery } from '../impl/order.queries';
import { IOrderReadRepository, OrderReadDto } from '../../../domain/ports/order-read.repository.interface';

@QueryHandler(ListOrdersByStateQuery)
export class ListOrdersByStateHandler implements IQueryHandler<ListOrdersByStateQuery> {
  constructor(
    @Inject(IOrderReadRepository)
    private readonly repository: IOrderReadRepository,
  ) {}

  async execute(query: ListOrdersByStateQuery): Promise<OrderReadDto[]> {
    return this.repository.findByState(query.state);
  }
}
