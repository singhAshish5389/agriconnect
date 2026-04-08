import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { UserProfile } from "../../types";
import { RoleBadge } from "../agri/Badge";

interface TopBarProps {
  user: UserProfile | null;
}

export function TopBar({ user }: TopBarProps) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setUser = useAppStore((s) => s.setUser);
  const { clear } = useInternetIdentity();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    clear();
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-xs shrink-0"
      data-ocid="topbar"
    >
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all lg:hidden"
          aria-label="Toggle sidebar"
          data-ocid="topbar-menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Add logo here — shown on mobile */}
        <span className="font-bold text-foreground font-display text-lg lg:hidden">
          AgriConnect
        </span>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          aria-label="Notifications"
          data-ocid="topbar-notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-all"
            aria-label="User menu"
            aria-expanded={dropdownOpen}
            data-ocid="topbar-user-menu"
          >
            {/* Add user profile image here */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
                {user?.name ?? "Guest"}
              </p>
              {user && <RoleBadge role={user.role} />}
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setDropdownOpen(false);
                  }}
                  role="presentation"
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-border bg-card shadow-lg overflow-hidden"
                >
                  {user && (
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                    data-ocid="logout-btn"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
