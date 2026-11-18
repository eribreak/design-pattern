export interface PaymentGatewayResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface IPaymentGateway {
  charge(amount: number, data?: Record<string, unknown>): Promise<PaymentGatewayResult>;
  refund(transactionId: string): Promise<PaymentGatewayResult>;
  getProviderName(): string;
}