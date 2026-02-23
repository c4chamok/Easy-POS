import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "./store";
import Router from "./pages/Router";


const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Sonner />
      <Router />
      {/* <div className="flex items-center justify-center h-screen bg-accent">
        <h1 className="text-primary font-bold">Hello, World!</h1>
      </div> */}
    </TooltipProvider>
  </Provider>
);

export default App;
