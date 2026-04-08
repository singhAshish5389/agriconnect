import { OrderStatusBadge } from "@/components/agri/Badge";
import { Input } from "@/components/agri/Input";
import { Loader } from "@/components/agri/Loader";
import { useOrders } from "@/hooks/useBackend";
import type { Order, OrderStatus } from "@/types";
import { ArrowDown, ArrowUp, ArrowUpDown, Package, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

type SortKey = "id" | "quantity" | "totalPrice" | "status" | "createdAt";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | OrderStatus;

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

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

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" />
  );
}

export function OrdersMonitoringPage() {
  const { allOrders, isLoading } = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const processed = useMemo(() => {
    const orders = allOrders as Order[];
    let result = orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.id.toString().includes(q) ||
        o.cropId.toString().includes(q) ||
        o.buyerId.toText().toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortKey === "id") {
        valA = Number(a.id);
        valB = Number(b.id);
      } else if (sortKey === "quantity") {
        valA = a.quantity;
        valB = b.quantity;
      } else if (sortKey === "totalPrice") {
        valA = a.totalPrice;
        valB = b.totalPrice;
      } else if (sortKey === "status") {
        valA = a.status;
        valB = b.status;
      } else if (sortKey === "createdAt") {
        valA = Number(a.createdAt);
        valB = Number(b.createdAt);
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allOrders, search, statusFilter, sortKey, sortDir]);

  const SortableHeader = ({
    label,
    sortK,
  }: { label: string; sortK: SortKey }) => (
    <th
      className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer select-none group"
      onClick={() => handleSort(sortK)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleSort(sortK);
      }}
      data-ocid={`sort-${sortK}`}
    >
      <div className="flex items-center gap-1.5 group-hover:text-foreground transition-colors">
        {label}
        <SortIcon active={sortKey === sortK} dir={sortDir} />
      </div>
    </th>
  );

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display">
            Orders Monitoring
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and monitor all platform orders
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <Input
            placeholder="Search by order ID, crop, or buyer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            data-ocid="orders-search-input"
          />
        </div>
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 h-10 items-center overflow-x-auto">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                statusFilter === opt.value
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="status-filter-btn"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-xl border border-border bg-card shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <SortableHeader label="Order ID" sortK="id" />
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Crop ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Buyer
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Farmer
                </th>
                <SortableHeader label="Quantity" sortK="quantity" />
                <SortableHeader label="Price" sortK="totalPrice" />
                <SortableHeader label="Status" sortK="status" />
                <SortableHeader label="Date" sortK="createdAt" />
              </tr>
            </thead>
            <tbody>
              {processed.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-14 text-center text-muted-foreground"
                    data-ocid="orders-empty-state"
                  >
                    <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">No orders found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                processed.map((order, i) => (
                  <motion.tr
                    key={order.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(i, 20) * 0.03,
                    }}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                    data-ocid="order-row"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{order.id.toString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{order.cropId.toString()}
                    </td>
                    <td className="px-4 py-3 max-w-[100px]">
                      <span
                        className="truncate block text-xs text-muted-foreground"
                        title={order.buyerId.toText()}
                      >
                        {order.buyerId.toText().slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[100px]">
                      <span
                        className="truncate block text-xs text-muted-foreground"
                        title={order.farmerId.toText()}
                      >
                        {order.farmerId.toText().slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{order.quantity}</td>
                    <td className="px-4 py-3 tabular-nums font-semibold text-primary">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {processed.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Showing {processed.length} of {allOrders.length} orders
          </div>
        )}
      </motion.div>
    </div>
  );
}
