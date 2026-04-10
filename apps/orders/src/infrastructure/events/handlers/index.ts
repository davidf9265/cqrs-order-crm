export const EventHandlers = [
  require('./order-created.handler').OrderCreatedEventHandler,
  require('./order-state-changed.handler').OrderStateChangedEventHandler,
  require('./order-product.handlers').OrderProductAddedEventHandler,
  require('./order-product.handlers').OrderProductRemovedEventHandler,
];
