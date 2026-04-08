import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  Leaf,
  PlusCircle,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderCard } from "../../components/agri/OrderCard";
import { StatsCard } from "../../components/agri/StatsCard";
import { useAuth, useFarmerDashboard, useOrders } from "../../hooks/useBackend";

export function FarmerDashboardPage() {
  const { user } = useAuth();
  const statsQuery = useFarmerDashboard();
  const { farmerOrders } = useOrders();
  const navigate = useNavigate();

  const stats = statsQuery.data;
  const recentOrders = farmerOrders.slice(0, 5);

  const statCards = [
    {
      title: "Total Crops",
      value: stats ? Number(stats.totalCrops) : "—",
      icon: Leaf,
      variant: "emerald" as const,
    },
    {
      title: "Approved Crops",
      value: stats ? Number(stats.approvedCrops) : "—",
      icon: CheckCircle,
      variant: "teal" as const,
    },
    {
      title: "Pending Orders",
      value: stats ? Number(stats.pendingOrders) : "—",
      icon: ShoppingCart,
      variant: "amber" as const,
    },
    {
      title: "Total Revenue",
      value: stats ? `$${stats.totalRevenue.toFixed(2)}` : "—",
      icon: TrendingUp,
      variant: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5"
        data-ocid="dashboard-welcome"
      >
        <h1 className="text-xl font-bold text-foreground font-display">
          Welcome back, {user?.name ?? "Farmer"} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's an overview of your farm activity today.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, i) => (
          <StatsCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="flex flex-wrap gap-3"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/farmer/crops/add" })}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          data-ocid="quick-add-crop"
        >
          <PlusCircle className="h-4 w-4" />
          Add Crop
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/farmer/orders" })}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs hover:bg-muted transition-colors"
          data-ocid="quick-view-orders"
        >
          <ShoppingCart className="h-4 w-4" />
          View Orders
        </button>
      </motion.div>

      {/* Recent orders */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      >
        <h2 className="mb-3 text-base font-semibold text-foreground font-display">
          Recent Orders
        </h2>
        {recentOrders.length === 0 ? (
          <div
            className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center"
            data-ocid="orders-empty"
          >
            <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No orders yet. Share your crops to receive orders!
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentOrders.map((order, i) => (
              <OrderCard
                key={order.id.toString()}
                order={order as unknown as import("../../types").Order}
                viewMode="farmer"
                index={i}
              />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
