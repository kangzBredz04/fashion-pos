import { useContext, useEffect, useState } from "react";
import { AllContext } from "../App";
import { api } from "../util";
import { useNavigate } from "react-router-dom";

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
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0); // Initialize discount percentage

  const { products } = useContext(AllContext);

  const navigate = useNavigate(); // Initialize navigate for redirection

  // Check localStorage for user data on component mount
  useEffect(() => {
    const fullName = localStorage.getItem("full_name");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // Redirect if user data is missing
    if (!fullName || !username || !role) {
      navigate("/restricted"); // Redirect to restricted access page
    }
  }, [navigate]);

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
  const discountedTotal = totalAmount - discountAmount;
  const changeAmount = cash
    ? parseInt(cash.replace(/\./g, "")) - discountedTotal
    : 0;

  const handleProcess = () => {
    if (window.confirm("Apakah Anda yakin ingin memproses pesanan?")) {
      const order = {
        total: discountedTotal,
        payment_status: "Paid",
        items: purchases.map((item) => ({
          id_product: item.id,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
        })),
        discount: discountAmount,
      };

      api.post("/order", order).then((res) => {
        alert(res.msg);
        setPurchases([]);
        setCash("");
        setDiscountCode("");
        setDiscountAmount(0);
        setDiscountPercentage(0);

        // Show the print area, trigger print, then hide it again
        const printArea = document.getElementById("print-area");
        printArea.style.display = "block";
        window.print();
        printArea.style.display = "none";
        window.location.reload();
      });
    }
  };

  const validateDiscountCode = async () => {
    try {
      // Fetch all discount codes
      const response = await api.get("/discount"); // Adjust the endpoint to fetch all discount codes
      const discountCodes = response.data; // Assuming response.data contains an array of discount codes

      // Find the discount code that matches the entered code
      const discount = discountCodes.find(
        (code) => code.code === discountCode && code.status === 1
      );

      if (discount) {
        // If a matching active discount code is found, calculate the discount amount
        setDiscountAmount((totalAmount * discount.total_discount) / 100);
        setDiscountPercentage(discount.total_discount);
        alert(
          `Kode diskon valid! Diskon sebesar ${discount.total_discount}% diterapkan.`
        );
      } else {
        alert("Kode diskon tidak valid atau tidak aktif.");
        setDiscountAmount(0); // Reset discount amount if invalid
      }
    } catch (error) {
      console.error("Error fetching discount codes:", error);
      alert("Terjadi kesalahan saat memvalidasi kode diskon.");
      setDiscountAmount(0); // Reset discount amount in case of an error
    }
  };

  return (
    <div className="flex gap-3 p-3">
      {/* PRINT PDF */}
      <div id="print-area" className="hidden p-5 font-sans w-full max-w-lg">
        <h2 className="text-center text-xl font-bold mb-5">Order Receipt</h2>

        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th className="border-b border-gray-300 py-2 text-left">#</th>
              <th className="border-b border-gray-300 py-2 text-left">
                Product
              </th>
              <th className="border-b border-gray-300 py-2 text-center">
                Quantity
              </th>
              <th className="border-b border-gray-300 py-2 text-right">
                Unit Price
              </th>
              <th className="border-b border-gray-300 py-2 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((item, index) => (
              <tr key={item.id}>
                <td className="border-b border-gray-200 py-2 text-left">
                  {index + 1}
                </td>
                <td className="border-b border-gray-200 py-2 text-left">
                  {item.name}
                </td>
                <td className="border-b border-gray-200 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border-b border-gray-200 py-2 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="border-b border-gray-200 py-2 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right space-y-2">
          <p>
            <strong>Total Purchase:</strong> {formatCurrency(totalAmount)}
          </p>
          {discountAmount > 0 && (
            <p>
              <strong>Diskon:</strong> {formatCurrency(discountAmount)}
            </p>
          )}
          <p>
            <strong>Total Pembayaran:</strong> {formatCurrency(discountedTotal)}
          </p>
          <p>
            <strong>Payment Status:</strong> Paid
          </p>
          <p>
            <strong>Cashier:</strong> {`${localStorage.getItem("full_name")}`}
          </p>
        </div>
      </div>

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
        {purchases.length > 0 ? (
          <div className="mt-5">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Masukkan kode diskon"
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={validateDiscountCode}
              className="bg-green-500 text-white px-4 py-2 ml-2 rounded"
            >
              Gunakan
            </button>
          </div>
        ) : (
          ""
        )}
        <button
          onClick={() => setShowPopup(true)}
          className="mt-5 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Tambah Pesanan
        </button>
      </div>

      <div className="w-1/4 bg-blue-100 flex-col p-3 rounded-lg shadow-md">
        <h1 className="text-2xl text-gray-700 font-bold mb-1">Total</h1>
        <h1 className="text-2xl text-gray-800 font-semibold">
          {formatCurrency(totalAmount)}
        </h1>

        {/* Discount Section */}
        {discountAmount > 0 && (
          <div className="mt-4">
            <h1 className="text-2xl text-gray-700 font-bold mb-1">Diskon</h1>
            <h1 className="text-2xl text-red-500 font-semibold">
              {formatCurrency(discountAmount)} (Diskon: {discountPercentage}%)
            </h1>
          </div>
        )}

        {/* Total After Discount */}
        <h1 className=" mt-4">
          <h1 className="text-2xl text-gray-700 font-bold mb-1">
            Total Setelah Diskon:
          </h1>
          <h1 className="text-2xl text-gray-700 font-semibold">
            {formatCurrency(totalAmount - discountAmount)}
          </h1>
        </h1>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            Rp
          </span>
          <input
            type="text"
            placeholder="Masukan total uang tunai"
            className="rounded-md p-2 w-full pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={cash}
            onChange={(e) =>
              setCash(
                e.target.value
                  .replace(/\D/g, "")
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
              )
            }
          />
        </div>
        <h1 className="text-lg text-gray-700 mt-2">
          Kembali {formatCurrency(changeAmount)}
        </h1>
        <button
          onClick={handleProcess}
          disabled={changeAmount < 0}
          className={`w-full py-2 rounded-md font-bold mt-2 transition text-white ${
            changeAmount < 0
              ? "bg-green-300"
              : "bg-green-500 hover:bg-green-600"
          }`}
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
