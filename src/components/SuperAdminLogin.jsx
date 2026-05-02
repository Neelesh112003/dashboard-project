import { BookUser } from "lucide-react";
import SuperAdminLogin from "./auth/SuperAdminLogin";

export default function SuperAdminPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f5] px-3 py-6 sm:px-4 sm:py-10 dark:bg-[#30333e]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-[#44a83e]/10 blur-3xl dark:bg-[#44a83e]/15 sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#44a83e]/10 blur-3xl dark:bg-[#44a83e]/10 sm:h-96 sm:w-96" />
      </div>

      <button
        onClick={() => (window.location.href = "/login")}
        className="absolute left-3 top-3 inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-slate-700 shadow-lg backdrop-blur-md transition hover:bg-slate-100 sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-xs md:text-sm dark:bg-[#3a3c44] dark:text-[#f5f5f5] dark:hover:bg-[#44443c]"
      >
        <span className="whitespace-nowrap">Login as Admin/Member</span>
      </button>

      <div className="relative z-10 mt-10 w-full max-w-4xl">
        <div className="rounded-3xl border border-[#f5f5f5]/20 bg-[#30333e] p-8 shadow-2xl">
          <div className="mb-10 text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{ backgroundColor: "#44a83e" }}
            >
              <BookUser className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#f5f5f5]">
              Login as Super Admin
            </h1>
            <p className="mx-auto max-w-md text-base text-[#f5f5f5]/60">
              Sign in to continue to your super admin dashboard
            </p>
          </div>

          <div className="flex items-center justify-center">
            <SuperAdminLogin isSelected={true} onSubmit={handleSubmit} />
          </div>

          <p className="mt-10 text-center text-sm text-[#f5f5f5]/60">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-[#44a83e] hover:underline"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}