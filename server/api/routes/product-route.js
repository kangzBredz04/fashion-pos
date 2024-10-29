import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product-controller.js";

const router = express.Router();

// Rute untuk membuat produk baru
router.post("/", createProduct);

// Rute untuk membaca semua produk
router.get("/", getAllProducts);

// Rute untuk membaca produk berdasarkan ID
router.get("/:id", getProductById);

// Rute untuk memperbarui produk berdasarkan ID
router.put("/:id", updateProduct);

// Rute untuk menghapus produk berdasarkan ID
router.delete("/:id", deleteProduct);

export default router;
