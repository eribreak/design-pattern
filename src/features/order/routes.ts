import { Router } from "express";
import { OrderController } from "./OrderController";

const router = Router();
const controller = new OrderController();

router.post("/", (req, res, next) => controller.create(req, res, next));
router.get("/", (req, res, next) => controller.getAll(req, res, next));
router.get("/user/:userId", (req, res, next) => controller.getByUser(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.patch("/:id", (req, res, next) => controller.update(req, res, next));
router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

export default router;