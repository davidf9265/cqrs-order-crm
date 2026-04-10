import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersController } from '../presentation/controllers/orders.controller';
import { CommandHandlers } from '../application/commands/handlers';
import { QueryHandlers } from '../application/queries/handlers';
import { EventHandlers } from '../infrastructure/events/handlers';
import { OrderEntity } from '../infrastructure/database/write/entities/order.entity';
import { OrderItemEntity } from '../infrastructure/database/write/entities/order-item.entity';
import { OrderModelDefinition, OrderSchema, OrderSchemaName } from '../infrastructure/database/read/schemas/order.schema';
import { IOrderWriteRepository } from '../domain/ports/order-write.repository.interface';
import { OrderWriteRepository } from '../infrastructure/database/write/order-write.repository';
import { IOrderReadRepository } from '../domain/ports/order-read.repository.interface';
import { OrderReadRepository } from '../infrastructure/database/read/order-read.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    MongooseModule.forFeature([{ name: OrderSchemaName, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: IOrderWriteRepository,
      useClass: OrderWriteRepository,
    },
    {
      provide: IOrderReadRepository,
      useClass: OrderReadRepository,
    },
  ],
})
export class OrdersModule {}
