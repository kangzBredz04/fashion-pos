import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Graifk() {
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

  return (
    <div className="flex items-center justify-center h-80">
      <div className="text-center bg-white p-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-800">Coming Soon</h2>
        <p className="mt-4 text-lg text-gray-600">
          Halaman grafik ini masih dalam tahap pengembangan.
        </p>
        <p className="mt-2 text-gray-500">Mohon ditunggu ya!</p>
      </div>
    </div>
  );
}
