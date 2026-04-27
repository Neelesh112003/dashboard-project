import {
  LayoutDashboard,
  CircleUserRound,
  Building2,
  ShoppingCart,
  Package,
  ClipboardList,
  Boxes,
  Warehouse,
  Factory,
  Cog,
  FileText,
  ShieldCheck,
  BookUser,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

export default function Sidebar() {
  const { isExpanded, isMobileOpen, closeMobileSidebar } = useSidebar();

  const sidebarItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Manage Admins", href: "/manage-admins", icon: CircleUserRound },
    { name: "Manage Teams and Departments", href: "/manage-teams", icon: Building2 },
    { name: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
    { name: "Product List", href: "/product-list", icon: Package },
    { name: "BOM", href: "/bom", icon: ClipboardList },
    { name: "Inventory", href: "/inventory", icon: Boxes },
    { name: "Godowns", href: "/godowns", icon: Warehouse },
    { name: "Assembly Line", href: "/assembly-line", icon: Factory },
    { name: "Production", href: "/production", icon: Cog },
    { name: "Invoicing", href: "/invoicing", icon: FileText },
    { name: "Quality Check", href: "/quality-check", icon: ShieldCheck },
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
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-300 bg-white dark:bg-[#0b1220]
          dark:border-[#162033] transition-all duration-300
          ${isExpanded ? "w-64" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 shrink-0"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <NavLink
            to="/"
            className="flex items-center gap-3 px-2 py-2"
            onClick={closeMobileSidebar}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-b from-[#44a83e] to-[#257620] shadow-[0_10px_30px_rgba(70,95,255,0.25)] shrink-0">
              <BookUser className="h-5 w-5 text-white" />
            </div>

            {isExpanded && (
              <span
                className="text-[25px] font-semibold tracking-tight text-white"
              >
                Admin Panel
              </span>
            )}
          </NavLink>

          <button
            onClick={closeMobileSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden hover:bg-white/10"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <hr className="border-slate-300 dark:border-[#162033]" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
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
                          ? "bg-[#ccf0ca] text-[#1a5c18] dark:bg-[#1e3a5f] dark:text-[#6fcf69]"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#11182b]"
                      } ${!isExpanded ? "justify-center" : ""}`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {isExpanded && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-300 bg-white px-4 py-6 dark:border-[#162033] dark:bg-[#0b1220]">
          <div
            className={`flex items-center ${
              isExpanded ? "gap-3" : "justify-center"
            }`}
          >
            <CircleUserRound className="h-10 w-10 rounded-full bg-[#2d6e2a] text-white" />

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