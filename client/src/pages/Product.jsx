/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import { AllContext } from "../App";
import { api } from "../util";
import { useNavigate } from "react-router-dom";
import { DownloadTableExcel } from "react-export-table-to-excel";

export default function Product() {
  const { products } = useContext(AllContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    price: "",
    stock: "",
    size: "S",
    category: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      api
        .put(`/product/${formData.id}`, formData)
        .then((res) => alert(res.msg));
    } else {
      api.post("/product", formData).then((res) => alert(res.msg));
    }
    // Add logic for saving data (e.g., API call)
    window.location.reload();
    setShowPopup(false);
    setFormData({
      id: 0,
      name: "",
      description: "",
      price: "",
      stock: "",
      size: "S",
      category: "",
    });
  };

  const handleAddData = () => {
    setIsEdit(false);
    setFormData({
      id: 0,
      name: "",
      description: "",
      price: "",
      stock: "",
      size: "S",
      category: "",
    });
    setShowPopup(true);
  };

  const handleEditData = (product) => {
    setIsEdit(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      size: product.size,
      category: product.category,
    });
    setShowPopup(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Apakah anda yakin akan menghapus barang ini?")) {
      api.delete(`/product/${id}`).then((res) => alert(res.msg));
      window.location.reload();
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  const totalPages = Math.ceil(filteredProducts.length / entries);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // EXPORT DATA TABLE TO EXCEL
  const tableRef = useRef(null);
  return (
    <div className="mx-10 my-10">
      {/* Add and Search Bar */}
      <div className="flex justify-between mb-4">
        <button
          onClick={handleAddData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          <i className="fas fa-plus"></i> Tambah Barang
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
        {["All", "Kaos", "Hoodie", "Celana"].map((category) => (
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
        <DownloadTableExcel
          filename="Product Data"
          sheet="Product"
          currentTableRef={tableRef.current}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Export to Excel
        </DownloadTableExcel>
      </div>

      {/* Product Table */}
      <table className="min-w-full bg-white border" ref={tableRef}>
        <thead>
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Deskripsi</th>
            <th className="border px-4 py-2">Harga</th>
            <th className="border px-4 py-2">Stok</th>
            <th className="border px-4 py-2">Ukuran</th>
            <th className="border px-4 py-2">Kategori</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((item, index) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">
                {item.description.length > 25
                  ? `${item.description.substring(0, 25)}...`
                  : item.description}
              </td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">{item.stock}</td>
              <td className="border px-4 py-2">{item.size}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditData(item)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(item.id)}
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
          {Math.min((currentPage - 1) * entries + 1, filteredProducts.length)}{" "}
          to {Math.min(currentPage * entries, filteredProducts.length)} of{" "}
          {filteredProducts.length} entries
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
              {isEdit ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">Nama:</label>
              <input
                type="text"
                name="name"
                className="border rounded w-full px-2 py-1 mb-3"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label className="block mb-2">Deskripsi:</label>
              <input
                type="text"
                name="description"
                className="border rounded w-full px-2 py-1 mb-3"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <label className="block mb-2">Harga:</label>
              <input
                type="number"
                name="price"
                className="border rounded w-full px-2 py-1 mb-3"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <label className="block mb-2">Stok:</label>
              <input
                type="number"
                name="stock"
                className="border rounded w-full px-2 py-1 mb-3"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
              <label className="block mb-2">Ukuran:</label>
              <select
                name="size"
                className="border rounded w-full px-2 py-1 mb-3"
                value={formData.size}
                onChange={handleInputChange}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
              <label className="block mb-2">Kategori:</label>
              <input
                type="text"
                name="category"
                className="border rounded w-full px-2 py-1 mb-3"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowPopup(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
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
