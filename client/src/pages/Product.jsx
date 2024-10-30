// src/components/Product.js
export default function Product() {
  return (
    <div className="flex items-center justify-center h-80">
      <div className="text-center bg-white p-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-800">Coming Soon</h2>
        <p className="mt-4 text-lg text-gray-600">
          Halaman barang ini masih dalam tahap pengembangan.
        </p>
        <p className="mt-2 text-gray-500">Mohon ditunggu ya!</p>
      </div>
    </div>
  );
}
