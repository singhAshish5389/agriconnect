import { cn } from "@/lib/utils";
import { MapPin, Package, Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Crop } from "../../types";
import { CropStatusBadge } from "./Badge";
import { Button } from "./Button";

interface CropCardProps {
  crop: Crop;
  viewMode?: "farmer" | "business" | "admin";
  onEdit?: (crop: Crop) => void;
  onDelete?: (crop: Crop) => void;
  onOrder?: (crop: Crop) => void;
  onApprove?: (crop: Crop) => void;
  onReject?: (crop: Crop) => void;
  index?: number;
}

export function CropCard({
  crop,
  viewMode = "business",
  onEdit,
  onDelete,
  onOrder,
  onApprove,
  onReject,
  index = 0,
}: CropCardProps) {
  const imageUrl = crop.image?.getDirectURL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className={cn(
        "group rounded-xl border border-border bg-card overflow-hidden shadow-xs",
        "hover:shadow-md transition-smooth hover:-translate-y-0.5",
      )}
      data-ocid="crop-card"
    >
      {/* Image */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={crop.cropName}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Add crop image here
          <div className="flex h-full items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <CropStatusBadge status={crop.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">
          {crop.cropName}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {crop.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${crop.pricePerUnit.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">
              /{crop.unit}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            Qty: {crop.quantity} {crop.unit}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{crop.location}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {viewMode === "business" && crop.status === "approved" && onOrder && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onOrder(crop)}
              data-ocid="crop-order-btn"
            >
              Place Order
            </Button>
          )}
          {viewMode === "farmer" && (
            <>
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Pencil className="h-3 w-3" />}
                  onClick={() => onEdit(crop)}
                  data-ocid="crop-edit-btn"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={<Trash2 className="h-3 w-3" />}
                  onClick={() => onDelete(crop)}
                  data-ocid="crop-delete-btn"
                >
                  Delete
                </Button>
              )}
            </>
          )}
          {viewMode === "admin" && crop.status === "pending" && (
            <>
              {onApprove && (
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onApprove(crop)}
                >
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  size="sm"
                  variant="danger"
                  className="flex-1"
                  onClick={() => onReject(crop)}
                >
                  Reject
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
