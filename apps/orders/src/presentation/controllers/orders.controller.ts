import { Controller, Post, Body, Param, Patch, Delete, Get, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto, ChangeOrderStatusDto, OrderProductPayload } from '../dtos/order.dtos';
import { CreateOrderCommand, ChangeOrderStateCommand, AddProductCommand, RemoveProductCommand } from '../../application/commands/impl/order.commands';
import { GetOrderQuery, ListCustomerOrdersQuery, ListOrdersByStateQuery, GetSalesSummaryQuery } from '../../application/queries/impl/order.queries';
import { OrderStatus } from '../../domain/enums/order-status.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // COMMANDS
  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.commandBus.execute(
      new CreateOrderCommand(dto.orderId, dto.customer, dto.products)
    );
  }

  @Patch(':id/state')
  async changeState(@Param('id') id: string, @Body() dto: ChangeOrderStatusDto) {
    return this.commandBus.execute(new ChangeOrderStateCommand(id, dto.newState));
  }

  @Post(':id/products')
  async addProduct(@Param('id') id: string, @Body() dto: OrderProductPayload) {
    return this.commandBus.execute(new AddProductCommand(id, dto));
  }

  @Delete(':id/products/:productId')
  async removeProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.commandBus.execute(new RemoveProductCommand(id, productId));
  }

  // QUERIES
  @Get('sales-summary')
  async getSalesSummary() {
    return this.queryBus.execute(new GetSalesSummaryQuery());
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.queryBus.execute(new GetOrderQuery(id));
  }

  @Get()
  async listOrders(
    @Query('customer') customer?: string,
    @Query('state') state?: OrderStatus
  ) {
    if (customer) {
      return this.queryBus.execute(new ListCustomerOrdersQuery(customer));
    }
    if (state) {
      return this.queryBus.execute(new ListOrdersByStateQuery(state));
    }
    // Return empty by default if no filters, or normally list all.
    return [];
  }
}
