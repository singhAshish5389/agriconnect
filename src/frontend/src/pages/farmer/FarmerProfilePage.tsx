import { Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { RoleBadge } from "../../components/agri/Badge";
import { Button } from "../../components/agri/Button";
import { Input } from "../../components/agri/Input";
import { Modal } from "../../components/agri/Modal";
import { useAuth } from "../../hooks/useBackend";

export function FarmerProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name ?? "",
    mobile: user?.mobile ?? "",
    location: user?.location ?? "",
  });

  function openEdit() {
    setEditForm({
      name: user?.name ?? "",
      mobile: user?.mobile ?? "",
      location: user?.location ?? "",
    });
    setIsEditing(true);
  }

  function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    // Profile update would call an actor method when available
    setIsEditing(false);
  }

  const profileFields = [
    {
      icon: Mail,
      label: "Email",
      value: user?.email ?? "—",
    },
    {
      icon: Phone,
      label: "Mobile",
      value: user?.mobile ?? "—",
    },
    {
      icon: MapPin,
      label: "Location",
      value: user?.location ?? "—",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-xl border border-border bg-card overflow-hidden shadow-xs"
        data-ocid="profile-card"
      >
        {/* Header banner */}
        <div className="h-24 bg-gradient-to-r from-emerald-400 to-teal-500" />

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Add user profile image here */}
            <div className="h-20 w-20 rounded-full border-4 border-card bg-emerald-100 flex items-center justify-center shadow-sm">
              <User className="h-9 w-9 text-emerald-600" />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Pencil className="h-3 w-3" />}
              onClick={openEdit}
              data-ocid="edit-profile-btn"
            >
              Edit Profile
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground font-display">
                {user?.name ?? "Farmer"}
              </h1>
              {user?.role && <RoleBadge role={user.role} />}
            </div>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          {/* Info fields */}
          <div className="mt-5 space-y-3">
            {profileFields.map((field) => (
              <div
                key={field.label}
                className="flex items-center gap-3 rounded-lg bg-muted/30 px-4 py-3"
              >
                <field.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <p className="text-sm font-medium text-foreground">
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Account status */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="rounded-xl border border-border bg-card p-5 shadow-xs"
      >
        <h2 className="text-sm font-semibold text-foreground font-display mb-3">
          Account Status
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Account standing
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              user?.isBlocked
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-emerald-100 text-emerald-700 border-emerald-200"
            }`}
          >
            {user?.isBlocked ? "Suspended" : "Active"}
          </span>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, name: e.target.value }))
            }
            required
            data-ocid="edit-name-input"
          />
          <Input
            label="Mobile Number"
            type="tel"
            value={editForm.mobile}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, mobile: e.target.value }))
            }
            data-ocid="edit-mobile-input"
          />
          <Input
            label="Location"
            value={editForm.location}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, location: e.target.value }))
            }
            data-ocid="edit-location-input"
          />
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              data-ocid="save-profile-btn"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
