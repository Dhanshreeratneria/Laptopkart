import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { PackageCheck } from "lucide-react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheackOut = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;
    setProcessing(true);

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        cart: [],
        totalAmount: 0,
      });

      toast.success("Checkout successful! Your cart is now empty.");
      navigate("/home"); 
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to complete checkout.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md text-center">
        <div className="flex justify-center mb-4">
          <PackageCheck className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Checkout</h2>
        {user ? (
          <>
            <p className="text-gray-700 mb-4">
              Thank you <strong>{user.email}</strong> for shopping with us!
            </p>
            <p className="text-gray-600 mb-2">
              This is a demo screen. You can integrate Razorpay / Stripe here.
            </p>
            <button
              onClick={handleConfirm}
              disabled={processing}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-60"
            >
              {processing ? "Processing..." : "Confirm Payment"}
            </button>
          </>
        ) : (
          <p className="text-red-500">
            You must be signed in to proceed with checkout.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheackOut;
