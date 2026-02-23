import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 15));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sidebar-background">
      {/* Animated logo */}
      <div className="relative mb-8 animate-fade-in">
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--kpi-gradient-end))] shadow-lg">
          <ShoppingBag className="h-10 w-10 text-primary-foreground" />
        </div>
      </div>

      {/* Brand */}
      <h1 className="mb-1 text-2xl font-bold text-sidebar-foreground animate-fade-in">
        ShopPOS
      </h1>
      <p className="mb-10 text-sm text-sidebar-muted animate-fade-in">
        Point of Sale System
      </p>

      {/* Progress bar */}
      <div className="w-56 animate-fade-in">
        <div className="h-1 w-full overflow-hidden rounded-full bg-sidebar-accent">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--kpi-gradient-end))] transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="mt-3 text-center text-xs text-sidebar-muted">
          Loading&hellip;
        </p>
      </div>

      {/* Decorative dots */}
      <div className="absolute bottom-10 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}