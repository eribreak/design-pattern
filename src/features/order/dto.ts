import { IsNumber, IsOptional, IsEnum, ArrayNotEmpty, ValidateNested, Min } from "class-validator";
import { Type } from "class-transformer";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export class OrderItemDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class CreateOrderDto {
  @IsNumber()
  userId!: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}

export interface OrderResponse {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}