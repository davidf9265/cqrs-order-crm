import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/enums/order-status.enum';

export class OrderProductPayload {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty()
  @IsString()
  customer: string;

  @ApiProperty({ type: [OrderProductPayload] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductPayload)
  products: OrderProductPayload[];
}

export class ChangeOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  newState: OrderStatus;
}
