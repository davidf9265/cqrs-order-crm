import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetOrderQuery } from '../impl/order.queries';
import { IOrderReadRepository, OrderReadDto } from '../../../domain/ports/order-read.repository.interface';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @Inject(IOrderReadRepository)
    private readonly repository: IOrderReadRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderReadDto> {
    return this.repository.findById(query.orderId);
  }
}
