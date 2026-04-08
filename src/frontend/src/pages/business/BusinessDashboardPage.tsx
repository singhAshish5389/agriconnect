import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/agri/Button";
import { Loader } from "../../components/agri/Loader";
import { OrderCard } from "../../components/agri/OrderCard";
import { StatsCard } from "../../components/agri/StatsCard";
import {
  useAuth,
  useBusinessDashboard,
  useOrders,
} from "../../hooks/useBackend";

export function BusinessDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dashQuery = useBusinessDashboard();
  const { orders, isLoading: ordersLoading } = useOrders();

  const stats = dashQuery.data;
  const recentOrders = orders.slice(0, 5);

  const statsCards = [
    {
      title: "Total Orders",
      value: stats ? Number(stats.totalOrdersPlaced).toString() : "—",
      icon: ShoppingBag,
      variant: "teal" as const,
    },
    {
      title: "Pending Orders",
      value: stats ? Number(stats.pendingOrders).toString() : "—",
      icon: Clock,
      variant: "amber" as const,
    },
    {
      title: "Completed Orders",
      value: stats ? Number(stats.completedOrders).toString() : "—",
      icon: CheckCircle2,
      variant: "emerald" as const,
    },
    {
      title: "Total Spent",
      value: stats ? `$${stats.totalSpent.toFixed(2)}` : "—",
      icon: DollarSign,
      variant: "default" as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto" data-ocid="business-dashboard">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl bg-gradient-to-br from-teal-500/10 via-primary/5 to-accent/10 border border-teal-200/50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Welcome back,{" "}
            <span className="text-teal-600">
              {user?.name ?? "Business User"}
            </span>{" "}
            👋
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Here's what's happening with your procurement today.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/business/browse" })}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
          data-ocid="browse-crops-cta"
        >
          Browse Crops
        </Button>
      </motion.div>

      {/* Stats cards */}
      {dashQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-muted/50 animate-pulse border border-border"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, i) => (
            <StatsCard key={card.title} {...card} index={i} />
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground font-display">
            Recent Orders
          </h2>
          <button
            type="button"
            onClick={() => navigate({ to: "/business/orders" })}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition-colors"
            data-ocid="view-all-orders-link"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {ordersLoading ? (
          <Loader />
        ) : recentOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center"
            data-ocid="orders-empty-state"
          >
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="font-medium text-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Browse available crops and place your first order.
            </p>
            <Button
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => navigate({ to: "/business/browse" })}
            >
              Browse Crops
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentOrders.map((order, i) => (
              <OrderCard
                key={order.id.toString()}
                order={order}
                viewMode="business"
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
