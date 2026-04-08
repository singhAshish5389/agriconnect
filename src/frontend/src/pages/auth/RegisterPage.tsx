import { useNavigate, useSearch } from "@tanstack/react-router";
import { Wheat } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../components/agri/Button";
import { Input } from "../../components/agri/Input";
import { Select } from "../../components/agri/Select";
import { useAuth } from "../../hooks/useBackend";
import { useAppStore } from "../../store/useAppStore";

interface RegisterForm {
  name: string;
  email: string;
  mobile: string;
  role: "farmer" | "business";
  location: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  location?: string;
}

function validateForm(form: RegisterForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Invalid email format";
  if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
  else if (!/^\+?[\d\s-]{10,}$/.test(form.mobile))
    errors.mobile = "Invalid mobile number";
  if (!form.role) errors.role = "Please select a role";
  if (!form.location.trim()) errors.location = "Location is required";
  return errors;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();
  const addToast = useAppStore((s) => s.addToast);

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    mobile: "",
    role: "farmer",
    location: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateForm({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof RegisterForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        mobile: true,
        role: true,
        location: true,
      });
      return;
    }

    try {
      await register(form);
      addToast(
        "Account created successfully! Welcome to AgriConnect.",
        "success",
      );
      const dest =
        form.role === "farmer" ? "/farmer/dashboard" : "/business/dashboard";
      navigate({ to: dest });
    } catch {
      addToast("Registration failed. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Wheat className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-foreground font-display">
          AgriConnect
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground font-display">
                Complete Your Profile
              </h1>
              <p className="mt-1 text-muted-foreground text-sm">
                Set up your AgriConnect account
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <Input
                label="Full Name"
                placeholder="John Farmer"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                error={touched.name ? errors.name : undefined}
                required
                data-ocid="register-name"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                error={touched.email ? errors.email : undefined}
                required
                data-ocid="register-email"
              />

              <Input
                label="Mobile Number"
                type="tel"
                placeholder="+1 555 000 0000"
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                onBlur={() => handleBlur("mobile")}
                error={touched.mobile ? errors.mobile : undefined}
                required
                data-ocid="register-mobile"
              />

              <Select
                label="I am a..."
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                onBlur={() => handleBlur("role")}
                error={touched.role ? errors.role : undefined}
                required
                options={[
                  { value: "farmer", label: "🌾 Farmer — I sell crops" },
                  { value: "business", label: "🏢 Business — I buy crops" },
                ]}
                data-ocid="register-role"
              />

              <Input
                label="Location"
                placeholder="California, USA"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                onBlur={() => handleBlur("location")}
                error={touched.location ? errors.location : undefined}
                required
                data-ocid="register-location"
              />

              <Button
                type="submit"
                className="mt-2 w-full h-11"
                isLoading={isRegistering}
                data-ocid="register-submit"
              >
                {isRegistering ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
