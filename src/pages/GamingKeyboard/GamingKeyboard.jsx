import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { db } from "../../firebase";
import "./GamingKeyboard.css";

function GamingKeyboard() {
  const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchGamingKeyboards = async () => {

    // ✅ HERE it is used
    const productsRef = collection(db, "products");

    const q = query(productsRef, where("category", "==", "laptop"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(list);
  };

  fetchGamingKeyboards();
}, []);


  return (
    <div className="gk-container">
      <div className="gk-wrapper">
        <h1 className="gk-heading">Laptops</h1>

        <div className="gk-grid">
          {products.map((product) => (
            <div key={product.id} className="gk-card">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="gk-image"
                />
              </Link>

              <div className="gk-content">
                <Link to={`/product/${product.id}`}>
                  <h2 className="gk-title">{product.name}</h2>
                  <p className="gk-desc">{product.description}</p>
                </Link>

                <div className="gk-bottom">
                  <span className="gk-price">${product.price}</span>

                  <div className="gk-buttons">
                    <button className="gk-icon-btn">
                      <Heart className="gk-heart" />
                    </button>
                    <button className="gk-icon-btn">
                      <ShoppingCart className="gk-cart" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamingKeyboard;
