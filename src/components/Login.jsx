import { useState } from "react";
import { BookUser, ArrowLeft } from "lucide-react";
import AdminLogin from "./auth/AdminLogin";
import TeamLogin from "./auth/TeamLogin";

export default function Login() {
  const [selectedType, setSelectedType] = useState("admin");

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f5] px-3 py-6 sm:px-4 sm:py-10 dark:bg-[#30333e]">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-[#44a83e]/10 blur-3xl dark:bg-[#44a83e]/15 sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#44a83e]/10 blur-3xl dark:bg-[#44a83e]/10 sm:h-96 sm:w-96" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/super-admin/login")}
        className="absolute left-3 top-3 inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-slate-700 shadow-lg backdrop-blur-md transition hover:bg-slate-100 sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-xs md:text-sm dark:bg-[#3a3c44] dark:text-[#f5f5f5] dark:hover:bg-[#44443c]"
      >
        <span className="whitespace-nowrap">Login as Super Admin</span>
      </button>

      {/* Main Card */}
      <div className="relative z-10 mt-10 w-full max-w-4xl">
        <div className="bg-[#30333e] rounded-3xl p-8 shadow-2xl border border-[#f5f5f5]/20">
          {/* Header */}
          <div className="text-center mb-10">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{ backgroundColor: "#44a83e" }}
            >
              <BookUser className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#f5f5f5] mb-3">
              Welcome back
            </h1>
            <p className="text-base text-[#f5f5f5]/60 max-w-md mx-auto">
              Choose your role and sign in to continue to your dashboard
            </p>
          </div>

          {/* Type Selector Buttons - Centered */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <button
              onClick={() => handleTypeSelect("admin")}
              className={`p-4 rounded-xl font-semibold transition-all shadow-lg w-full sm:w-auto ${
                selectedType === "admin"
                  ? "bg-[#44a83e] text-[#f5f5f5] shadow-xl scale-105 border-2 border-[#44a83e]"
                  : "bg-[#30333e]/70 text-[#f5f5f5]/80 border border-[#f5f5f5]/20 hover:bg-[#30333e] hover:text-[#f5f5f5] hover:shadow-lg"
              }`}
            >
              Login as Admin
            </button>
            <button
              onClick={() => handleTypeSelect("team")}
              className={`p-4 rounded-xl font-semibold transition-all shadow-lg w-full sm:w-auto ${
                selectedType === "team"
                  ? "bg-[#44a83e] text-[#f5f5f5] shadow-xl scale-105 border-2 border-[#44a83e]"
                  : "bg-[#30333e]/70 text-[#f5f5f5]/80 border border-[#f5f5f5]/20 hover:bg-[#30333e] hover:text-[#f5f5f5] hover:shadow-lg"
              }`}
            >
              Login as Team Member
            </button>
          </div>

          {/* Selected Login Form */}
          <div className="flex justify-center items-center">
            {selectedType === "admin" && (
              <AdminLogin isSelected={true} onSubmit={handleSubmit} />
            )}
            {selectedType === "team" && (
              <TeamLogin isSelected={true} onSubmit={handleSubmit} />
            )}
          </div>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-[#f5f5f5]/60">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold hover:underline text-[#44a83e]"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
