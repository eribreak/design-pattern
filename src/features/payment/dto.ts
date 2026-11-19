import { IsNumber, IsOptional, IsEnum } from "class-validator";

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  PAYPAL = "PAYPAL",
  CRYPTO = "CRYPTO",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export class CreatePaymentDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  @IsOptional()
  orderId?: number;

  @IsNumber()
  amount!: number;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}

export interface PaymentResponse {
  id: number;
  userId: number;
  orderId: number | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
}