type CommandHandler<T = unknown> = (command: T) => Promise<void>;

export interface Command {
  type: string;
}

export class CommandBus {
  private handlers = new Map<string, CommandHandler>();

  register<T extends Command>(type: string, handler: CommandHandler<T>): void {
    this.handlers.set(type, handler as CommandHandler);
  }

  async dispatch<T extends Command>(command: T): Promise<void> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.type}`);
    }
    await handler(command);
  }
}