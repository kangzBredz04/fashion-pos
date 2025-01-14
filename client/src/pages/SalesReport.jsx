import { useContext, useEffect, useRef, useState } from "react";
import { AllContext } from "../App";
import { DownloadTableExcel } from "react-export-table-to-excel";

// Utility function to format numbers to Indonesian Rupiah
const formatRupiah = (amount) => {
  return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

// Utility function to format the date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

export default function SalesReport() {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [productName, setProductName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const { orders } = useContext(AllContext);

  // Fetch sales data from context
  useEffect(() => {
    setSalesData(orders);
    setFilteredData(orders);
  }, [orders]);

  // Filter data based on search, date range, and pagination
  useEffect(() => {
    let data = salesData;

    if (productName) {
      data = data.filter((item) =>
        item.product_name.toLowerCase().includes(productName.toLowerCase())
      );
    }

    if (startDate && endDate) {
      data = data.filter(
        (item) =>
          new Date(item.order_date) >= new Date(startDate) &&
          new Date(item.order_date) <= new Date(endDate + "T23:59:59")
      );
    }

    setFilteredData(data.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }, [productName, startDate, endDate, page, itemsPerPage, salesData]);

  // Calculate total income
  const totalIncome = filteredData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Find most sold products
  const productSales = salesData.reduce((acc, item) => {
    acc[item.product_name] = (acc[item.product_name] || 0) + item.quantity;
    return acc;
  }, {});

  const mostSoldProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Get top 3 sold products

  // EXPORT DATA TABLE TO EXCEL
  const tableRef = useRef(null);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Laporan Penjualan</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan nama produk"
          className="p-2 border border-gray-300 rounded"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={5}>Tampilkan 5</option>
          <option value={10}>Tampilkan 10</option>
          <option value={15}>Tampilkan 15</option>
        </select>

        <div className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition cursor-pointer">
          <DownloadTableExcel
            filename="Laporan Harian"
            sheet="Laporan Harian"
            currentTableRef={tableRef.current}
          >
            Export to Excel
          </DownloadTableExcel>
        </div>
      </div>

      {/* Sales Table */}
      <table className="w-full bg-white shadow-md rounded" ref={tableRef}>
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">No</th>
            <th className="p-3 border">Tanggal</th>
            <th className="p-3 border">Nama Barang</th>
            <th className="p-3 border">Jumlah</th>
            <th className="p-3 border">Harga</th>
            <th className="p-3 border">Total Harga Beli</th>
            <th className="p-3 border">Status Pembayaran</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id} className="text-center">
              <td className="p-3 border">
                {(page - 1) * itemsPerPage + index + 1}
              </td>
              <td className="p-3 border">{formatDate(item.order_date)}</td>
              <td className="p-3 border">{item.product_name}</td>
              <td className="p-3 border">{item.quantity}</td>
              <td className="p-3 border">{formatRupiah(item.price)}</td>
              <td className="p-3 border">
                {formatRupiah(item.price * item.quantity)}
              </td>
              <td className="p-3 border">{item.payment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Income */}
      <div className="mt-4 text-right font-semibold">
        <span>Total Pemasukan: {formatRupiah(totalIncome)}</span>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="p-2 border rounded bg-gray-200"
        >
          Sebelumnya
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={filteredData.length < itemsPerPage}
          className="p-2 border rounded bg-gray-200"
        >
          Selanjutnya
        </button>
      </div>

      {/* Most Sold Products */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Produk Terlaris</h2>
        <div>
          {mostSoldProducts.length > 0 ? (
            <table className="w-full bg-white shadow-md rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">No</th>
                  <th className="p-3 border">Nama Produk</th>
                  <th className="p-3 border">Jumlah Terjual</th>
                </tr>
              </thead>
              <tbody>
                {mostSoldProducts.map(([name, quantity], index) => (
                  <tr key={name} className="text-center">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{name}</td>
                    <td className="p-3 border">{quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-4 border">
              Belum ada produk yang terjual.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
