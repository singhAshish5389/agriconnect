import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Leaf, ShieldCheck, Wheat } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Button } from "../../components/agri/Button";
import { useAppStore } from "../../store/useAppStore";

export function LoginPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const user = useAppStore((s) => s.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && user) {
      if (user.role === "farmer") navigate({ to: "/farmer/dashboard" });
      else if (user.role === "business")
        navigate({ to: "/business/dashboard" });
      else navigate({ to: "/admin/dashboard" });
    } else if (identity && !user) {
      navigate({ to: "/register", search: { role: "farmer" } });
    }
  }, [identity, user, navigate]);

  const features = [
    {
      icon: Wheat,
      label: "Sell Fresh Crops",
      desc: "Connect with buyers directly",
    },
    {
      icon: Leaf,
      label: "Buy Agricultural Products",
      desc: "Source quality produce easily",
    },
    {
      icon: ShieldCheck,
      label: "Secure & Transparent",
      desc: "Blockchain-backed transactions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        {/* Add logo here */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Wheat className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground font-display">
            AgriConnect
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Features */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-foreground font-display leading-tight">
              The Agricultural{" "}
              <span className="text-emerald-600">Marketplace</span> for Everyone
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Connect farmers with businesses. Transparent pricing, direct
              deals, and quality produce — all in one platform.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {feat.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Login card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="rounded-2xl border border-border bg-card p-8 shadow-lg"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <Wheat className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-display">
                Welcome Back
              </h2>
              <p className="mt-2 text-muted-foreground">
                Sign in securely with Internet Identity
              </p>
            </div>

            <div className="mt-8">
              <Button
                className="w-full h-12 text-base"
                isLoading={isLoggingIn}
                onClick={() => login()}
                data-ocid="login-btn"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                {isLoggingIn
                  ? "Connecting..."
                  : "Sign in with Internet Identity"}
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                New to AgriConnect?{" "}
                <span className="text-primary font-medium">
                  You'll be guided through setup after login.
                </span>
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Your identity is secured by the Internet Computer protocol.
                No passwords stored.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AgriConnect. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
