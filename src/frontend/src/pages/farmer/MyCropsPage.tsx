import { useNavigate } from "@tanstack/react-router";
import { Leaf, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { Button } from "../../components/agri/Button";
import { CropCard } from "../../components/agri/CropCard";
import { Input } from "../../components/agri/Input";
import { Loader } from "../../components/agri/Loader";
import { Modal } from "../../components/agri/Modal";
import { Select } from "../../components/agri/Select";
import { Textarea } from "../../components/agri/Textarea";
import { useCrops } from "../../hooks/useBackend";
import type { Crop, CropStatus } from "../../types";

const STATUS_FILTERS: { value: CropStatus | "all"; label: string }[] = [
  { value: "all", label: "All Crops" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const UNIT_OPTIONS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "ton", label: "Ton" },
  { value: "piece", label: "Piece" },
  { value: "bundle", label: "Bundle" },
];

export function MyCropsPage() {
  const navigate = useNavigate();
  const { myCrops, isLoading, updateCrop, deleteCrop } = useCrops();

  const [filter, setFilter] = useState<CropStatus | "all">("all");
  const [editCrop, setEditCrop] = useState<Crop | null>(null);
  const [deletingCrop, setDeletingCrop] = useState<Crop | null>(null);

  const [editForm, setEditForm] = useState({
    cropName: "",
    description: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    location: "",
  });

  function openEdit(crop: Crop) {
    setEditCrop(crop);
    setEditForm({
      cropName: crop.cropName,
      description: crop.description,
      quantity: String(crop.quantity),
      unit: crop.unit,
      pricePerUnit: String(crop.pricePerUnit),
      location: crop.location,
    });
  }

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editCrop) return;
    await updateCrop({
      id: editCrop.id,
      input: {
        cropName: editForm.cropName,
        description: editForm.description,
        quantity: Number(editForm.quantity),
        unit: editForm.unit,
        pricePerUnit: Number(editForm.pricePerUnit),
        location: editForm.location,
        image: editCrop.image,
      },
    });
    setEditCrop(null);
  }

  async function handleDelete() {
    if (!deletingCrop) return;
    await deleteCrop(deletingCrop.id);
    setDeletingCrop(null);
  }

  const filtered =
    filter === "all"
      ? (myCrops as unknown as Crop[])
      : (myCrops as unknown as Crop[]).filter((c) => c.status === filter);

  if (isLoading) return <Loader className="py-24" />;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            My Crops
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your listed crops
          </p>
        </div>
        <Button
          leftIcon={<PlusCircle className="h-4 w-4" />}
          onClick={() => navigate({ to: "/farmer/crops/add" })}
          data-ocid="my-crops-add-btn"
        >
          Add Crop
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2" data-ocid="crop-status-filter">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Crops grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center"
          data-ocid="crops-empty"
        >
          <Leaf className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-foreground">
            No crops found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {filter === "all"
              ? "Start by adding your first crop listing."
              : `No crops with status "${filter}".`}
          </p>
          {filter === "all" && (
            <Button
              size="sm"
              className="mt-4"
              onClick={() => navigate({ to: "/farmer/crops/add" })}
            >
              Add First Crop
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((crop, i) => (
            <CropCard
              key={crop.id.toString()}
              crop={crop}
              viewMode="farmer"
              index={i}
              onEdit={openEdit}
              onDelete={setDeletingCrop}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editCrop}
        onClose={() => setEditCrop(null)}
        title="Edit Crop"
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Crop Name"
            value={editForm.cropName}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, cropName: e.target.value }))
            }
            required
            data-ocid="edit-crop-name"
          />
          <Textarea
            label="Description"
            value={editForm.description}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min="0"
              step="0.01"
              value={editForm.quantity}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, quantity: e.target.value }))
              }
              required
            />
            <Select
              label="Unit"
              options={UNIT_OPTIONS}
              value={editForm.unit}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, unit: e.target.value }))
              }
              required
            />
          </div>
          <Input
            label="Price Per Unit ($)"
            type="number"
            min="0"
            step="0.01"
            value={editForm.pricePerUnit}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, pricePerUnit: e.target.value }))
            }
            required
          />
          <Input
            label="Location"
            value={editForm.location}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, location: e.target.value }))
            }
            required
          />
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setEditCrop(null)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" data-ocid="edit-crop-save">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deletingCrop}
        onClose={() => setDeletingCrop(null)}
        title="Delete Crop"
        size="sm"
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">
            {deletingCrop?.cropName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setDeletingCrop(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={handleDelete}
            data-ocid="delete-crop-confirm"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
