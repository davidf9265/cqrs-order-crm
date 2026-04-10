export const QueryHandlers = [
  require('./get-order.handler').GetOrderHandler,
  require('./list-customer-orders.handler').ListCustomerOrdersHandler,
  require('./list-orders-by-state.handler').ListOrdersByStateHandler,
  require('./get-sales-summary.handler').GetSalesSummaryHandler,
];
