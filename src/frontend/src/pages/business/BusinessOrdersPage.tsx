import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../components/agri/Button";
import { Loader } from "../../components/agri/Loader";
import { OrderCard } from "../../components/agri/OrderCard";
import { useOrders } from "../../hooks/useBackend";
import type { OrderStatus } from "../../types";

type TabStatus = "all" | OrderStatus;

const TABS: { value: TabStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export function BusinessOrdersPage() {
  const navigate = useNavigate();
  const { orders, isLoading } = useOrders();
  const [activeTab, setActiveTab] = useState<TabStatus>("all");

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <div
      className="space-y-5 max-w-5xl mx-auto"
      data-ocid="business-orders-page"
    >
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">
          My Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track and manage all your crop orders
        </p>
      </div>

      {/* Status tabs */}
      <div
        className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide"
        data-ocid="order-status-tabs"
      >
        {TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? orders.length
              : orders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`
                flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200
                ${
                  activeTab === tab.value
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
              data-ocid={`tab-${tab.value}`}
            >
              {tab.label}
              <span
                className={`
                  rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center
                  ${activeTab === tab.value ? "bg-white/20" : "bg-muted"}
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <Loader />
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-border bg-muted/30 py-14 text-center"
          data-ocid="empty-state-orders"
        >
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="font-medium text-foreground">
            {activeTab === "all" ? "No orders yet" : `No ${activeTab} orders`}
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {activeTab === "all"
              ? "Browse crops and place your first order to get started."
              : "No orders match this status filter."}
          </p>
          {activeTab === "all" && (
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => navigate({ to: "/business/browse" })}
            >
              Browse Crops
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order, i) => (
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
  );
}
