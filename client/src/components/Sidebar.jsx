import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-5">
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/products">Products</Link>
          </li>
          <li className="mb-4">
            <Link to="/orders">Orders</Link>
          </li>
          <li className="mb-4">
            <Link to="/customers">Customers</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
