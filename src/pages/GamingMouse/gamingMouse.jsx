import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { db } from "../../firebase";

function GamingMouse() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchGamingMice = async () => {
      const productsRef = collection(db, "products");
      
      const q = query(productsRef, where("category", "==", "gamingmouse"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    };

    fetchGamingMice();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Gaming Mice</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </Link>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-200 transition">
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-200 transition">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
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

export default GamingMouse;
