import { Package, Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Button } from "../../components/agri/Button";
import { CropCard } from "../../components/agri/CropCard";
import { Input } from "../../components/agri/Input";
import { Loader } from "../../components/agri/Loader";
import { Modal } from "../../components/agri/Modal";
import { useCrops, useOrders } from "../../hooks/useBackend";
import { useAppStore } from "../../store/useAppStore";
import type { Crop } from "../../types";

const PAGE_SIZE = 12;

type SortOption = "price-asc" | "price-desc" | "newest";

export function BrowseCropsPage() {
  const { crops, isLoading } = useCrops();
  const { placeOrder, isPlacingOrder } = useOrders();
  const addToast = useAppStore((s) => s.addToast);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [orderModal, setOrderModal] = useState<Crop | null>(null);
  const [orderQty, setOrderQty] = useState("1");
  const [qtyError, setQtyError] = useState("");

  const approvedCrops = useMemo(
    () => crops.filter((c) => c.status === "approved"),
    [crops],
  );

  const filtered = useMemo(() => {
    let list = approvedCrops;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.cropName.toLowerCase().includes(q));
    }
    if (locationFilter.trim()) {
      const q = locationFilter.toLowerCase();
      list = list.filter((c) => c.location.toLowerCase().includes(q));
    }
    if (minPrice) {
      list = list.filter((c) => c.pricePerUnit >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((c) => c.pricePerUnit <= Number(maxPrice));
    }

    const sorted = [...list];
    if (sortBy === "price-asc")
      sorted.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    else if (sortBy === "price-desc")
      sorted.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    else sorted.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    return sorted;
  }, [approvedCrops, search, locationFilter, minPrice, maxPrice, sortBy]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const totalPrice = useMemo(() => {
    if (!orderModal) return 0;
    const qty = Number(orderQty);
    return Number.isNaN(qty) ? 0 : orderModal.pricePerUnit * qty;
  }, [orderModal, orderQty]);

  function openOrderModal(crop: Crop) {
    setOrderModal(crop);
    setOrderQty("1");
    setQtyError("");
  }

  async function handleConfirmOrder() {
    if (!orderModal) return;
    const qty = Number(orderQty);
    if (!qty || qty < 1) {
      setQtyError("Quantity must be at least 1");
      return;
    }
    if (qty > orderModal.quantity) {
      setQtyError(`Only ${orderModal.quantity} ${orderModal.unit} available`);
      return;
    }
    try {
      await placeOrder({ cropId: orderModal.id, quantity: qty });
      setOrderModal(null);
    } catch {
      addToast("Failed to place order", "error");
    }
  }

  function clearFilters() {
    setSearch("");
    setLocationFilter("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setPage(1);
  }

  const hasActiveFilters =
    search || locationFilter || minPrice || maxPrice || sortBy !== "newest";

  return (
    <div className="space-y-5 max-w-7xl mx-auto" data-ocid="browse-crops-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Browse Crops
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} crop{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setShowFilters((v) => !v)}
            data-ocid="filters-toggle"
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] text-white font-bold">
                !
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<X className="h-3.5 w-3.5" />}
              onClick={clearFilters}
              data-ocid="clear-filters-btn"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <Input
        placeholder="Search crops by name…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        leftAddon={<Search className="h-4 w-4" />}
        data-ocid="crop-search-input"
      />

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl border border-border bg-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="filters-panel"
        >
          <Input
            label="Location"
            placeholder="e.g. Punjab"
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setPage(1);
            }}
          />
          <Input
            label="Min Price ($/unit)"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
          />
          <Input
            label="Max Price ($/unit)"
            type="number"
            min="0"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
          />
          <div className="flex flex-col gap-1">
            <label
              htmlFor="sort-by"
              className="text-sm font-medium text-foreground"
            >
              Sort By
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setPage(1);
              }}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Crops grid */}
      {isLoading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-border bg-muted/30 p-14 text-center"
          data-ocid="crops-empty-state"
        >
          <Package className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="font-medium text-foreground">No crops found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or search query.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((crop, i) => (
              <CropCard
                key={crop.id.toString()}
                crop={crop}
                viewMode="business"
                onOrder={openOrderModal}
                index={i}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                data-ocid="load-more-btn"
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {/* Order modal */}
      <Modal
        isOpen={!!orderModal}
        onClose={() => setOrderModal(null)}
        title="Place Order"
        size="sm"
      >
        {orderModal && (
          <div className="space-y-4" data-ocid="order-modal">
            {/* Crop image area */}
            <div className="h-32 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {orderModal.image ? (
                <img
                  src={orderModal.image.getDirectURL()}
                  alt={orderModal.cropName}
                  className="h-full w-full object-cover"
                />
              ) : (
                // Add crop image here
                <Package className="h-10 w-10 text-muted-foreground/40" />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-base">
                {orderModal.cropName}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                📍 {orderModal.location} · Available: {orderModal.quantity}{" "}
                {orderModal.unit}
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price/unit</span>
              <span className="font-bold text-teal-600 text-base">
                ${orderModal.pricePerUnit.toFixed(2)}
              </span>
            </div>

            <Input
              label="Quantity"
              type="number"
              min="1"
              max={orderModal.quantity}
              value={orderQty}
              onChange={(e) => {
                setOrderQty(e.target.value);
                setQtyError("");
              }}
              error={qtyError}
              rightAddon={<span className="text-xs">{orderModal.unit}</span>}
              data-ocid="order-qty-input"
            />

            <div className="rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-teal-800">
                Total Price
              </span>
              <span className="font-bold text-teal-700 text-lg">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOrderModal(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                isLoading={isPlacingOrder}
                onClick={handleConfirmOrder}
                data-ocid="confirm-order-btn"
              >
                Confirm Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
