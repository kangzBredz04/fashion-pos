import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header className="flex-col">
      <div className="flex px-10 h-16 p-3 items-center justify-between bg-blue-500 text-white">
        <h1 className="font-bold text-2xl">Sistem Penjualan</h1>
        <div className="flex gap-5 items-center">
          <input
            type="text"
            placeholder="Search"
            className="rounded p-2 text-black"
          />
          <p>Sandika Galih</p>
        </div>
      </div>

      <div className="grid grid-cols-4 text-center h-16 items-center bg-gray-200 font-semibold">
        <Link to={"/"}>Dashboard</Link>
        <Link to={"/barang"}>Barang</Link>
        <Link to={"/grafik"}>Grafik</Link>
        <Link to={"user"}>User</Link>
      </div>
    </header>
  );
}
