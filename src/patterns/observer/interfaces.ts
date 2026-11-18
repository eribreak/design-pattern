export type EventType = "ORDER_CREATED" | "ORDER_UPDATED" | "ORDER_CANCELLED" | "PAYMENT_COMPLETED" | "PAYMENT_FAILED";

export interface EventData {
  orderId?: number;
  userId: number;
  amount?: number;
  status?: string;
  message?: string;
}

export interface IObserver {
  handle(eventType: EventType, data: EventData): Promise<void>;
}

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(eventType: EventType, data: EventData): Promise<void>;
}