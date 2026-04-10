import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListCustomerOrdersQuery } from '../impl/order.queries';
import { IOrderReadRepository, OrderReadDto } from '../../../domain/ports/order-read.repository.interface';

@QueryHandler(ListCustomerOrdersQuery)
export class ListCustomerOrdersHandler implements IQueryHandler<ListCustomerOrdersQuery> {
  constructor(
    @Inject(IOrderReadRepository)
    private readonly repository: IOrderReadRepository,
  ) {}

  async execute(query: ListCustomerOrdersQuery): Promise<OrderReadDto[]> {
    return this.repository.findByCustomer(query.customer);
  }
}
