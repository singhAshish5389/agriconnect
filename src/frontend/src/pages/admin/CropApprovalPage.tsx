import { CropStatusBadge } from "@/components/agri/Badge";
import { Button } from "@/components/agri/Button";
import { Loader } from "@/components/agri/Loader";
import { Modal } from "@/components/agri/Modal";
import { useCrops } from "@/hooks/useBackend";
import type { Crop, CropId, CropStatus } from "@/types";
import {
  CheckCircle,
  ImageIcon,
  Leaf,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type FilterTab = CropStatus | "all";

const TABS: { label: string; value: FilterTab }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All Crops", value: "all" },
];

function CropApprovalCard({
  crop,
  index,
  onApprove,
  onRejectRequest,
}: {
  crop: Crop;
  index: number;
  onApprove: (id: CropId) => void;
  onRejectRequest: (crop: Crop) => void;
}) {
  const [approving, setApproving] = useState(false);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await onApprove(crop.id);
    } finally {
      setApproving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-xl border border-border bg-card shadow-xs overflow-hidden flex flex-col"
      data-ocid="crop-approval-card"
    >
      {/* Add crop image here */}
      <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border-b border-border">
        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate font-display">
              {crop.cropName}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{crop.location}</span>
            </div>
          </div>
          <CropStatusBadge status={crop.status} />
        </div>

        {crop.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {crop.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-foreground">
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {crop.quantity} {crop.unit}
            </span>
          </div>
          <div className="font-semibold text-primary">
            ₹{crop.pricePerUnit}/{crop.unit}
          </div>
        </div>

        {crop.status === "pending" && (
          <div className="flex gap-2 mt-auto pt-2 border-t border-border/50">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle className="h-3.5 w-3.5" />}
              onClick={handleApprove}
              isLoading={approving}
              className="flex-1"
              data-ocid="approve-crop-btn"
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<XCircle className="h-3.5 w-3.5" />}
              onClick={() => onRejectRequest(crop)}
              className="flex-1"
              data-ocid="reject-crop-btn"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CropApprovalPage() {
  const { crops, isLoading, approveCrop, rejectCrop } = useCrops();

  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const [rejectTarget, setRejectTarget] = useState<Crop | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const allCrops = crops as Crop[];
  const filtered =
    activeTab === "all"
      ? allCrops
      : allCrops.filter((c) => c.status === activeTab);

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setIsRejecting(true);
    try {
      await rejectCrop(rejectTarget.id);
    } finally {
      setIsRejecting(false);
      setRejectTarget(null);
      setRejectReason("");
    }
  };

  const tabCounts: Record<FilterTab, number> = {
    pending: allCrops.filter((c) => c.status === "pending").length,
    approved: allCrops.filter((c) => c.status === "approved").length,
    rejected: allCrops.filter((c) => c.status === "rejected").length,
    all: allCrops.length,
  };

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display">
            Crop Approval
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve or reject crop listings
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-1 bg-muted/40 p-1 rounded-xl w-fit"
        data-ocid="crop-filter-tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.value
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`tab-${tab.value}`}
          >
            {tab.label}
            <span
              className={`text-xs font-mono rounded-full px-1.5 py-0.5 ${
                activeTab === tab.value
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tabCounts[tab.value]}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Cards grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="crops-empty-state"
          >
            <Leaf className="h-14 w-14 text-muted-foreground/30 mb-3" />
            <p className="font-semibold text-foreground">
              No {activeTab === "all" ? "" : activeTab} crops
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "pending"
                ? "All crops have been reviewed."
                : "Nothing here yet."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((crop, i) => (
              <CropApprovalCard
                key={crop.id.toString()}
                crop={crop}
                index={i}
                onApprove={approveCrop}
                onRejectRequest={setRejectTarget}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => {
          setRejectTarget(null);
          setRejectReason("");
        }}
        title="Reject Crop"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Rejecting{" "}
            <span className="font-semibold text-foreground">
              {rejectTarget?.cropName}
            </span>
            . Optionally provide a reason.
          </p>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="reject-reason"
              className="text-sm font-medium text-foreground"
            >
              Reason (optional)
            </label>
            <textarea
              id="reject-reason"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              placeholder="Enter rejection reason…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              data-ocid="reject-reason-input"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectTarget(null);
                setRejectReason("");
              }}
              data-ocid="cancel-reject-btn"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isRejecting}
              onClick={handleRejectConfirm}
              data-ocid="confirm-reject-btn"
            >
              Reject Crop
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
