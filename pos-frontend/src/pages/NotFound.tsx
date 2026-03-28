import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { Ghost, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-destructive/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-muted blur-2xl scale-150 opacity-60" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-muted ring-1 ring-border">
            <Ghost className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        {/* 404 text */}
        <h1 className="text-7xl font-bold text-foreground/10 mb-2 select-none">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground max-w-md mb-8">
          The page <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{location.pathname}</span> doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
