import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
  Wheat,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import type { UserRole } from "../../types";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const farmerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/farmer/dashboard" },
  { label: "My Crops", icon: Wheat, href: "/farmer/crops" },
  { label: "Add Crop", icon: Package, href: "/farmer/crops/add" },
  { label: "Orders", icon: ShoppingCart, href: "/farmer/orders" },
  { label: "Messages", icon: MessageSquare, href: "/farmer/chat" },
  { label: "Profile", icon: Settings, href: "/farmer/profile" },
];

const businessNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/business/dashboard" },
  { label: "Browse Crops", icon: Search, href: "/business/browse" },
  { label: "My Orders", icon: ShoppingCart, href: "/business/orders" },
  { label: "Messages", icon: MessageSquare, href: "/business/chat" },
  { label: "Analytics", icon: BarChart3, href: "/business/analytics" },
  { label: "Profile", icon: Settings, href: "/business/profile" },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Crop Approval", icon: CheckSquare, href: "/admin/crops" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Reports", icon: FileText, href: "/admin/reports" },
];

const roleConfig = {
  farmer: {
    nav: farmerNav,
    accentClass: "bg-emerald-600 text-white",
    activeClass: "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600",
    hoverClass: "hover:bg-emerald-50 hover:text-emerald-700",
    iconActive: "text-emerald-600",
  },
  business: {
    nav: businessNav,
    accentClass: "bg-teal-600 text-white",
    activeClass: "bg-teal-50 text-teal-700 border-r-2 border-teal-600",
    hoverClass: "hover:bg-teal-50 hover:text-teal-700",
    iconActive: "text-teal-600",
  },
  admin: {
    nav: adminNav,
    accentClass: "bg-slate-700 text-white",
    activeClass: "bg-slate-100 text-slate-800 border-r-2 border-slate-700",
    hoverClass: "hover:bg-slate-100 hover:text-slate-800",
    iconActive: "text-slate-700",
  },
};

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const isOpen = useAppStore((s) => s.sidebar.isOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const location = useLocation();
  const config = roleConfig[role] ?? roleConfig.farmer;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 240 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full flex-col overflow-hidden bg-card border-r border-border shadow-sm",
          "lg:relative lg:z-auto",
          !isOpen && "hidden lg:flex",
        )}
        data-ocid="sidebar"
      >
        {/* Logo area */}
        <div className="flex h-16 items-center border-b border-border px-3 shrink-0">
          <div className={cn("flex items-center gap-3 min-w-0")}>
            {/* Add logo here */}
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                config.accentClass,
              )}
            >
              <Wheat className="h-5 w-5" />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-foreground font-display whitespace-nowrap overflow-hidden"
                >
                  AgriConnect
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="flex flex-col gap-0.5 px-2">
            {config.nav.map((item) => {
              const isActive =
                location.pathname === item.href ||
                location.pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200",
                      "text-muted-foreground",
                      isActive ? config.activeClass : config.hoverClass,
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? config.iconActive : "text-current",
                      )}
                    />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="ml-3 overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border p-2">
          <ul className="flex flex-col gap-0.5">
            {[
              { label: "Settings", icon: Settings, href: `/${role}/profile` },
              { label: "Help", icon: HelpCircle, href: "#" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-2.5 py-2 text-sm font-medium",
                      "text-muted-foreground transition-all duration-200",
                      config.hoverClass,
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {isOpen && (
                      <span className="ml-3 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-20 hidden lg:flex",
            "h-6 w-6 items-center justify-center rounded-full",
            "bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground",
            "transition-all duration-200 hover:scale-110",
          )}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </motion.aside>
    </>
  );
}
