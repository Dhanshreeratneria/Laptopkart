import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../../assets/g.png";
import userIcon from "../../assets/user.png";
import { toast } from "react-toastify";

const SignInPage = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      navigate("/"); // ✅ redirect after login
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/"); // ✅ redirect
    } catch (err) {
      toast.error("Google sign-in failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={userIcon} alt="user" className="w-8 h-8 mr-2" />
          <h2 className="text-2xl font-bold">Sign In</h2>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <Mail className="w-5 h-5 text-gray-500 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <Lock className="w-5 h-5 text-gray-500 mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full flex justify-center items-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-2">OR</p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center border border-gray-300 text-black font-medium py-2 rounded-full hover:shadow-sm transition"
          >
            <img src={googleIcon} alt="Google logo" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 font-medium hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
