import { useState } from "react";
import { Globe, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 px-3 py-6 sm:px-4 sm:py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Blur Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl sm:h-96 sm:w-96" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur-md transition hover:bg-white sm:left-6 sm:top-6 sm:px-4 sm:text-sm dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Dashboard</span>
      </button>

      {/* Main Card */}
      <div className="mt-10 relative z-10 w-full max-w-md sm:max-w-lg">
        <div className="rounded-2xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-8 dark:border-slate-700/50 dark:bg-slate-900/80">
          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg sm:mb-5 sm:h-16 sm:w-16">
              <Globe className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Globe className="h-5 w-5 text-blue-600 transition-transform group-hover:rotate-12" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-500 sm:px-4 sm:text-sm dark:bg-slate-900 dark:text-slate-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4 sm:space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-blue-600"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Remember me
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] sm:rounded-2xl"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8 dark:text-slate-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-blue-600 hover:underline"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}