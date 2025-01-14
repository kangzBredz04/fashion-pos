import { useState } from "react";
import { Link } from "react-router-dom"; // Pastikan Anda menggunakan react-router-dom
import { api } from "../util";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log({ username, password });
      api.post("/auth/login", { username, password }).then((res) => {
        alert(JSON.stringify(res.msg));

        // Simpan data ke localStorage
        localStorage.setItem("full_name", res.data.full_name);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", res.data.role);

        // Arahkan pengguna berdasarkan role
        if (res.data.role === "Kasir") {
          window.location.href = "/";
        } else if (res.data.role === "Owner") {
          window.location.href = "/barang";
        }
      });
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Masuk</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Masuk
          </button>
        </form>
        <p className="text-center">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrasi di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
