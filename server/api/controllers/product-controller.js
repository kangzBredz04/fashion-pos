import db from "../config/db.js";

// Controller untuk menambahkan produk baru
export const createProduct = async (req, res) => {
  const { name, description, price, stock, size, color, category } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO products (name, description, price, stock, size, category) VALUES (?, ?,  ?, ?, ?, ?)",
      [name, description, price, stock, size, category]
    );
    res.status(201).json({ msg: "Produk berhasil ditambahkan", data: result.insertId });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Controller untuk membaca semua produk
export const getAllProducts = async (_req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Controller untuk membaca produk berdasarkan ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (product.length === 0) return res.status(404).json({ msg: "Produk tidak ditemukan" });
    res.status(200).json(product[0]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Controller untuk memperbarui produk berdasarkan ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, size, category } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, size = ?, category = ? WHERE id = ?",
      [name, description, price, stock, size, category, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Produk tidak ditemukan" });
    res.status(200).json({ msg: "Produk berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Controller untuk menghapus produk berdasarkan ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Produk tidak ditemukan" });
    res.status(200).json({ msg: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
