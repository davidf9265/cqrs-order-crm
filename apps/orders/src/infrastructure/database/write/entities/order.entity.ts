import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { OrderStatus } from '../../../../domain/enums/order-status.enum';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  customer: string;

  @Column({ type: 'varchar', enum: OrderStatus })
  status: OrderStatus;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true, eager: true })
  items: OrderItemEntity[];
}
