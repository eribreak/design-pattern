type QueryHandler<T extends Query = Query, R = unknown> = (query: T) => Promise<R>;

export interface Query<T = unknown> {
  type: string;
}

export class QueryBus {
  private handlers = new Map<string, (query: Query) => Promise<unknown>>();

  register<T extends Query, R = unknown>(type: string, handler: QueryHandler<T, R>): void {
    this.handlers.set(type, handler as (query: Query) => Promise<unknown>);
  }

  async dispatch<T extends Query, R = unknown>(query: T): Promise<R> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler registered for query: ${query.type}`);
    }
    return await handler(query as Query) as R;
  }
}