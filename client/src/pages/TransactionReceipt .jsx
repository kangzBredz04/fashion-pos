import { useContext, useState } from "react";
import { AllContext } from "../App";

export default function TransactionReceipt() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { reports, orders } = useContext(AllContext);
  const [selectedReport, setSelectedReport] = useState(null);

  console.log(selectedReport?.id);

  // Filter reports by date (inclusive of start and end dates)
  const filteredReports = reports?.filter((report) => {
    const reportDate = new Date(report.order_date);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return (!start || reportDate >= start) && (!end || reportDate <= end);
  });

  // Function to format currency
  const formatCurrency = (amount) => `Rp ${amount?.toLocaleString()}`;

  // Function to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Bukti Transaksi Penjualan
      </h1>

      {/* Date Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <label className="font-semibold text-gray-700">
          Dari Tanggal:
          <input
            type="date"
            className="ml-2 p-2 rounded border border-gray-300"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="font-semibold text-gray-700">
          Sampai Tanggal:
          <input
            type="date"
            className="ml-2 p-2 rounded border border-gray-300"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4">No</th>
              <th className="py-2 px-4">Tanggal</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Diskon</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports?.map((report, index) => (
              <tr key={index} className="text-center border-b hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{formatDate(report.order_date)}</td>
                <td className="py-2 px-4">{formatCurrency(report.total)}</td>
                <td className="py-2 px-4">{formatCurrency(report.discount)}</td>
                <td className="py-2 px-4">{report.payment_status}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              Detail Order #{selectedReport.id_order}
            </h2>
            <p>
              <strong>Tanggal:</strong> {formatDate(selectedReport.order_date)}
            </p>

            {/* Items Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full bg-gray-100 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4">Nama Barang</th>
                    <th className="py-2 px-4">Kuantitas</th>
                    <th className="py-2 px-4">Harga</th>
                    <th className="py-2 px-4">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((item) => item.id_order === selectedReport.id)
                    .map((item, index) => (
                      <tr key={index} className="text-center border-b">
                        <td className="py-2 px-4">{item.product_name}</td>
                        <td className="py-2 px-4">{item.quantity}</td>
                        <td className="py-2 px-4">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-2 px-4">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Total and Discount */}
            <div className="mt-4 text-right">
              <p>
                <strong>Total Harga:</strong>{" "}
                {formatCurrency(selectedReport.total + selectedReport.discount)}
              </p>
              <p>
                <strong>Diskon:</strong>{" "}
                {formatCurrency(selectedReport.discount)}
              </p>{" "}
              <p>
                <strong>Total Bayar:</strong>{" "}
                {formatCurrency(selectedReport.total - selectedReport.discount)}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedReport(null)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
