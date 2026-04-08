import { motion } from "motion/react";
import { useState } from "react";
import { Loader } from "../../components/agri/Loader";
import { OrderCard } from "../../components/agri/OrderCard";
import { useOrders } from "../../hooks/useBackend";
import type { Order, OrderStatus } from "../../types";

const STATUS_TABS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export function FarmerOrdersPage() {
  const { farmerOrders, isLoading, updateOrderStatus } = useOrders();
  const [tab, setTab] = useState<"all" | OrderStatus>("all");

  const orders = farmerOrders as unknown as Order[];

  const filtered =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  async function handleAccept(order: Order) {
    await updateOrderStatus({ orderId: order.id, status: "accepted" });
  }

  async function handleReject(order: Order) {
    await updateOrderStatus({ orderId: order.id, status: "rejected" });
  }

  async function handleComplete(order: Order) {
    await updateOrderStatus({ orderId: order.id, status: "completed" });
  }

  if (isLoading) return <Loader className="py-24" />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage orders for your crops
        </p>
      </div>

      {/* Status tabs */}
      <div
        className="flex flex-wrap gap-2 border-b border-border pb-2"
        data-ocid="order-status-tabs"
      >
        {STATUS_TABS.map((t) => {
          const count =
            t.value === "all"
              ? orders.length
              : orders.filter((o) => o.status === t.value).length;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                tab === t.value
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    tab === t.value
                      ? "bg-white/25 text-white"
                      : "bg-muted-foreground/15 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center"
          data-ocid="orders-empty"
        >
          <p className="text-sm font-medium text-foreground">No orders found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {tab === "all"
              ? "You haven't received any orders yet."
              : `No orders with status "${tab}".`}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order, i) => (
            <OrderCard
              key={order.id.toString()}
              order={order}
              viewMode="farmer"
              index={i}
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
