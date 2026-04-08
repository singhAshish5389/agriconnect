import type { UserProfile } from "../../types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  user: UserProfile;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar user={user} />
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background"
          data-ocid="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
