import React, { useEffect, useState } from "react";
import { ShoppingCart, Search, User, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const NAV_LINKS = {
  "Gaming Laptop": "gamingKeyboard",
  "Gaming Mouse": "gamingMouse",
};

function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const cart = userSnap.data().cart || [];
          const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
        }
      } catch (err) {
        console.error("Failed to fetch cart count:", err);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link
            to="/home"
            className="text-2xl font-bold tracking-tight transition-transform hover:scale-105"
          >
            <span className="text-primary">LaptopKart</span>
          </Link>

          <nav className="hidden lg:flex gap-8 font-medium">
            {Object.entries(NAV_LINKS).map(([label, route]) => (
              <Link
                key={label}
                to={`/${route}`}
                className="relative py-2 hover:text-primary transition-colors
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] 
                  after:bg-primary after:transition-all hover:after:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link
              to="/profile"
              className="p-2 hover:text-primary transition-transform hover:scale-110"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              to="/cart"
              className="p-2 relative hover:text-primary transition-transform hover:scale-110"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white 
                  w-4 h-4 flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 pt-4" : "max-h-0"
          }`}
        >
          {Object.entries(NAV_LINKS).map(([label, route]) => (
            <Link
              key={label}
              to={`/${route}`}
              className="block py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
