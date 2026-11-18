import { Router } from "express";
import { PaymentController } from "./PaymentController";

const router = Router();
const controller = new PaymentController();

router.post("/", (req, res, next) => controller.create(req, res, next));
router.get("/user/:userId", (req, res, next) => controller.getAll(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));

export default router;