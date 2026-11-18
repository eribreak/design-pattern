import { ISubject, IObserver, EventType, EventData } from "./interfaces";

export class NotificationSubject implements ISubject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: IObserver): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  async notify(eventType: EventType, data: EventData): Promise<void> {
    await Promise.all(
      this.observers.map(observer => observer.handle(eventType, data))
    );
  }
}