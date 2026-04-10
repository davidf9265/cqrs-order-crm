import { Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { OrderEntity } from '../infrastructure/database/write/entities/order.entity';
import { OrderItemEntity } from '../infrastructure/database/write/entities/order-item.entity';
import { OrdersModule } from './orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:', // Or we can use a file like './write-db.sqlite'
      dropSchema: true,
      entities: [OrderEntity, OrderItemEntity],
      synchronize: true, // Used for dev
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log(`[ReadDB] Connected to in-memory MongoDB at ${uri}`);
        return { uri };
      },
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
