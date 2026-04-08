import { OrderStatusBadge } from "@/components/agri/Badge";
import { Button } from "@/components/agri/Button";
import { Loader } from "@/components/agri/Loader";
import { StatsCard } from "@/components/agri/StatsCard";
import { useAdminDashboard, useAdminReports } from "@/hooks/useBackend";
import type { AdminDashboardStats, AdminReport, Order } from "@/types";
import {
  BarChart3,
  Download,
  Leaf,
  Package,
  TrendingUp,
  UserPlus,
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

function exportCSV(topCrops: AdminReport["topCrops"], recentOrders: Order[]) {
  const cropsRows = topCrops.map(
    (c) => `${c.cropName},${c.totalOrders},${c.totalRevenue}`,
  );
  const ordersRows = recentOrders.map(
    (o) =>
      `${o.id},${o.cropId},${o.quantity},${o.totalPrice},${o.status},${formatDate(o.createdAt)}`,
  );

  const cropsSection = [
    "Top Crops by Revenue",
    "Crop Name,Total Orders,Total Revenue",
    ...cropsRows,
  ].join("\n");

  const ordersSection = [
    "",
    "Recent Orders",
    "Order ID,Crop ID,Quantity,Total Price,Status,Date",
    ...ordersRows,
  ].join("\n");

  const csv = `${cropsSection}\n${ordersSection}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `agriconnect-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminReportsPage() {
  const dashboardQuery = useAdminDashboard();
  const reportsQuery = useAdminReports();

  const stats = dashboardQuery.data as AdminDashboardStats | null | undefined;
  const reports = reportsQuery.data as AdminReport | null | undefined;

  if (reportsQuery.isLoading || dashboardQuery.isLoading)
    return <Loader fullScreen />;

  const topCrops = reports?.topCrops ?? [];
  const recentOrders = reports?.recentOrders?.slice(0, 10) ?? [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-display">
              Reports
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform analytics and exportable data
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={() => exportCSV(topCrops, recentOrders)}
          data-ocid="export-csv-btn"
        >
          Export CSV
        </Button>
      </motion.div>

      {/* Summary stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={TrendingUp}
            variant="emerald"
            index={0}
          />
          <StatsCard
            title="New Users This Month"
            value={reports?.newUsersThisMonth.toString() ?? "—"}
            icon={UserPlus}
            variant="teal"
            index={1}
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={Package}
            variant="default"
            index={2}
          />
          <StatsCard
            title="Approved Crops"
            value={stats.approvedCrops.toString()}
            icon={Leaf}
            variant="amber"
            index={3}
          />
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
            <Leaf className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              Top Crops by Revenue
            </h2>
          </div>
          {topCrops.length === 0 ? (
            <div className="py-10 text-center" data-ocid="top-crops-empty">
              <Leaf className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No crop data available yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-semibold text-muted-foreground">
                      #
                    </th>
                    <th className="pb-3 text-left font-semibold text-muted-foreground">
                      Crop
                    </th>
                    <th className="pb-3 text-right font-semibold text-muted-foreground">
                      Orders
                    </th>
                    <th className="pb-3 text-right font-semibold text-muted-foreground">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCrops.map((crop, i) => (
                    <motion.tr
                      key={crop.cropName}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.06 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                      data-ocid="top-crop-row"
                    >
                      <td className="py-3 pr-3 text-muted-foreground font-mono">
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              Recent Orders (Last 10)
            </h2>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-10 text-center" data-ocid="recent-orders-empty">
              <Package className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-semibold text-muted-foreground">
                      ID
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
                  {recentOrders.map((order, i) => (
                    <motion.tr
                      key={order.id.toString()}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                      data-ocid="recent-order-row"
                    >
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        #{order.id.toString()}
                      </td>
                      <td className="py-3 text-right tabular-nums font-semibold text-primary">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="py-3 pl-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
