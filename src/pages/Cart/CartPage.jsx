import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      const cart = userData.cart || [];
      setTotal(userData.totalAmount || 0);

      // Fetch product details for each item
      const products = await Promise.all(
        cart.map(async (item) => {
          const productRef = doc(db, "products", item.productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            return {
              ...item,
              ...productSnap.data(),
            };
          }
          return null;
        })
      );

      setCartItems(products.filter(Boolean));
    };

    fetchCart();
  }, [user]);

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
              {cartItems.map((item, idx) => (
                <li
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-blue-600 font-semibold">
                      ${item.price} x {item.quantity} = $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
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
