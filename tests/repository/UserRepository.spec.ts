import { prisma } from "../../src/database/client";
import { UserRepository } from "../../src/patterns/repository/UserRepository";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository(prisma);
  });

  describe("create", () => {
    it("should create a user", async () => {
      const user = await repository.create({
        email: "test@example.com",
        name: "Test User",
        age: 25,
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.age).toBe(25);
    });
  });

  describe("findById", () => {
    it("should find a user by id", async () => {
      const created = await repository.create({
        email: "find@example.com",
        name: "Find User",
        age: 30,
      });

      const user = await repository.findById(created.id);

      expect(user).not.toBeNull();
      expect(user?.email).toBe("find@example.com");
    });

    it("should return null for non-existent user", async () => {
      const user = await repository.findById(999999);
      expect(user).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      await repository.create({
        email: "emailtest@example.com",
        name: "Email Test",
        age: 28,
      });

      const user = await repository.findByEmail("emailtest@example.com");

      expect(user).not.toBeNull();
      expect(user?.name).toBe("Email Test");
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const created = await repository.create({
        email: "update@example.com",
        name: "Original Name",
        age: 20,
      });

      const updated = await repository.update(created.id, { name: "Updated Name", age: 21 });

      expect(updated.name).toBe("Updated Name");
      expect(updated.age).toBe(21);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const created = await repository.create({
        email: "delete@example.com",
        name: "To Delete",
        age: 35,
      });

      await repository.delete(created.id);

      const deleted = await repository.findById(created.id);
      expect(deleted).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return paginated users", async () => {
      const users = await repository.findAll(1, 10);
      expect(Array.isArray(users)).toBe(true);
    });
  });
});