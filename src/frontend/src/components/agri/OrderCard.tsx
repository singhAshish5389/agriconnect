import { cn } from "@/lib/utils";
import { Clock, DollarSign, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { Order } from "../../types";
import { OrderStatusBadge } from "./Badge";
import { Button } from "./Button";

interface OrderCardProps {
  order: Order;
  cropName?: string;
  viewMode?: "farmer" | "business" | "admin";
  onAccept?: (order: Order) => void;
  onReject?: (order: Order) => void;
  onComplete?: (order: Order) => void;
  index?: number;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrderCard({
  order,
  cropName,
  viewMode = "business",
  onAccept,
  onReject,
  onComplete,
  index = 0,
}: OrderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-xs",
        "hover:shadow-sm transition-smooth",
      )}
      data-ocid="order-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
            <ShoppingCart className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              {cropName ?? `Order #${order.id.toString()}`}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Quantity</p>
          <p className="font-semibold text-foreground">
            {order.quantity} units
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Total Price</p>
          <p className="font-semibold text-foreground flex items-center gap-0.5">
            <DollarSign className="h-3 w-3" />
            {order.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Actions for farmer */}
      {viewMode === "farmer" && order.status === "pending" && (
        <div className="mt-3 flex gap-2">
          {onAccept && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onAccept(order)}
              data-ocid="order-accept-btn"
            >
              Accept
            </Button>
          )}
          {onReject && (
            <Button
              size="sm"
              variant="danger"
              className="flex-1"
              onClick={() => onReject(order)}
              data-ocid="order-reject-btn"
            >
              Reject
            </Button>
          )}
        </div>
      )}

      {viewMode === "farmer" && order.status === "accepted" && onComplete && (
        <div className="mt-3">
          <Button
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => onComplete(order)}
          >
            Mark Completed
          </Button>
        </div>
      )}
    </motion.div>
  );
}
