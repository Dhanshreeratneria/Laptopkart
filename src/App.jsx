import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";

const NoMatchFoundPage = lazy(() => import("./pages/NoMatchFoundPage.jsx"));
const HomeIndex = lazy(() => import("./pages/HomePage/index.jsx"));
const HomePage = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const ProductDetailIndex = lazy(() =>
  import("./pages/ProductDetailPage/index.jsx")
);
const ProductDetailPage = lazy(() =>
  import("./pages/ProductDetailPage/ProductDetails.jsx")
);
const GamingKeyboard = lazy(() =>
  import("./pages/GamingKeyboard/GamingKeyboard.jsx")
);
const GamingMouse = lazy(() => import("./pages/GamingMouse/gamingMouse.jsx"));
const CartPage = lazy(() => import("./pages/Cart/CartPage.jsx"));
const SignUpPage = lazy(() => import("./pages/Auth/SignUpPage.jsx"));
const SignInPage = lazy(() => import("./pages/Auth/SignInPage.jsx"));
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage.jsx"));
const CheackOut = lazy(() => import("./pages/CheackOut/CheackOut.jsx"));

const App = () => {
  const { isAuthenticated } = useAuth();

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" replace />;
  };

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<HomeIndex />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route path="/gamingKeyboard" element={<HomeIndex />}>
            <Route index element={<GamingKeyboard />} />
          </Route>

          <Route path="/gamingMouse" element={<HomeIndex />}>
            <Route index element={<GamingMouse />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <HomeIndex />
              </ProtectedRoute>
            }
          >
            <Route index element={<CartPage />} />
          </Route>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <HomeIndex />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfilePage />} />
          </Route>

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <HomeIndex />
              </ProtectedRoute>
            }
          >
            <Route index element={<CheackOut />} />
          </Route>

          {/* Auth Pages */}
          <Route path="/signin" element={<HomeIndex />}>
            <Route index element={<SignInPage />} />
          </Route>
          <Route path="/signup" element={<HomeIndex />}>
            <Route index element={<SignUpPage />} />
          </Route>

          {/* Product Detail */}
          <Route path="/product" element={<ProductDetailIndex />}>
            <Route path=":id" element={<ProductDetailPage />} />
          </Route>

          {/* Catch-All */}
          <Route path="*" element={<NoMatchFoundPage />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
