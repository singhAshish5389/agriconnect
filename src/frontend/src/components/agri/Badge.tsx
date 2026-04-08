import { cn } from "@/lib/utils";
import type { CropStatus, OrderStatus } from "../../types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "neutral";
  className?: string;
}

const variantStyles = {
  default: "bg-primary/10 text-primary border-primary/20",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  error: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CropStatusBadge({ status }: { status: CropStatus }) {
  const variantMap: Record<CropStatus, BadgeProps["variant"]> = {
    pending: "warning",
    approved: "success",
    rejected: "error",
  };
  const labelMap: Record<CropStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variantMap: Record<OrderStatus, BadgeProps["variant"]> = {
    pending: "warning",
    accepted: "info",
    completed: "success",
    rejected: "error",
  };
  const labelMap: Record<OrderStatus, string> = {
    pending: "Pending",
    accepted: "Accepted",
    completed: "Completed",
    rejected: "Rejected",
  };
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
}

export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    farmer: "bg-emerald-100 text-emerald-700 border-emerald-200",
    business: "bg-teal-100 text-teal-700 border-teal-200",
    admin: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[role] ?? styles.admin,
      )}
    >
      {role}
    </span>
  );
}
