import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/client";
import { ProductRepository } from "../../patterns/repository/ProductRepository";
import { CreateProductDto, UpdateProductDto, ProductResponse } from "./dto";

const productRepository = new ProductRepository(prisma);

function toProductResponse(product: any): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, price, stock }: CreateProductDto = req.body;
      const product = await productRepository.create({ name, description, price, stock });
      res.status(201).json({ success: true, data: toProductResponse(product) });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await productRepository.findAll();
      res.json({ success: true, data: products.map(toProductResponse) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productRepository.findById(Number(req.params.id));
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({ success: true, data: toProductResponse(product) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, price, stock }: UpdateProductDto = req.body;
      const product = await productRepository.update(Number(req.params.id), { name, description, price, stock });
      res.json({ success: true, data: toProductResponse(product) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productRepository.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async decrementStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quantity } = req.body;
      const product = await productRepository.decrementStock(Number(req.params.id), quantity);
      res.json({ success: true, data: toProductResponse(product) });
    } catch (error) {
      next(error);
    }
  }
}