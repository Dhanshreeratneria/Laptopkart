import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const { user ,setUser} = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please sign in to add to cart.");
      return;
    }

    setAdding(true);
    const userRef = doc(db, "users", user.uid);
    try {
      const userSnap = await getDoc(userRef);
      let cart = [];
      let totalAmount = 0;

      if (userSnap.exists()) {
        const data = userSnap.data();
        cart = data.cart || [];
        totalAmount = data.totalAmount || 0;
      }

      const existingItemIndex = cart.findIndex(
        (item) => item.productId === product.id
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          price: product.price,
          quantity: 1,
        });
      }

      totalAmount += product.price;

       await setDoc(
        userRef,
        {
          cart,
          totalAmount,
        },
        { merge: true }
      );
      const updatedSnap = await getDoc(userRef);
      if (updatedSnap.exists()) {
        setUser({
          ...user,
          ...updatedSnap.data(),
        });
      }
      
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl text-gray-600">Loading product details...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-64 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl text-blue-600 font-semibold mb-6">
            ${product.price}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
