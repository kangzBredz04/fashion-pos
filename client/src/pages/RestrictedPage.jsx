export default function RestrictedPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg border-t-4 border-red-500">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
        <p className="text-gray-700 mb-6">
          Maaf, halaman ini tidak dapat diakses sembarangan. Harap login
          terlebih dahulu.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
