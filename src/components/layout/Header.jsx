import { useEffect, useRef } from "react";
import { Search, Menu, BellDot, UserPen } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { ThemeToggleButton } from "../ThemToggleButton";
import LoginButton from "../Buttons/LoginButton";

export default function Header() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-[#162033] dark:bg-[#0d1528]/90">
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type command..."
              className="h-11 w-95 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-11 pr-16 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-[#1b2740] dark:bg-[#0f172a] dark:text-white dark:placeholder:text-slate-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-400">
              ⌘ K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]">
            <BellDot />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]">
            <UserPen />
          </span>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}