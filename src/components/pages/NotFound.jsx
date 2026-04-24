import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 text-center">

      {/* 404 Number */}
      <h1 className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tight text-gray-100 dark:text-gray-800 select-none">
        404
      </h1>

      {/* Content */}
      <div className="-mt-6 sm:-mt-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Page not found
        </h2>
        <p className="mt-3 max-w-sm text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been removed. Please check the URL or return to the dashboard.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto rounded-xl bg-[#465fff] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3550e8] active:scale-[0.98] shadow-md"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <MoveLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>

    </div>
  );
}