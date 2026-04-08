import { useNavigate } from "@tanstack/react-router";
import { Building2, Check, Wheat } from "lucide-react";
import { motion } from "motion/react";

export function RoleSelectPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "farmer" as const,
      icon: Wheat,
      title: "I'm a Farmer",
      description:
        "List your crops, manage inventory, and connect with buyers across the country.",
      features: [
        "Add crop listings",
        "Accept/reject orders",
        "Chat with buyers",
        "Track earnings",
      ],
      accentClass:
        "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
      iconClass: "bg-emerald-100 text-emerald-600",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      id: "business" as const,
      icon: Building2,
      title: "I'm a Business",
      description:
        "Browse fresh produce, place bulk orders, and build relationships with farmers.",
      features: [
        "Browse all crops",
        "Place orders easily",
        "Track deliveries",
        "Chat with farmers",
      ],
      accentClass: "border-teal-200 hover:border-teal-400 hover:bg-teal-50",
      iconClass: "bg-teal-100 text-teal-600",
      btnClass: "bg-teal-600 hover:bg-teal-700 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50 flex flex-col">
      <header className="flex items-center gap-2 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Wheat className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-foreground font-display">
          AgriConnect
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold text-foreground font-display">
              How will you use AgriConnect?
            </h1>
            <p className="mt-2 text-muted-foreground">
              Choose your role to get started with the right features
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  type="button"
                  key={role.id}
                  className={`rounded-2xl border-2 bg-card p-6 cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md text-left w-full ${role.accentClass}`}
                  onClick={() =>
                    navigate({ to: "/register", search: { role: role.id } })
                  }
                  data-ocid={`role-${role.id}-card`}
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${role.iconClass}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground font-display">
                    {role.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {role.description}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {role.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`mt-6 w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${role.btnClass}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: "/register", search: { role: role.id } });
                    }}
                  >
                    Continue as {role.id === "farmer" ? "Farmer" : "Business"}
                  </button>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
