import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggleButton() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(html.classList.contains("dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-[#1e293b] dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-[#111c34]"
      aria-label="Toggle Theme"
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}