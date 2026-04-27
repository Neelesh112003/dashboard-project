import { useState } from "react";
import { BookUser, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f5] px-3 py-6 sm:px-4 sm:py-10 dark:bg-[#30333e]">

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-[#44a83e]/10 blur-3xl dark:bg-[#44a83e]/15 sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#44a83e]/10 blur-3xl dark:bg-[#44a83e]/10 sm:h-96 sm:w-96" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur-md transition hover:bg-slate-100 sm:left-6 sm:top-6 sm:px-4 sm:text-sm dark:bg-[#3a3c44] dark:text-[#f5f5f5] dark:hover:bg-[#44443c]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Dashboard</span>
      </button>

      {/* Main Card */}
      <div className="relative z-10 mt-10 w-full max-w-md sm:max-w-lg">
        <div
          className="rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8 dark:bg-[#3a3c44]"
          style={{ border: "1px solid rgba(68,168,62,0.2)" }}
        >
          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg sm:mb-5 sm:h-16 sm:w-16"
              style={{ backgroundColor: "#44a83e" }}
            >
              <BookUser className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-[#f5f5f5]">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:mt-3 sm:text-base dark:text-[#f5f5f5]/60">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-[#f5f5f5]/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400 sm:px-4 sm:text-sm dark:bg-[#3a3c44] dark:text-[#f5f5f5]/40">
                sign in with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4 sm:space-y-5" onSubmit={(e) => e.preventDefault()}>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#f5f5f5]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-slate-200 bg-[#f5f5f5] px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all sm:rounded-2xl dark:border-[#f5f5f5]/10 dark:bg-[#30333e] dark:text-[#f5f5f5] dark:placeholder-[#f5f5f5]/30"
                onFocus={(e) => {
                  e.target.style.border = "1px solid #44a83e";
                  e.target.style.boxShadow = "0 0 0 4px rgba(68,168,62,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-[#f5f5f5]">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold hover:underline" style={{ color: "#44a83e" }}>
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-[#f5f5f5] px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all sm:rounded-2xl dark:border-[#f5f5f5]/10 dark:bg-[#30333e] dark:text-[#f5f5f5] dark:placeholder-[#f5f5f5]/30"
                  onFocus={(e) => {
                    e.target.style.border = "1px solid #44a83e";
                    e.target.style.boxShadow = "0 0 0 4px rgba(68,168,62,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:text-[#f5f5f5]/40 dark:hover:text-[#f5f5f5]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300"
                style={{ accentColor: "#44a83e" }}
              />
              <span className="text-sm text-slate-600 dark:text-[#f5f5f5]/60">
                Remember me
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] sm:rounded-2xl"
              style={{ backgroundColor: "#44a83e" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#379932")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#44a83e")}
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8 dark:text-[#f5f5f5]/60">
            Don't have an account?{" "}
            <a href="/signup" className="font-semibold hover:underline" style={{ color: "#44a83e" }}>
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}