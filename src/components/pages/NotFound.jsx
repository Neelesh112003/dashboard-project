import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f5f5f5]">
      <div className="relative w-full max-w-2xl text-center">

        {/* Background Glow */}
        <div className="absolute inset-0 blur-3xl opacity-20 bg-[#44a83e] rounded-full"></div>

        {/* Card */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-10">

          {/* 404 */}
          <h1 className="text-[110px] sm:text-[140px] font-extrabold text-[#30333e] tracking-tight leading-none">
            404
          </h1>

          {/* Title */}
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#3a3c44]">
            Oops! Page not found
          </h2>

          {/* Description */}
          <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            The page you’re looking for doesn’t exist or has been moved. 
            Try going back or return to the dashboard.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-[#44a83e] px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-[#3a3c44] hover:bg-gray-100 transition"
            >
              <MoveLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
