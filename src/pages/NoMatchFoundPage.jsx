import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoMatchFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mt-2">
          Sorry, the page you are looking for does not exist.
        </p>
        <button className="mt-4" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
  );
}
