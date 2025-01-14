import express from "express";
import {
  createDiscount,
  deleteDiscount,
  getDiscountById,
  getDiscounts,
  updateDiscount,
} from "../controllers/discount-controller.js";

const router = express.Router();

router.post("/", createDiscount);
router.get("/", getDiscounts);
router.get("/:id", getDiscountById);
router.put("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);

export default router;
