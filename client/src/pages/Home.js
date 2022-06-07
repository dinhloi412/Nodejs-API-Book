import axios from "axios";
import React, { useState, useEffect } from "react";
import Products from "../components/Products";
const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/book").then((res) => setProducts(res.data));
  }, []);
  return (
    <div>
      Home
      <Products products={products} />
    </div>
  );
};

export default Home;
