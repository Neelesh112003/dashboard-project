import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin({ isSelected, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg =
          data?.message ||
          (data?.errors
            ? Object.values(data.errors).flat().join(" ")
            : "Login failed. Please try again.");
        setError(msg);
      } else {
        setSuccess("Login successful!");
        onSubmit?.(data);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-xl max-w-2xl p-6 rounded-2xl shadow-xl transition-all border bg-[#f5f5f5] ${
        isSelected
          ? "border-[#44a83e] ring-2 ring-[#44a83e]/20"
          : "border-[#30333e]/30"
      }`}
    >
      <h3 className="mb-6 text-xl font-bold text-[#30333e] text-center">
        Enter Admin Details
      </h3>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#30333e]">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-[#30333e]/30 bg-white px-4 py-3 text-sm text-[#30333e] placeholder-[#30333e]/40 outline-none transition-all focus:border-[#44a83e] focus:ring-2 focus:ring-[#44a83e]/20 shadow-sm"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#30333e]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[#30333e]/30 bg-white px-4 py-3 pr-12 text-sm text-[#30333e] placeholder-[#30333e]/40 outline-none transition-all focus:border-[#44a83e] focus:ring-2 focus:ring-[#44a83e]/20 shadow-sm"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#30333e]/50 transition-colors hover:text-[#30333e]"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mx-auto block rounded-xl bg-[#44a83e] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#379932] hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}