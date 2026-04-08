import { cn } from "@/lib/utils";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export function Loader({
  fullScreen = false,
  size = "md",
  className,
}: LoaderProps) {
  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeMap[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading AgriConnect...
          </p>
        </div>
      </div>
    );
  }

  return spinner;
}
