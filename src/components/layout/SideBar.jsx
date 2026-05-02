import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCircle2,
  Truck,
  DoorOpen,
  Package,
  ClipboardList,
  Warehouse,
  Boxes,
  Cpu,
  Factory,
  Cog,
  Calculator,
  Send,
  ShieldCheck,
  History,
  LogIn,
  FolderSearch,
  Landmark,
  BookUser,
  ChevronRight,
  X,
  CircleUserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Users",
    icon: Users,
    children: [
      { name: "Admin", href: "/manage-admin" },
      { name: "Team", href: "/manage-team" },
    ],
  },
  {
    name: "Manage Departments",
    href: "/manage-departments",
    icon: Building2,
  },
  {
    name: "Customers",
    icon: UserCircle2,
    children: [
      { name: "Customers List", href: "/customers/list" },
      { name: "Quotations", href: "/customers/quotations" },
      { name: "Customer P.O.", href: "/customers/po" },
      { name: "Sales – Invoicing", href: "/customers/invoicing" },
      { name: "Return Inwards (rejection)", href: "/customers/return-inwards" },
      { name: "Summary", href: "/customers/summary" },
    ],
  },
  {
    name: "Suppliers",
    icon: Truck,
    children: [
      { name: "Suppliers List", href: "/suppliers/list" },
      { name: "Purchase Orders", href: "/suppliers/purchase-orders" },
      { name: "Purchases", href: "/suppliers/purchases" },
      { name: "Return Outwards (I.Q.C.)", href: "/suppliers/return-outwards" },
      { name: "Summary", href: "/suppliers/summary" },
    ],
  },
  {
    name: "Gate Entry",
    icon: DoorOpen,
    children: [
      { name: "Create G.R.N.", href: "/gate-entry/grn" },
      { name: "Stock Allocation", href: "/gate-entry/stock-allocation" },
      { name: "Quality Control", href: "/gate-entry/quality-control" },
    ],
  },
  {
    name: "Raw Material List",
    icon: Package,
    children: [
      { name: "Product List", href: "/raw-material/product-list" },
      { name: "Product Group", href: "/raw-material/product-group" },
      { name: "HSN Group", href: "/raw-material/hsn-group" },
    ],
  },
  {
    name: "B.O.M.",
    icon: ClipboardList,
    children: [
      { name: "B.O.M. Groups", href: "/bom/groups" },
      { name: "Manage B.O.M. (versions)", href: "/bom/manage" },
    ],
  },
  {
    name: "Godowns",
    href: "/godowns",
    icon: Warehouse,
  },
  {
    name: "Inventory",
    icon: Boxes,
    children: [
      { name: "Inventory Management", href: "/inventory-management" },
      { name: "Production Stock Summary", href: "/inventory/production-stock" },
      { name: "Raw Material Stock Summary", href: "/inventory/raw-material-stock" },
    ],
  },
  {
    name: "S.M.T. Store Management",
    href: "/smt-store",
    icon: Cpu,
  },
  {
    name: "Assembly Line",
    icon: Factory,
    children: [
      { name: "Manage Assembly Lines", href: "/assembly-line/manage" },
      { name: "Production", href: "/assembly-line/production" },
      { name: "Raw Material Allocation History", href: "/assembly-line/rm-history" },
    ],
  },
  {
    name: "Production",
    href: "/production",
    icon: Cog,
  },
  {
    name: "Production Calculator",
    href: "/production-calculator",
    icon: Calculator,
  },
  {
    name: "Dispatch Management",
    href: "/dispatch",
    icon: Send,
  },
  {
    name: "Quality Control",
    icon: ShieldCheck,
    children: [
      { name: "Quality Control Checklists", href: "/quality-control/checklists" },
      { name: "Quality Control History", href: "/quality-control/history" },
    ],
  },
  {
    name: "Transaction History",
    href: "/transaction-history",
    icon: History,
  },
  {
    name: "Login History",
    href: "/login-history",
    icon: LogIn,
  },
  {
    name: "Software Trail",
    href: "/software-trail",
    icon: FolderSearch,
  },
  {
    name: "Cash and Bank Management",
    icon: Landmark,
    children: [
      { name: "Manage Banks", href: "/cash-bank/manage-banks" },
      { name: "Bank Book", href: "/cash-bank/bank-book" },
      { name: "Cash Book", href: "/cash-bank/cash-book" },
    ],
  },
];

export default function Sidebar() {
  const { isExpanded, isMobileOpen, closeMobileSidebar } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

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
              <span className="text-[25px] font-semibold tracking-tight text-white">
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
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openMenus[item.name];

              return (
                <li key={item.name}>
                  {hasChildren ? (
                    <>
                      {/* Parent toggle button */}
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
                          text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#11182b]
                          ${isOpen ? "dark:text-white text-slate-900" : ""}
                          ${!isExpanded ? "justify-center" : ""}`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {isExpanded && (
                          <>
                            <span className="font-medium flex-1 text-left">
                              {item.name}
                            </span>
                            <ChevronRight
                              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                isOpen ? "rotate-90 text-[#6fcf69]" : ""
                              }`}
                            />
                          </>
                        )}
                      </button>

                      {/* Submenu */}
                      {isExpanded && (
                        <ul
                          className={`overflow-hidden transition-all duration-250 ease-in-out ${
                            isOpen ? "max-h-96 mt-1" : "max-h-0"
                          }`}
                        >
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <NavLink
                                to={child.href}
                                onClick={closeMobileSidebar}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm transition-all duration-150
                                  ${
                                    isActive
                                      ? "text-[#1a5c18] dark:text-[#6fcf69] font-medium"
                                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                  }`
                                }
                              >
                                <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                                {child.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
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
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}