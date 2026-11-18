import { IObserver, EventType, EventData } from "./interfaces";

// Email Observer
export class EmailObserver implements IObserver {
  async handle(eventType: EventType, data: EventData): Promise<void> {
    console.log(`[EMAIL] Sending email notification: ${eventType}`, data);
    // In real app: send email via SMTP
    await new Promise(r => setTimeout(r, 50));
  }
}

// SMS Observer
export class SmsObserver implements IObserver {
  async handle(eventType: EventType, data: EventData): Promise<void> {
    console.log(`[SMS] Sending SMS notification: ${eventType}`, data);
    // In real app: send SMS via API
    await new Promise(r => setTimeout(r, 50));
  }
}

// Slack Observer
export class SlackObserver implements IObserver {
  async handle(eventType: EventType, data: EventData): Promise<void> {
    console.log(`[SLACK] Sending Slack notification: ${eventType}`, data);
    // In real app: send Slack message via webhook
    await new Promise(r => setTimeout(r, 50));
  }
}

// Console Observer (for testing/debugging)
export class ConsoleObserver implements IObserver {
  async handle(eventType: EventType, data: EventData): Promise<void> {
    console.log(`[CONSOLE] Event: ${eventType}`, JSON.stringify(data, null, 2));
  }
}