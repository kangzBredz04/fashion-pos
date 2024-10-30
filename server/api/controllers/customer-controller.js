import db from "../config/db.js";

// Create new customer
export const createCustomer = async (req, res) => {
  const { full_name, phone, address, city } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO customers (full_name, phone, address, city) VALUES ($1, $2, $3, $4) RETURNING *`,
      [full_name, phone, address, city]
    );
    res
      .status(201)
      .json({ msg: "Customer created successfully", data: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error creating customer", error: error.message });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await db.query("SELECT * FROM customers");
    res.status(200).json({ data: customers.rows });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving customers", error: error.message });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await db.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);

    if (customer.rows.length === 0) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    res.status(200).json({ data: customer.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving customer", error: error.message });
  }
};

// Update customer by ID
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, address, city } = req.body;

  try {
    const result = await db.query(
      `UPDATE customers SET full_name = $1, phone = $2, address = $3, city = $4 WHERE id = $5 RETURNING *`,
      [full_name, phone, address, city, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    res
      .status(200)
      .json({ msg: "Customer updated successfully", data: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error updating customer", error: error.message });
  }
};

// Delete customer by ID
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM customers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    res.status(200).json({ msg: "Customer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error deleting customer", error: error.message });
  }
};
