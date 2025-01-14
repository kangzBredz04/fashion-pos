import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Product from "./pages/Product.jsx";
import User from "./pages/User.jsx";
import Graifk from "./pages/Grafik.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import RestrictedPage from "./pages/RestrictedPage.jsx";
import Discount from "./pages/Discount.jsx";
import SalesReport from "./pages/SalesReport.jsx";
import TransactionReceipt from "./pages/TransactionReceipt .jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/barang",
        element: <Product />,
      },
      {
        path: "/grafik",
        element: <Graifk />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/discount",
        element: <Discount />,
      },
      {
        path: "/sales-report",
        element: <SalesReport />,
      },
      {
        path: "/transaction",
        element: <TransactionReceipt />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/restricted",
    element: <RestrictedPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
