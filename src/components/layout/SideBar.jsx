import {
  LayoutDashboard,
  LogIn,
  Settings,
  BookUser,
  X,
  CircleUserRound
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

export default function Sidebar() {
  const { isExpanded, isMobileOpen, closeMobileSidebar } = useSidebar();

  const sidebarItems = [
    {
      name: "Overview",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Login",
      href: "/login",
      icon: LogIn,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-300 bg-white py-6 transition-all duration-300 dark:border-[#162033] dark:bg-[#0b1220]
        ${isExpanded ? "w-64" : "w-20"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-2 py-2"
            onClick={closeMobileSidebar}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-b from-[#465fff] to-[#3b4fd8] shadow-[0_10px_30px_rgba(70,95,255,0.25)]">
              <BookUser className="h-5 w-5 text-white" />
            </div>

            {isExpanded && (
              <span className="text-[25px] font-semibold tracking-tight text-slate-900 dark:text-white">
                Dashboard
              </span>
            )}
          </NavLink>

          <button
            onClick={closeMobileSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#11182b] lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <hr className="my-6 border-slate-300 dark:border-[#162033]" />

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-800 dark:bg-[#151f46] dark:text-[#7c8cff]"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#11182b]"
                      } ${!isExpanded ? "justify-center" : ""}`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {isExpanded && <span className="font-medium">{item.name}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-300 px-4 pt-6 dark:border-[#162033]">
          <div className={`flex items-center ${isExpanded ? "gap-3" : "justify-center"}`}>
            <CircleUserRound 
              className="h-10 w-10 rounded-full object-cover"
            />
            {isExpanded && (
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                  Neelesh Gupta
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Frontend Developer
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}