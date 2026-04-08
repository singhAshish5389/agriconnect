import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const MotionDialog = motion.create("dialog");

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <MotionDialog
            open
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            aria-modal="true"
            className={cn(
              "relative z-10 w-full rounded-xl bg-card border border-border shadow-xl m-0 p-0",
              sizeMap[size],
              className,
            )}
            aria-labelledby={title ? "modal-title" : undefined}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-foreground"
                >
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            )}
            <div className="p-4">{children}</div>
          </MotionDialog>
        </div>
      )}
    </AnimatePresence>
  );
}
