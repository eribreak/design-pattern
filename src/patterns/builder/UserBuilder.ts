import { User } from "@prisma/client";

export class UserBuilder {
  private user: Partial<User> = {};

  withId(id: number): UserBuilder {
    this.user.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  withAge(age: number): UserBuilder {
    this.user.age = age;
    return this;
  }

  withCreatedAt(date: Date): UserBuilder {
    this.user.createdAt = date;
    return this;
  }

  withUpdatedAt(date: Date): UserBuilder {
    this.user.updatedAt = date;
    return this;
  }

  build(): Omit<User, "id"> & { email: string; name: string; age: number | null } {
    return {
      email: this.user.email!,
      name: this.user.name!,
      age: this.user.age ?? null,
      createdAt: this.user.createdAt ?? new Date(),
      updatedAt: this.user.updatedAt ?? new Date(),
    };
  }

  reset(): UserBuilder {
    this.user = {};
    return this;
  }
}