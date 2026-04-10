import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSalesSummaryQuery } from '../impl/order.queries';
import { IOrderReadRepository } from '../../../domain/ports/order-read.repository.interface';

@QueryHandler(GetSalesSummaryQuery)
export class GetSalesSummaryHandler implements IQueryHandler<GetSalesSummaryQuery> {
  constructor(
    @Inject(IOrderReadRepository)
    private readonly repository: IOrderReadRepository,
  ) {}

  async execute(query: GetSalesSummaryQuery) {
    return this.repository.getSalesSummary();
  }
}
