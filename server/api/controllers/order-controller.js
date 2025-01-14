import db from "../config/db.js";

export const createOrder = async (req, res) => {
  const { items, total, discount } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO orders (order_date, total, payment_status, discount) 
     VALUES (NOW(), ?, ?, ?)`,
      [total, "Paid", discount]
    );

    const orderId = result[0].insertId;

    if (!orderId) {
      throw new Error("Failed to retrieve order ID.");
    }

    for (const item of items) {
      const { id_product, quantity, total_price } = item;

      await db.query(
        `INSERT INTO order_items (id_order, id_product, quantity, total_price) 
       VALUES (?, ?, ?, ?)`,
        [orderId, id_product, quantity, total_price]
      );

      await db.query(`UPDATE products SET stock = stock - ? WHERE id = ?`, [
        quantity,
        id_product,
      ]);
    }
    res
      .status(201)
      .json({ msg: "Pesanan Berhasil Diproses", data: { order_id: orderId } });
  } catch (error) {
    res.status(500).json({ msg: "Error creating order", error: error.message });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.order_date,
        p.name AS product_name,
        oi.id_order,
        oi.quantity,
        p.price,
        (oi.quantity * p.price) AS total,
        o.payment_status
      FROM 
        orders o
      JOIN 
        order_items oi ON o.id = oi.id_order
      JOIN 
        products p ON oi.id_product = p.id
          `);
    res.status(200).json({ data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving orders", error: error.message });
  }
};

export const getOrders2 = async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders");
    res.status(200).json({ data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving orders", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await db.query("SELECT * FROM orders WHERE id = ?", [id]);

    if (order.length === 0) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const orderItems = await db.query(
      "SELECT * FROM order_items WHERE id_order = ?",
      [id]
    );

    res.status(200).json({ order: order[0], items: orderItems[0] });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving order", error: error.message });
  }
};
