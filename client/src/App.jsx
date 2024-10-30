/* eslint-disable react-refresh/only-export-components */
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createContext, useEffect, useState } from "react";
import { api } from "./util";

export const AllContext = createContext();

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/product").then((res) => setProducts(res));
  }, []);

  console.log(products);

  return (
    <AllContext.Provider value={{ products, setProducts }}>
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
