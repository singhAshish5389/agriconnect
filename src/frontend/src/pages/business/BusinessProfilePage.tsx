import { Building2, Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { RoleBadge } from "../../components/agri/Badge";
import { Button } from "../../components/agri/Button";
import { Input } from "../../components/agri/Input";
import { Loader } from "../../components/agri/Loader";
import { Modal } from "../../components/agri/Modal";
import { useAuth } from "../../hooks/useBackend";

interface ProfileField {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function BusinessProfilePage() {
  const { user, profileLoading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  // Local edit state (UI only — update via backend mutation when available)
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editMobile, setEditMobile] = useState(user?.mobile ?? "");
  const [editLocation, setEditLocation] = useState(user?.location ?? "");

  function openEdit() {
    setEditName(user?.name ?? "");
    setEditMobile(user?.mobile ?? "");
    setEditLocation(user?.location ?? "");
    setEditOpen(true);
  }

  if (profileLoading) return <Loader fullScreen />;
  if (!user) return null;

  const profileFields: ProfileField[] = [
    {
      icon: <Mail className="h-4 w-4 text-teal-600" />,
      label: "Email",
      value: user.email,
    },
    {
      icon: <Phone className="h-4 w-4 text-teal-600" />,
      label: "Mobile",
      value: user.mobile || "Not provided",
    },
    {
      icon: <MapPin className="h-4 w-4 text-teal-600" />,
      label: "Location",
      value: user.location || "Not set",
    },
    {
      icon: <Building2 className="h-4 w-4 text-teal-600" />,
      label: "Account Type",
      value: "Business Account",
    },
  ];

  return (
    <div
      className="max-w-xl mx-auto space-y-5"
      data-ocid="business-profile-page"
    >
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your business account information
        </p>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
      >
        {/* Banner */}
        <div className="h-24 bg-gradient-to-br from-teal-500/20 to-primary/10" />

        {/* Avatar + name */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Add user profile image here */}
            <div className="h-20 w-20 rounded-full border-4 border-card bg-teal-100 flex items-center justify-center shadow-sm">
              <User className="h-8 w-8 text-teal-600" />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
              onClick={openEdit}
              data-ocid="edit-profile-btn"
            >
              Edit Profile
            </Button>
          </div>

          <h2 className="text-xl font-bold text-foreground font-display">
            {user.name}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <RoleBadge role={user.role} />
            {user.isBlocked && (
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                Blocked
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile fields */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border"
      >
        {profileFields.map((field) => (
          <div key={field.label} className="flex items-center gap-4 px-5 py-4">
            <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              {field.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{field.label}</p>
              <p className="text-sm font-medium text-foreground truncate">
                {field.value}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Account ID */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.14 }}
        className="rounded-xl border border-border bg-muted/30 px-5 py-4"
      >
        <p className="text-xs text-muted-foreground mb-1">Account ID</p>
        <p className="text-xs font-mono text-foreground break-all">
          {user.id.toText()}
        </p>
      </motion.div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Profile update mutation would go here when backend supports it
            setEditOpen(false);
          }}
          className="space-y-4"
          data-ocid="edit-profile-form"
        >
          <Input
            label="Full Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            data-ocid="edit-name-input"
          />
          <Input
            label="Mobile"
            type="tel"
            value={editMobile}
            onChange={(e) => setEditMobile(e.target.value)}
            data-ocid="edit-mobile-input"
          />
          <Input
            label="Location"
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            placeholder="City, State"
            data-ocid="edit-location-input"
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
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
