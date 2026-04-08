import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Package, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Button } from "../../components/agri/Button";
import { Input } from "../../components/agri/Input";
import { Loader } from "../../components/agri/Loader";
import { useCrops, useOrders } from "../../hooks/useBackend";
import { useAppStore } from "../../store/useAppStore";

export function PlaceOrderPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { cropId?: string };
  const cropId = search.cropId ? BigInt(search.cropId) : undefined;

  const { crops, isLoading: cropsLoading } = useCrops();
  const { placeOrder, isPlacingOrder } = useOrders();
  const addToast = useAppStore((s) => s.addToast);

  const [quantity, setQuantity] = useState("1");
  const [qtyError, setQtyError] = useState("");

  const crop = useMemo(
    () => crops.find((c) => c.id === cropId),
    [crops, cropId],
  );

  const totalPrice = useMemo(() => {
    if (!crop) return 0;
    const qty = Number(quantity);
    return Number.isNaN(qty) || qty < 1 ? 0 : crop.pricePerUnit * qty;
  }, [crop, quantity]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!crop) return;
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      setQtyError("Quantity must be at least 1");
      return;
    }
    if (qty > crop.quantity) {
      setQtyError(`Only ${crop.quantity} ${crop.unit} available`);
      return;
    }
    try {
      await placeOrder({ cropId: crop.id, quantity: qty });
      navigate({ to: "/business/orders" });
    } catch {
      addToast("Failed to place order. Please try again.", "error");
    }
  }

  if (cropsLoading) return <Loader fullScreen />;

  if (!crop) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h2 className="text-lg font-semibold text-foreground">
          Crop not found
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          The crop you're looking for isn't available.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: "/business/browse" })}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Browse
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5" data-ocid="place-order-page">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => navigate({ to: "/business/browse" })}
        className="-ml-2"
      >
        Back to Browse
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
      >
        {/* Crop image */}
        <div className="h-52 bg-muted relative overflow-hidden">
          {crop.image ? (
            <img
              src={crop.image.getDirectURL()}
              alt={crop.cropName}
              className="h-full w-full object-cover"
            />
          ) : (
            // Add crop image here
            <div className="flex h-full items-center justify-center">
              <Package className="h-14 w-14 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h1 className="text-xl font-bold text-white font-display">
              {crop.cropName}
            </h1>
          </div>
        </div>

        {/* Crop details */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-0.5">
                Price / unit
              </p>
              <p className="font-bold text-teal-600 text-lg">
                ${crop.pricePerUnit.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /{crop.unit}
                </span>
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-0.5">Available</p>
              <p className="font-bold text-foreground text-lg">
                {crop.quantity}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {crop.unit}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{crop.location}</span>
          </div>

          {crop.description && (
            <p className="text-sm text-muted-foreground border-t border-border pt-3">
              {crop.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Order form */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm"
      >
        <h2 className="font-semibold text-foreground font-display">
          Order Details
        </h2>

        <Input
          label="Quantity"
          type="number"
          min="1"
          max={crop.quantity}
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setQtyError("");
          }}
          error={qtyError}
          rightAddon={<span className="text-xs">{crop.unit}</span>}
          required
          data-ocid="order-quantity-input"
        />

        {/* Total calculation */}
        <div className="rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-700">Order Total</p>
              <p className="text-xs text-teal-600/70 mt-0.5">
                {quantity || 0} × ${crop.pricePerUnit.toFixed(2)}
              </p>
            </div>
            <p className="text-2xl font-bold text-teal-700">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          isLoading={isPlacingOrder}
          leftIcon={<ShoppingCart className="h-4 w-4" />}
          data-ocid="confirm-order-submit"
        >
          Confirm Order
        </Button>
      </motion.form>
    </div>
  );
}
