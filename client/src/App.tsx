import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SprintClarte from "./pages/SprintClarte";
import Theoreme from "./pages/Theoreme";
import Services from "./pages/Services";
import Ressources from "./pages/Ressources";
import Niveau1 from "./pages/Niveau1";
import Niveau2 from "./pages/Niveau2";
import Niveau3 from "./pages/Niveau3";
import AutomatisationIA from "./pages/AutomatisationIA";
import Calculateur from "./pages/Calculateur";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/sprint"} component={SprintClarte} />
      <Route path={"/theoreme"} component={Theoreme} />
      <Route path={"/services"} component={Services} />
      <Route path={"/ressources"} component={Ressources} />
      <Route path={"/niveau1"} component={Niveau1} />
      <Route path={"/niveau2"} component={Niveau2} />
      <Route path={"/niveau3"} component={Niveau3} />
      <Route path={"/automatisation-ia"} component={AutomatisationIA} />
      <Route path={"/calculateur"} component={Calculateur} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/payment/success"} component={PaymentSuccess} />
      <Route path={"/payment/cancel"} component={PaymentCancel} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
