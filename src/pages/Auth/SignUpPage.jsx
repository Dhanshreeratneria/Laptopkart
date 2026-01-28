import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRound, Phone, MapPin, Mail, Lock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../../assets/g.png";
import userIcon from "../../assets/user.png";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const { signUpWithEmailAndProfile, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmailAndProfile(formData);
      navigate("/"); // ✅ redirect after signup
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      toast.error("Google sign-up failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={userIcon} alt="user" className="w-8 h-8 mr-2" />
          <h2 className="text-2xl font-bold">Create Account</h2>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <UserRound className="w-5 h-5 text-gray-500 mr-3" />
            <input
              name="name"
              value={formData.name}
              placeholder="Full Name"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <Phone className="w-5 h-5 text-gray-500 mr-3" />
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              placeholder="Phone Number"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <MapPin className="w-5 h-5 text-gray-500 mr-3" />
            <input
              name="address"
              value={formData.address}
              placeholder="Address"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <Mail className="w-5 h-5 text-gray-500 mr-3" />
            <input
              name="email"
              type="email"
              value={formData.email}
              placeholder="Email"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <Lock className="w-5 h-5 text-gray-500 mr-3" />
            <input
              name="password"
              type="password"
              value={formData.password}
              placeholder="Password"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-full flex justify-center items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-2">OR</p>

          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center border border-gray-300 text-black font-medium py-2 rounded-full hover:shadow-sm transition"
          >
            <img src={googleIcon} alt="Google logo" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
