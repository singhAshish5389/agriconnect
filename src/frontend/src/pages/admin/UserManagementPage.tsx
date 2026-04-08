import { Badge, RoleBadge } from "@/components/agri/Badge";
import { Button } from "@/components/agri/Button";
import { Input } from "@/components/agri/Input";
import { Loader } from "@/components/agri/Loader";
import { Modal } from "@/components/agri/Modal";
import { useAdminUsers } from "@/hooks/useBackend";
import type { UserProfile, UserRole } from "@/types";
import { Search, ShieldBan, ShieldCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type RoleFilter = "all" | UserRole;

function UserRow({
  user,
  index,
  onBlockRequest,
  onUnblockRequest,
}: {
  user: UserProfile;
  index: number;
  onBlockRequest: (u: UserProfile) => void;
  onUnblockRequest: (u: UserProfile) => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
      data-ocid="user-row"
    >
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">
        {user.mobile || "—"}
      </td>
      <td className="py-3 pr-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground truncate max-w-[120px]">
        {user.location || "—"}
      </td>
      <td className="py-3 pr-4">
        {user.isBlocked ? (
          <Badge variant="error">Blocked</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </td>
      <td className="py-3">
        {user.role !== "admin" &&
          (user.isBlocked ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
              onClick={() => onUnblockRequest(user)}
              data-ocid="unblock-user-btn"
            >
              Unblock
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<ShieldBan className="h-3.5 w-3.5" />}
              onClick={() => onBlockRequest(user)}
              data-ocid="block-user-btn"
            >
              Block
            </Button>
          ))}
      </td>
    </motion.tr>
  );
}

export function UserManagementPage() {
  const { users, isLoading, blockUser, unblockUser } = useAdminUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [isBlockModal, setIsBlockModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleFilterOptions: { label: string; value: RoleFilter }[] = [
    { label: "All Users", value: "all" },
    { label: "Farmers", value: "farmer" },
    { label: "Business", value: "business" },
  ];

  const filtered = (users as UserProfile[]).filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const handleBlockConfirm = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    try {
      await blockUser(targetUser.id);
    } finally {
      setIsSubmitting(false);
      setIsBlockModal(false);
      setTargetUser(null);
    }
  };

  const handleUnblock = async (user: UserProfile) => {
    await unblockUser(user.id);
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
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display">
            User Management
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage platform users, roles, and access
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            data-ocid="user-search-input"
          />
        </div>
        <div className="flex gap-1.5 bg-muted/50 rounded-lg p-1 h-10 items-center">
          {roleFilterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRoleFilter(opt.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                roleFilter === opt.value
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="role-filter-btn"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-xl border border-border bg-card shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                    data-ocid="users-empty-state"
                  >
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">No users found</p>
                    <p className="text-xs mt-1">
                      Try adjusting your search or filter
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <UserRow
                    key={user.id.toText()}
                    user={user}
                    index={i}
                    onBlockRequest={(u) => {
                      setTargetUser(u);
                      setIsBlockModal(true);
                    }}
                    onUnblockRequest={handleUnblock}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </motion.div>

      {/* Block Confirmation Modal */}
      <Modal
        isOpen={isBlockModal}
        onClose={() => {
          setIsBlockModal(false);
          setTargetUser(null);
        }}
        title="Block User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to block{" "}
            <span className="font-semibold text-foreground">
              {targetUser?.name}
            </span>
            ? They will lose access to the platform.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsBlockModal(false);
                setTargetUser(null);
              }}
              data-ocid="cancel-block-btn"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleBlockConfirm}
              data-ocid="confirm-block-btn"
            >
              Block User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
