export const CommandHandlers = [
  require('./create-order.handler').CreateOrderHandler,
  require('./change-order-state.handler').ChangeOrderStateHandler,
  require('./add-product.handler').AddProductHandler,
  require('./remove-product.handler').RemoveProductHandler,
];
