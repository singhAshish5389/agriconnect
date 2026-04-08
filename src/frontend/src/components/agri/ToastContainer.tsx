import { AnimatePresence } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { Toast } from "./Toast";

export function ToastContainer() {
  const toasts = useAppStore((s) => s.notifications.toasts);
  const removeToast = useAppStore((s) => s.removeToast);

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
