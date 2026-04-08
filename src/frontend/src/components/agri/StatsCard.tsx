import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: "default" | "emerald" | "teal" | "slate" | "amber";
  className?: string;
  index?: number;
}

const variantStyles = {
  default: "bg-card border-border",
  emerald: "bg-emerald-50 border-emerald-100",
  teal: "bg-teal-50 border-teal-100",
  slate: "bg-slate-50 border-slate-100",
  amber: "bg-amber-50 border-amber-100",
};

const iconStyles = {
  default: "bg-primary/10 text-primary",
  emerald: "bg-emerald-100 text-emerald-600",
  teal: "bg-teal-100 text-teal-600",
  slate: "bg-slate-100 text-slate-600",
  amber: "bg-amber-100 text-amber-600",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
  index = 0,
}: StatsCardProps) {
  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "rounded-xl border p-5 shadow-xs transition-smooth hover:shadow-sm",
        variantStyles[variant],
        className,
      )}
      data-ocid="stats-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-foreground font-display">
            {value}
          </p>
          {trend && (
            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                isPositiveTrend ? "text-emerald-600" : "text-red-500",
              )}
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {Math.abs(trend.value)}% {trend.label ?? "vs last month"}
              </span>
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5 shrink-0", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
