import { Loader2 } from "lucide-react";

export default function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Background blur + dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Spinner */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
        <p className="text-white text-sm">Loading...</p>
      </div>
    </div>
  );
}