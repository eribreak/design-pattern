import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/client";
import { UserRepository } from "../../patterns/repository/UserRepository";
import { CreateUserDto, UpdateUserDto, UserResponse } from "./dto";
import { UserFactory } from "../../patterns/factory/UserFactory";

const userRepository = new UserRepository(prisma);
const _userFactory = new UserFactory();

function toUserResponse(user: any): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    age: user.age,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, age }: CreateUserDto = req.body;
      const user = await userRepository.create({ email, name, age });
      res.status(201).json({ success: true, data: toUserResponse(user) });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const users = await userRepository.findAll(page, limit);
      res.json({ success: true, data: users.map(toUserResponse) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userRepository.findById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }
      res.json({ success: true, data: toUserResponse(user) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, age }: UpdateUserDto = req.body;
      const user = await userRepository.update(Number(req.params.id), { name, age });
      res.json({ success: true, data: toUserResponse(user) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userRepository.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}