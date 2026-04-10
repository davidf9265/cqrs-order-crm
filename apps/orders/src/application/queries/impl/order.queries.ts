import { OrderStatus } from '../../../domain/enums/order-status.enum';

export class GetOrderQuery {
  constructor(public readonly orderId: string) {}
}

export class ListCustomerOrdersQuery {
  constructor(public readonly customer: string) {}
}

export class ListOrdersByStateQuery {
  constructor(public readonly state: OrderStatus) {}
}

export class GetSalesSummaryQuery {
  // Empty, just a request for summary
}
