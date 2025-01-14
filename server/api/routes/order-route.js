import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrders2,
} from "../controllers/order-controller.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/get-all", getOrders2);
router.get("/:id", getOrderById);

export default router;
