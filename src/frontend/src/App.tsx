import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Loader } from "./components/agri/Loader";
import { ToastContainer } from "./components/agri/ToastContainer";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { useAuth } from "./hooks/useBackend";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";
import { CropApprovalPage } from "./pages/admin/CropApprovalPage";
import { OrdersMonitoringPage } from "./pages/admin/OrdersMonitoringPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { RoleSelectPage } from "./pages/auth/RoleSelectPage";
import { BrowseCropsPage } from "./pages/business/BrowseCropsPage";
import { BusinessChatPage } from "./pages/business/BusinessChatPage";
import { BusinessDashboardPage } from "./pages/business/BusinessDashboardPage";
import { BusinessOrdersPage } from "./pages/business/BusinessOrdersPage";
import { BusinessProfilePage } from "./pages/business/BusinessProfilePage";
import { PlaceOrderPage } from "./pages/business/PlaceOrderPage";
import { AddCropPage } from "./pages/farmer/AddCropPage";
import { FarmerChatPage } from "./pages/farmer/FarmerChatPage";
import { FarmerDashboardPage } from "./pages/farmer/FarmerDashboardPage";
import { FarmerOrdersPage } from "./pages/farmer/FarmerOrdersPage";
import { FarmerProfilePage } from "./pages/farmer/FarmerProfilePage";
import { MyCropsPage } from "./pages/farmer/MyCropsPage";
import { useAppStore } from "./store/useAppStore";

// Lazy placeholder pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-xl bg-muted/50 px-8 py-10 border border-border max-w-sm">
        <h2 className="text-xl font-semibold text-foreground font-display">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is coming soon.
        </p>
      </div>
    </div>
  );
}

// Auth guard wrapper
function ProtectedLayout({
  requiredRole,
}: { requiredRole?: "farmer" | "business" | "admin" }) {
  const { user, isAuthenticated, profileLoading } = useAuth();

  if (profileLoading) return <Loader fullScreen />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const dest =
      user.role === "farmer"
        ? "/farmer/dashboard"
        : user.role === "business"
          ? "/business/dashboard"
          : "/admin/dashboard";
    return <Navigate to={dest} />;
  }

  return (
    <DashboardLayout user={user}>
      <Outlet />
    </DashboardLayout>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ToastContainer />
    </>
  ),
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    const user = useAppStore((s) => s.auth.user);
    const isLoading = useAppStore((s) => s.auth.isLoading);
    if (isLoading) return <Loader fullScreen />;
    if (!user) return <Navigate to="/login" />;
    if (user.role === "farmer") return <Navigate to="/farmer/dashboard" />;
    if (user.role === "business") return <Navigate to="/business/dashboard" />;
    return <Navigate to="/admin/dashboard" />;
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as "farmer" | "business") ?? "farmer",
  }),
});

const roleSelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/role-select",
  component: RoleSelectPage,
});

// Farmer routes
const farmerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/farmer",
  component: () => <ProtectedLayout requiredRole="farmer" />,
});

const farmerDashboardRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/dashboard",
  component: FarmerDashboardPage,
});

const farmerCropsRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/crops",
  component: MyCropsPage,
});

const farmerCropsAddRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/crops/add",
  component: AddCropPage,
});

const farmerOrdersRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/orders",
  component: FarmerOrdersPage,
});

const farmerChatRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/chat",
  component: FarmerChatPage,
});

const farmerProfileRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/profile",
  component: FarmerProfilePage,
});

// Business routes
const businessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business",
  component: () => <ProtectedLayout requiredRole="business" />,
});

const businessDashboardRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: "/dashboard",
  component: BusinessDashboardPage,
});

const businessBrowseRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: "/browse",
  component: BrowseCropsPage,
});

const businessOrdersRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: "/orders",
  component: BusinessOrdersPage,
});

const businessChatRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: "/chat",
  component: BusinessChatPage,
});

const businessAnalyticsRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: "/analytics",
  component: () => <PlaceholderPage title="Analytics" />,
});

const businessProfileRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: "/profile",
  component: BusinessProfilePage,
});

const businessPlaceOrderRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: "/place-order",
  component: PlaceOrderPage,
});

// Admin routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => <ProtectedLayout requiredRole="admin" />,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/dashboard",
  component: AdminDashboardPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/users",
  component: UserManagementPage,
});

const adminCropsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/crops",
  component: CropApprovalPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/orders",
  component: OrdersMonitoringPage,
});

const adminReportsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/reports",
  component: AdminReportsPage,
});

// 404
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1 className="text-6xl font-bold text-primary font-display">404</h1>
      <p className="mt-2 text-xl text-foreground font-semibold">
        Page not found
      </p>
      <p className="mt-1 text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go home
      </a>
    </div>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  roleSelectRoute,
  farmerLayoutRoute.addChildren([
    farmerDashboardRoute,
    farmerCropsRoute,
    farmerCropsAddRoute,
    farmerOrdersRoute,
    farmerChatRoute,
    farmerProfileRoute,
  ]),
  businessLayoutRoute.addChildren([
    businessDashboardRoute,
    businessBrowseRoute,
    businessOrdersRoute,
    businessChatRoute,
    businessAnalyticsRoute,
    businessProfileRoute,
    businessPlaceOrderRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminUsersRoute,
    adminCropsRoute,
    adminOrdersRoute,
    adminReportsRoute,
  ]),
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
