import { useContext, useState } from "react";
import { AllContext } from "../App";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export default function Dashboard() {
  const [purchases, setPurchases] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [cash, setCash] = useState("");

  const { products } = useContext(AllContext);

  const addItemToPurchase = (item) => {
    setPurchases((prevPurchases) => {
      const existingItem = prevPurchases.find((p) => p.id === item.id);
      if (existingItem) {
        return prevPurchases.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prevPurchases, { ...item, quantity: 1 }];
      }
    });
    setShowPopup(false);
  };

  const updateQuantity = (id, change) => {
    setPurchases((prevPurchases) => {
      return prevPurchases
        .map((p) => {
          if (p.id === id) {
            const newQuantity = p.quantity + change;
            if (newQuantity <= 0) return null;
            return { ...p, quantity: newQuantity };
          }
          return p;
        })
        .filter(Boolean);
    });
  };

  const totalAmount = purchases.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const changeAmount = cash
    ? parseInt(cash.replace(/\./g, "")) - totalAmount
    : 0;

  const handleProcess = () => {
    if (window.confirm("Apakah Anda yakin ingin memproses pesanan?")) {
      setPurchases([]);
      setCash("");
    }
  };

  return (
    <div className="flex gap-3 p-3">
      <div className="w-3/4 bg-gray-100 p-5 rounded-lg shadow-md">
        <h1 className="text-gray-800 text-2xl font-bold">Daftar Pembelian</h1>
        {purchases.length > 0 ? (
          <table className="w-full mt-5 bg-white text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-gray-700">No</th>
                <th className="p-2 text-gray-700">Nama</th>
                <th className="p-2 text-gray-700">Harga</th>
                <th className="p-2 text-gray-700">Ukuran</th>
                <th className="p-2 text-gray-700">Kategori</th>
                <th className="p-2 text-gray-700">Jumlah</th>
                <th className="p-2 text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 text-gray-700">{index + 1}</td>
                  <td className="p-2 text-gray-700">{item.name}</td>
                  <td className="p-2 text-gray-700">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="p-2 text-gray-700">{item.size}</td>
                  <td className="p-2 text-gray-700">{item.category}</td>
                  <td className="p-2">
                    <div className="flex justify-around mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-blue-500 text-white rounded-full px-2 flex items-center"
                      >
                        +
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-blue-500 text-white rounded-full px-2 flex items-center"
                      >
                        -
                      </button>
                    </div>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => updateQuantity(item.id, -item.quantity)}
                      className="bg-red-400 text-white rounded-md px-3 py-1 hover:bg-red-500"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700 mt-5">
            Belum ada pesanan. Silakan tambah pesanan.
          </p>
        )}
        <button
          onClick={() => setShowPopup(true)}
          className="mt-5 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Tambah Pesanan
        </button>
      </div>

      <div className="w-1/4 bg-blue-100 flex-col p-3 rounded-lg shadow-md">
        <h1 className="text-2xl text-gray-700 font-bold mb-3">Total</h1>
        <h1 className="text-2xl text-gray-800 font-semibold">
          {formatCurrency(totalAmount)}
        </h1>
        <input
          type="text"
          placeholder="Masukan total uang tunai"
          className="rounded-md p-2 w-full mt-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={cash}
          onChange={(e) =>
            setCash(
              e.target.value
                .replace(/\D/g, "")
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
            )
          }
        />
        <h1 className="text-lg text-gray-700 mt-2">
          Kembali {formatCurrency(changeAmount)}
        </h1>
        <button
          onClick={handleProcess}
          className="w-full bg-green-500 py-2 rounded-md font-bold mt-2 text-white hover:bg-green-600 transition"
        >
          Proses
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Pilih Barang
            </h2>
            {products.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-3 p-3 border-b border-gray-200"
              >
                <div>
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <div className="text-gray-600 text-sm">
                    <span>{formatCurrency(item.price)}</span> |{" "}
                    <span>Size: {item.size}</span> |{" "}
                    <span>Category: {item.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => addItemToPurchase(item)}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded"
                >
                  Tambah
                </button>
              </div>
            ))}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
