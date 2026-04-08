import { OrderStatusBadge } from "@/components/agri/Badge";
import { Loader } from "@/components/agri/Loader";
import { StatsCard } from "@/components/agri/StatsCard";
import { useAdminDashboard, useAdminReports } from "@/hooks/useBackend";
import type { AdminDashboardStats, AdminReport, Order } from "@/types";
import {
  BarChart3,
  CheckCircle,
  DollarSign,
  Leaf,
  Package,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatsGrid({ stats }: { stats: AdminDashboardStats }) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      variant: "default" as const,
      index: 0,
    },
    {
      title: "Total Farmers",
      value: stats.totalFarmers.toString(),
      icon: Leaf,
      variant: "emerald" as const,
      index: 1,
    },
    {
      title: "Business Users",
      value: stats.totalBusinessUsers.toString(),
      icon: BarChart3,
      variant: "teal" as const,
      index: 2,
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers.toString(),
      icon: ShieldAlert,
      variant: "slate" as const,
      index: 3,
    },
    {
      title: "Total Crops",
      value: stats.totalCrops.toString(),
      icon: Leaf,
      variant: "emerald" as const,
      index: 4,
    },
    {
      title: "Pending Crops",
      value: stats.pendingCrops.toString(),
      icon: Package,
      variant: "amber" as const,
      index: 5,
    },
    {
      title: "Approved Crops",
      value: stats.approvedCrops.toString(),
      icon: CheckCircle,
      variant: "emerald" as const,
      index: 6,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: Package,
      variant: "default" as const,
      index: 7,
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders.toString(),
      icon: CheckCircle,
      variant: "teal" as const,
      index: 8,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      variant: "emerald" as const,
      index: 9,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((c) => (
        <StatsCard key={c.title} {...c} />
      ))}
    </div>
  );
}

function TopCropsTable({ topCrops }: { topCrops: AdminReport["topCrops"] }) {
  if (!topCrops.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No crop data available yet.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 text-left font-semibold text-muted-foreground">
              #
            </th>
            <th className="pb-3 text-left font-semibold text-muted-foreground">
              Crop Name
            </th>
            <th className="pb-3 text-right font-semibold text-muted-foreground">
              Total Orders
            </th>
            <th className="pb-3 text-right font-semibold text-muted-foreground">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {topCrops.map((crop, i) => (
            <tr
              key={crop.cropName}
              className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td className="py-3 pr-4 text-muted-foreground font-mono">
                {i + 1}
              </td>
              <td className="py-3 font-medium text-foreground">
                {crop.cropName}
              </td>
              <td className="py-3 text-right tabular-nums">
                {crop.totalOrders.toString()}
              </td>
              <td className="py-3 text-right tabular-nums font-semibold text-primary">
                {formatCurrency(crop.totalRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentOrdersTable({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No recent orders found.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 text-left font-semibold text-muted-foreground">
              Order ID
            </th>
            <th className="pb-3 text-left font-semibold text-muted-foreground">
              Quantity
            </th>
            <th className="pb-3 text-right font-semibold text-muted-foreground">
              Price
            </th>
            <th className="pb-3 text-left font-semibold text-muted-foreground pl-4">
              Status
            </th>
            <th className="pb-3 text-left font-semibold text-muted-foreground">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id.toString()}
              className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td className="py-3 font-mono text-xs text-muted-foreground">
                #{order.id.toString()}
              </td>
              <td className="py-3">{order.quantity} units</td>
              <td className="py-3 text-right tabular-nums font-semibold text-primary">
                {formatCurrency(order.totalPrice)}
              </td>
              <td className="py-3 pl-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="py-3 text-muted-foreground">
                {formatDate(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminDashboardPage() {
  const dashboardQuery = useAdminDashboard();
  const reportsQuery = useAdminReports();

  const stats = dashboardQuery.data as AdminDashboardStats | null | undefined;
  const reports = reportsQuery.data as AdminReport | null | undefined;

  if (dashboardQuery.isLoading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground font-display">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview and key metrics
        </p>
      </motion.div>

      {stats ? (
        <StatsGrid stats={stats} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => `skel-${i}`).map((k) => (
            <div key={k} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Crops */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              Top Crops by Revenue
            </h2>
          </div>
          {reportsQuery.isLoading ? (
            <div className="space-y-3">
              {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
                <div key={k} className="h-8 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <TopCropsTable topCrops={reports?.topCrops ?? []} />
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
          </div>
          {reportsQuery.isLoading ? (
            <div className="space-y-3">
              {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
                <div key={k} className="h-8 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <RecentOrdersTable
              orders={reports?.recentOrders.slice(0, 10) ?? []}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
