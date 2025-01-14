/* eslint-disable react-refresh/only-export-components */
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createContext, useEffect, useState } from "react";
import { api } from "./util";

export const AllContext = createContext();

function App() {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/product").then((res) => setProducts(res));
    api.get("/discount").then((res) => setDiscounts(res.data));
    api.get("/order").then((res) => setOrders(res.data));
    api.get("/order/get-all").then((res) => setReports(res.data));
  }, []);

  return (
    <AllContext.Provider
      value={{
        products,
        setProducts,
        discounts,
        setDiscounts,
        orders,
        setOrders,
        reports,
        setReports,
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AllContext.Provider>
  );
}

export default App;
