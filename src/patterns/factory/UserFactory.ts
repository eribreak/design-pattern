import { User } from "@prisma/client";

export class UserFactory {
  create(data: { email: string; name: string; age?: number }): User {
    return {
      id: 0, // will be set by database
      email: data.email,
      name: data.name,
      age: data.age ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }

  createForSeed(email: string, name: string, age: number | null): User {
    return this.create({ email, name, age: age ?? undefined });
  }
}