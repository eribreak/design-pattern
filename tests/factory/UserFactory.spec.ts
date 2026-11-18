import { UserFactory } from "../../src/patterns/factory/UserFactory";

describe("UserFactory", () => {
  let factory: UserFactory;

  beforeEach(() => {
    factory = new UserFactory();
  });

  describe("create", () => {
    it("should create a user with required fields", () => {
      const user = factory.create({
        email: "factory@example.com",
        name: "Factory Test",
      });

      expect(user.email).toBe("factory@example.com");
      expect(user.name).toBe("Factory Test");
      expect(user.id).toBe(0); // Will be set by DB
      expect(user.createdAt).toBeDefined();
    });

    it("should create a user with optional age", () => {
      const user = factory.create({
        email: "factory-age@example.com",
        name: "Factory Age Test",
        age: 42,
      });

      expect(user.age).toBe(42);
    });

    it("should create user without age (age is null)", () => {
      const user = factory.create({
        email: "factory-no-age@example.com",
        name: "No Age User",
      });

      expect(user.age).toBeNull();
    });
  });

  describe("createForSeed", () => {
    it("should create user for seeding", () => {
      const user = factory.createForSeed("seed@example.com", "Seed User", 99);

      expect(user.email).toBe("seed@example.com");
      expect(user.name).toBe("Seed User");
      expect(user.age).toBe(99);
    });
  });
});