import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 6; // number of products to load per request

  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      let q;

      if (!lastDoc) {
        q = query(
          collection(db, "products"),
          orderBy("name"), // or any field
          limit(LIMIT)
        );
      } else {
        q = query(
          collection(db, "products"),
          orderBy("name"),
          startAfter(lastDoc),
          limit(LIMIT)
        );
      }

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const newProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts((prev) => [...prev, ...newProducts]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      fetchProducts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [lastDoc, hasMore]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Products
        </h1>

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
                  <p className="text-gray-600 text-sm">
                    {product.description}
                  </p>
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

        {loading && (
          <div className="text-center my-6 text-gray-600">Loading more...</div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
