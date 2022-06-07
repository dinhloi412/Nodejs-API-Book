import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div>
      <div className="card">
        <img src={product.image} alt={product.image} />

        <div className="box">
          <h3>
            <Link to={`/products/${product._id}`}>
              <span />
              {product.name}
            </Link>
          </h3>
          <h4>${product.author.name}</h4>

          <div className="btn_div">
            <button className="btn_edit">Edit</button>
            <button className="btn_delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
