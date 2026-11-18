export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface IPaymentStrategy {
  process(amount: number, data?: Record<string, unknown>): Promise<PaymentResult>;
  refund(transactionId: string): Promise<PaymentResult>;
  getName(): string;
}