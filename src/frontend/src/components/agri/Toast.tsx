import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { Toast as ToastType } from "../../types";

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const typeStyles = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
};

const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const iconStyles = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-blue-500",
  warning: "text-amber-500",
};

export function Toast({ toast, onRemove }: ToastProps) {
  const Icon = typeIcons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 shadow-md w-80 max-w-sm",
        typeStyles[toast.type],
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconStyles[toast.type])} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
