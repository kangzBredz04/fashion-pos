import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Periksa `localStorage` saat komponen dimuat
  useEffect(() => {
    const storedName = localStorage.getItem("full_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("full_name");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUserName("");
    navigate("/login"); // Redirect ke halaman login setelah logout
  };

  const [role, setRole] = useState(null);

  useEffect(() => {
    // Mengambil role dari localStorage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <header className="flex-col">
      <div className="flex px-10 h-16 p-3 items-center justify-between bg-blue-500 text-white">
        <h1 className="font-bold text-2xl">Fashion POS</h1>
        <div className="flex gap-5 items-center relative">
          <input
            type="text"
            placeholder="Search"
            className="rounded p-2 text-black"
          />

          {/* Tampilkan nama pengguna atau "Login" */}
          {userName ? (
            <div className="relative">
              <p
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="cursor-pointer"
              >
                {userName}
              </p>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white text-black rounded shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="flex justify-around text-center h-16 items-center bg-gray-200 font-semibold">
        {role === "Kasir" && (
          <>
            <Link to={"/"}>Dashboard</Link>
            <Link to={"/transaction"}>Bukti Penjualan</Link>
          </>
        )}
        {role === "Owner" && (
          <>
            <Link to={"/barang"}>Barang</Link>
            <Link to={"/sales-report"}>Laporan Harian</Link>
            <Link to={"/discount"}>Diskon</Link>
          </>
        )}
      </div>
    </header>
  );
}
