import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setLoading(false);
          return;
        }

        const cart = userSnap.data().cart || [];

        const products = await Promise.all(
          cart.map(async (item) => {
            const productRef = doc(db, "products", item.productId);
            const productSnap = await getDoc(productRef);

            if (!productSnap.exists()) return null;

            return {
              id: item.productId,
              quantity: item.quantity,
              ...productSnap.data(),
            };
          })
        );

        const validProducts = products.filter(Boolean);
        setCartItems(validProducts);
        calculateTotal(validProducts);
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // ✅ CALCULATE TOTAL
  const calculateTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );
    setTotal(sum);
  };

  // 🗑️ REMOVE ITEM
  const removeFromCart = async (productId) => {
    try {
      const userRef = doc(db, "users", user.uid);

      const updatedCart = cartItems
        .filter((item) => item.id !== productId)
        .map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }));

      await updateDoc(userRef, {
        cart: updatedCart,
      });

      const updatedItems = cartItems.filter(
        (item) => item.id !== productId
      );

      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center py-10">
            🛒 Your cart is empty.
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-blue-600 font-semibold">
                      ${item.price} × {item.quantity} = $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* 🗑 REMOVE BUTTON */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-right text-xl font-bold text-blue-700">
              Total: ${total.toFixed(2)}
            </div>

            <div className="text-right mt-4">
              <Link
                to="/checkout"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
