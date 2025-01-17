import db from "../config/db.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

// Register controller
export const register = async (req, res) => {
  const { full_name, username, password, role } = req.body;

  try {
    // Check if the username already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "Username sudah digunakan" });
    }

    // Insert user ke database tanpa hashing password
    const [result] = await db.query(
      "INSERT INTO users (full_name, username, password, role) VALUES (?, ?, ?, ?)",
      [full_name, username, password, role] // Save password directly
    );

    res
      .status(201)
      .json({ msg: "Registrasi berhasil", userId: result.insertId });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Login controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const users = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = users[0][0];

    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    // Cek apakah password dari DB dan dari input memiliki nilai
    if (!user.password || !password) {
      return res.status(400).json({ msg: "Password tidak boleh kosong" });
    }

    // Bandingkan password dari input dan yang ada di database
    if (user.password !== password) {
      return res.status(400).json({ msg: "Password salah" });
    }

    // Jika login berhasil
    res.json({ msg: "Login berhasil", data: user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// MyAccount controller
export const myAccount = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "Akses ditolak" });
    }

    // Verifikasi token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil data user berdasarkan ID dari token
    const [users] = await db.query(
      "SELECT full_name, username FROM users WHERE id = ?",
      [decoded.id]
    );
    const user = users[0];

    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    res.json({ status: "Berhasil", data: user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Logout controller
export const logout = (_req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logout berhasil" });
};
