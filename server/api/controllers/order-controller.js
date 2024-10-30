import db from "../config/db.js";

// Create new order
export const createOrder = async (req, res) => {
  const { customer_id, items, total_amount, payment_status } = req.body;

  try {
    // Mulai transaksi
    await db.query("BEGIN");

    // Buat pesanan baru di tabel `orders`
    const result = await db.query(
      `INSERT INTO orders (customer_id, total_amount, payment_status) VALUES ($1, $2, $3) RETURNING *`,
      [customer_id, total_amount, payment_status]
    );
    const order = result.rows[0];
    const orderId = order.order_id;

    // Tambahkan item ke tabel `order_items`
    for (const item of items) {
      const { product_id, quantity, unit_price, total_price } = item;

      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)`,
        [orderId, product_id, quantity, unit_price, total_price]
      );
    }

    // Commit transaksi
    await db.query("COMMIT");

    res.status(201).json({ msg: "Order created successfully", data: order });
  } catch (error) {
    await db.query("ROLLBACK");
    res.status(500).json({ msg: "Error creating order", error: error.message });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await db.query("SELECT * FROM orders");
    res.status(200).json({ data: orders.rows });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving orders", error: error.message });
  }
};

// Get order by ID with items
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await db.query("SELECT * FROM orders WHERE order_id = $1", [
      id,
    ]);

    if (order.rows.length === 0) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const orderItems = await db.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [id]
    );

    res.status(200).json({ order: order.rows[0], items: orderItems.rows });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving order", error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { payment_status } = req.body;

  try {
    const result = await db.query(
      "UPDATE orders SET payment_status = $1 WHERE order_id = $2 RETURNING *",
      [payment_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ msg: "Order status updated", data: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error updating order status", error: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    const result = await db.query(
      "DELETE FROM orders WHERE order_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting order", error: error.message });
  }
};
