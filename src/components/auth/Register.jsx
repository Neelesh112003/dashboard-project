import { useState } from "react";
import { Globe, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-10">
      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur-md transition hover:bg-white dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Dashboard</span>
      </button>

      {/* Main Card */}
      <div className="mt-10 relative z-10 w-full max-w-lg">
        <div className="rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
              <Globe className="h-8 w-8" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h1>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Join us and start managing your dashboard
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Globe className="h-5 w-5 text-blue-600 transition-transform group-hover:rotate-12" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              show={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
            />

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{" "}
                <a href="#" className="font-semibold text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
}

function PasswordInput({ label, placeholder, show, toggle }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {show ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}