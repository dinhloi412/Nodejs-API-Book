import React from "react";
import ProductCard from "./ProductCard";

const Products = ({ products }) => {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Products;
