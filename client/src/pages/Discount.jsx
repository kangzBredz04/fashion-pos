/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllContext } from "../App";
import { api } from "../util";

export default function Discount() {
  const { discounts } = useContext(AllContext);

  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    code: "",
    total_discount: 0, // Added total_discount field
    status: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      api
        .put(`/discount/${formData.id}`, formData)
        .then((res) => alert(res.msg));
    } else {
      api.post("/discount", formData).then((res) => alert(res.msg));
    }
    // Handle the form submission logic here (for edit or add)
    window.location.reload();
    setShowPopup(false);
    setFormData({
      id: 0,
      name: "",
      code: "",
      total_discount: 0, // Reset total_discount on form close
      status: 1,
    });
  };

  const handleAddData = () => {
    setIsEdit(false);
    setFormData({
      id: 0,
      name: "",
      code: "",
      total_discount: 0, // Reset total_discount for new discount
      status: 1,
    });
    setShowPopup(true);
  };

  const handleEditData = (discount) => {
    setIsEdit(true);
    setFormData({
      id: discount.id,
      name: discount.name,
      code: discount.code,
      total_discount: discount.total_discount, // Set the total_discount for editing
      status: discount.status,
    });
    setShowPopup(true);
  };

  const handleDeleteDiscount = (id) => {
    if (window.confirm("Apakah anda yakin akan menghapus diskon ini?")) {
      api.delete(`/discount/${id}`).then((res) => alert(res.msg));
      window.location.reload();
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredDiscounts = discounts.filter(
    (discount) =>
      (discount.name.toLowerCase().includes(search.toLowerCase()) ||
        discount.code.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "All" ||
        (selectedCategory === "Aktif" && discount.status === 1) ||
        (selectedCategory === "Non-Aktif" && discount.status === 0))
  );

  const paginatedDiscounts = filteredDiscounts.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  const totalPages = Math.ceil(filteredDiscounts.length / entries);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className=" mx-10 my-10">
      {/* Add and Search Bar */}
      <div className="flex justify-between mb-4">
        <button
          onClick={handleAddData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          <i className="fas fa-plus"></i> Tambah Diskon
        </button>
        <div className="flex items-center">
          <label className="mr-2">Cari:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="mb-4">
        {["All", "Aktif", "Non-Aktif"].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`border px-3 py-1 rounded mx-1 ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Show Entries Dropdown */}
      <div className="flex justify-between mb-4">
        <div>
          <label>Show</label>
          <select
            className="border rounded px-2 py-1 mx-2"
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <label>entries</label>
        </div>
      </div>

      {/* Discount Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Kode</th>
            <th className="border px-4 py-2">Persentase</th>{" "}
            {/* New header for total_discount */}
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDiscounts.map((item, index) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.code}</td>
              <td className="border px-4 py-2">{item.total_discount}%</td>{" "}
              {/* Displaying total_discount */}
              <td className="border px-4 py-2">
                {item.status === 1 ? "Aktif" : "Non-Aktif"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditData(item)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={() => handleDeleteDiscount(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  <i className="fas fa-trash"></i> Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div>
          Showing{" "}
          {Math.min((currentPage - 1) * entries + 1, filteredDiscounts.length)}{" "}
          to {Math.min(currentPage * entries, filteredDiscounts.length)} of{" "}
          {filteredDiscounts.length} entries
        </div>
        <div className="flex items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="border px-2 py-1 rounded mr-2"
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="border px-2 py-1 rounded ml-2"
          >
            Next
          </button>
        </div>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h2 className="text-lg mb-3">
              {isEdit ? "Edit Diskon" : "Tambah Diskon"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Nama:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Kode:</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Persentase:</label>
                <input
                  type="number"
                  name="total_discount"
                  value={formData.total_discount}
                  onChange={handleInputChange}
                  required
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="border rounded w-full px-2 py-1"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Non-Aktif</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-2 py-1 rounded mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
