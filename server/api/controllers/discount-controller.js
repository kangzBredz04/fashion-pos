import db from "../config/db.js";

// Create new discount
export const createDiscount = async (req, res) => {
  const { name, code, status } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO discounts (name, code, status) VALUES (?, ?, ?)`,
      [name, code, status]
    );
    res
      .status(201)
      .json({ msg: "Diskon Berhasil Ditambahkan", data: result.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error creating discount", error: error.message });
  }
};

// Get all discounts
export const getDiscounts = async (req, res) => {
  try {
    const [discounts] = await db.query("SELECT * FROM discounts");
    res.status(200).json({ data: discounts });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving discounts", error: error.message });
  }
};

// Get discount by ID
export const getDiscountById = async (req, res) => {
  const { id } = req.params;

  try {
    const discount = await db.query("SELECT * FROM discounts WHERE id = ?", [
      id,
    ]);

    if (discount.rows.length === 0) {
      return res.status(404).json({ msg: "Discount not found" });
    }

    res.status(200).json({ data: discount.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving discount", error: error.message });
  }
};

// Update discount by ID
export const updateDiscount = async (req, res) => {
  const { id } = req.params;
  const { name, code, status } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE discounts SET name = ?, code = ?, status = ? WHERE id = ?`,
      [name, code, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Diskon Tidak Ada" });
    }

    res.status(200).json({ msg: "Update Diskon Berhasil" });
  } catch (error) {
    res.status(500).json({ msg: "Error Update Diskon", error: error.message });
  }
};

// Delete discount by ID
export const deleteDiscount = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM discounts WHERE id = ?", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Discount Tidak Ada" });
    }

    res.status(200).json({ msg: "Dison Berhasil Dihapus" });
  } catch (error) {
    res.status(500).json({ msg: "Error Hapus Diskon", error: error.message });
  }
};
