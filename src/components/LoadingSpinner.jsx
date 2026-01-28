import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full animate-ping" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 animate-pulse">
          Loading...
        </h1>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full animate-progress" />
        </div>

        <p className="text-sm text-gray-500">Assembling awesomeness for you</p>
      </div>
    </div>
  );
}
