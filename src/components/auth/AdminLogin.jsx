import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLogin({ isSelected = false, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState({ type: "", text: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        
        body: JSON.stringify({ login: email, password }),
      });

      const rawText = await response.text();
      let data = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) {
        const msg =
          data?.message ||
          (data?.errors
            ? Object.values(data.errors).flat().join(" ")
            : "Login failed. Please try again.");

        setMessage({ type: "error", text: msg });
        return;
      }

      
      const token = data.token ?? data.access_token ?? "";
      const user  = data.user  ?? data;

      localStorage.setItem("token", token);
      localStorage.setItem("user",  JSON.stringify(user));

      setMessage({ type: "success", text: data?.message || "Login successful!" });
      onSubmit?.(data);

    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Request failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-2xl rounded-2xl border bg-[#f5f5f5] p-6 shadow-xl transition-all ${
        isSelected
          ? "border-[#44a83e] ring-2 ring-[#44a83e]/20"
          : "border-[#30333e]/30"
      }`}
    >
      <h3 className="mb-6 text-center text-xl font-bold text-[#30333e]">
        Enter Admin Details
      </h3>

      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* Email */}
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

        {/* Password */}
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
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#30333e]/50 transition-colors hover:text-[#30333e]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-green-200 bg-green-50 text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mx-auto block rounded-xl bg-[#44a83e] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#379932] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </form>
    </div>
  );
}