import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";


const App = () => (
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* <div className="flex items-center justify-center h-screen bg-accent">
        <h1 className="text-primary font-bold">Hello, World!</h1>
      </div> */}
    </TooltipProvider>
);

export default App;
