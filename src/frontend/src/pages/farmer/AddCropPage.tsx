import { useNavigate } from "@tanstack/react-router";
import { ImagePlus, Leaf, X } from "lucide-react";
import { motion } from "motion/react";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { Button } from "../../components/agri/Button";
import { Input } from "../../components/agri/Input";
import { Select } from "../../components/agri/Select";
import { Textarea } from "../../components/agri/Textarea";
import { useCrops } from "../../hooks/useBackend";
import type { CropInput } from "../../types";

const UNIT_OPTIONS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "ton", label: "Ton" },
  { value: "piece", label: "Piece" },
  { value: "bundle", label: "Bundle" },
];

interface FormErrors {
  cropName?: string;
  quantity?: string;
  pricePerUnit?: string;
  unit?: string;
  location?: string;
}

export function AddCropPage() {
  const navigate = useNavigate();
  const { addCrop, isAddingCrop } = useCrops();

  const [form, setForm] = useState({
    cropName: "",
    description: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    location: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.cropName.trim()) e.cropName = "Crop name is required";
    if (!form.quantity || Number(form.quantity) <= 0)
      e.quantity = "Quantity must be greater than 0";
    if (!form.pricePerUnit || Number(form.pricePerUnit) <= 0)
      e.pricePerUnit = "Price must be greater than 0";
    if (!form.unit) e.unit = "Unit is required";
    if (!form.location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const input: CropInput = {
      cropName: form.cropName.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity),
      unit: form.unit,
      pricePerUnit: Number(form.pricePerUnit),
      location: form.location.trim(),
      // Add crop image here — ExternalBlob would be set from uploaded file
      image: undefined,
    };

    await addCrop(input);
    navigate({ to: "/farmer/crops" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-xl border border-border bg-card p-6 shadow-xs"
      >
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground font-display">
              Add New Crop
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details to list your crop on the marketplace.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Image upload */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">
              Crop Image
            </p>
            <div className="flex gap-4 items-start">
              {/* Add crop image here */}
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 flex items-center justify-center">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Crop preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-1 right-1 rounded-full bg-foreground/70 p-0.5 text-background hover:bg-foreground transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors w-full text-left"
                  data-ocid="crop-image-upload"
                >
                  Click to upload a photo of your crop
                </button>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPEG, PNG up to 5 MB
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                  aria-label="Upload crop image"
                />
              </div>
            </div>
          </div>

          {/* Crop Name */}
          <Input
            label="Crop Name"
            placeholder="e.g. Organic Tomatoes"
            value={form.cropName}
            onChange={(e) =>
              setForm((f) => ({ ...f, cropName: e.target.value }))
            }
            error={errors.cropName}
            required
            data-ocid="crop-name-input"
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Describe your crop — variety, quality, growing conditions…"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            data-ocid="crop-description-input"
          />

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: e.target.value }))
              }
              error={errors.quantity}
              required
              data-ocid="crop-quantity-input"
            />
            <Select
              label="Unit"
              options={UNIT_OPTIONS}
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              error={errors.unit}
              required
              data-ocid="crop-unit-select"
            />
          </div>

          {/* Price */}
          <Input
            label="Price Per Unit ($)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.pricePerUnit}
            onChange={(e) =>
              setForm((f) => ({ ...f, pricePerUnit: e.target.value }))
            }
            error={errors.pricePerUnit}
            required
            data-ocid="crop-price-input"
          />

          {/* Location */}
          <Input
            label="Location"
            placeholder="e.g. Punjab, India"
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            error={errors.location}
            required
            data-ocid="crop-location-input"
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate({ to: "/farmer/crops" })}
              data-ocid="add-crop-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isAddingCrop}
              data-ocid="add-crop-submit"
            >
              Add Crop
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
