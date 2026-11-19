import { PrismaClient, Prisma } from "@prisma/client";

export abstract class BaseRepository<_T extends Prisma.ModelName> {
  protected readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected getClient(): PrismaClient {
    return this.prisma;
  }
}