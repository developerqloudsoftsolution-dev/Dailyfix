import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  TicketPercent,
  Star,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Avatar from "./Avatar";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Products",
    icon: Package,
    path: "/admin/products",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    path: "/admin/orders",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
  {
    title: "WhatsApp Bot",
    icon: MessageSquare,
    path: "/admin/whatsapp",
  },
  {
    title: "Manage Admins",
    icon: ShieldCheck,
    path: "/admin/admins",
  },
  {
    title: "Categories",
    icon: FolderTree,
    path: "/admin/categories",
  },
  {
    title: "Coupons",
    icon: TicketPercent,
    path: "/admin/coupons",
  },
  {
    title: "Reviews",
    icon: Star,
    path: "/admin/reviews",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{
        width: collapsed ? 85 : 260,
      }}
      transition={{ duration: 0.25 }}
      className="bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col shadow-sm"
    >
      {/* Logo */}

      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100">

        <motion.div
          animate={{
            opacity: collapsed ? 0 : 1,
            display: collapsed ? "none" : "block",
          }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11  rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">

            <HeartPulse className="text-white" size={22} />

          </div>
          <div>
             <h2 className="font-bold text-slate-900 text-lg">

              DailyFix

            </h2>

            <p className="text-xs text-slate-500">

              Admin Panel

            </p>

          </div>

        </motion.div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto py-6">

        <div className="space-y-1 px-3">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.title}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={21} />

                {!collapsed && (
                  <span className="font-medium text-sm">

                    {item.title}

                  </span>
                )}

              </NavLink>

            );
          })}
        </div>
      </div>

            {/* Bottom Section */}

      <div className="border-t border-slate-200 p-4">

        {/* Admin Profile */}

        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3">

            <Avatar
              name="Administrator"
              size="lg"
            />

            {!collapsed && (
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">
                  Administrator
                </h4>

                <p className="text-xs text-slate-500">
                  admin@dailyfix.com
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Logout */}

        <a href="/"
          className={`mt-5 w-full flex items-center ${
            collapsed ? "justify-center" : ""
          } gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 transition hover:bg-red-100`}
        >
          <LogOut size={19} />

          {!collapsed && (
            <span className="font-medium">
              Logout
            </span>
          )}
        </a>

        {/* Footer */}

        {!collapsed && (
          <div className="mt-5 text-center">

            <p className="text-xs text-slate-400">
              DailyFix Admin Panel
            </p>

            <p className="text-[11px] text-slate-300 mt-1">
              Version 1.0.0
            </p>

          </div>
        )}

      </div>

    </motion.aside>
  );
}