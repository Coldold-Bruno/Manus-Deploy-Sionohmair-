import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
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
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Testimonials from "./pages/Testimonials";
import NewsletterAnalytics from "./pages/NewsletterAnalytics";
import ImportSubscribers from "./pages/ImportSubscribers";
import HotLeads from "./pages/admin/HotLeads";
import LeadProfile from "./pages/admin/LeadProfile";
import Segments from "./pages/admin/Segments";
import Tasks from "./pages/admin/Tasks";
import ABTesting from "./pages/admin/ABTesting";
import SendCampaign from "./pages/admin/SendCampaign";
import EmailTemplates from "./pages/admin/EmailTemplates";
import EmailWorkflows from "./pages/admin/EmailWorkflows";
import Analytics from "./pages/admin/Analytics";
import Portfolio from "./pages/Portfolio";
import LoiClarte from "./pages/LoiClarte";
import Formation from "./pages/Formation";
import FormationModule from "./pages/FormationModule";
import CGVFormation from "./pages/CGVFormation";
import VisualGraphic from "./pages/VisualGraphic";
import ReservationCoaching from "./pages/ReservationCoaching";
import DashboardCoaching from "./pages/DashboardCoaching";
import NftGratitudeDashboard from "./pages/NftGratitudeDashboard";
import NftGratitudeAdmin from "./pages/admin/NftGratitudeAdmin";
import CorrecteurUniversel from "./pages/CorrecteurUniversel";
import NftRoyaltiesDashboard from "./pages/NftRoyaltiesDashboard";
import HonoficationDashboard from "./pages/HonoficationDashboard";
import ApiKeysManagement from "./pages/admin/ApiKeysManagement";
import HonoficationAdminDashboard from "./pages/admin/HonoficationAdminDashboard";
import SeedNftSources from "./pages/admin/SeedNftSources";
import NftGratitudePresentation from "./pages/NftGratitudePresentation";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/sprint"} component={SprintClarte} />
      <Route path={"/theoreme"} component={Theoreme} />
      <Route path={"/loi-clarte"} component={LoiClarte} />
      <Route path={"/formation"} component={Formation} />
      <Route path={"/formation/module/:moduleNumber"} component={FormationModule} />
      <Route path={"/cgv-formation"} component={CGVFormation} />
      <Route path={"/visual-graphic"} component={VisualGraphic} />
      <Route path={"/reservation-coaching"} component={ReservationCoaching} />
      <Route path={"/dashboard/coaching"} component={DashboardCoaching} />
      <Route path={"/dashboard/nft-gratitude"} component={NftGratitudeDashboard} />
      <Route path={"/nft-gratitude"} component={NftGratitudePresentation} />      <Route path={"/correcteur"} component={CorrecteurUniversel} />
      <Route path={"/dashboard/nft-royalties"} component={NftRoyaltiesDashboard} />
      <Route path={"/dashboard/honofication"} component={HonoficationDashboard} />
      <Route path={"/services"} component={Services} />
      <Route path={"/portfolio"} component={Portfolio} />
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
      <Route path={"/dashboard"} component={Dashboard} />      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/newsletter"} component={NewsletterAnalytics} />
      <Route path={"/admin/import-subscribers"} component={ImportSubscribers} />      <Route path={"/admin/hot-leads"} component={HotLeads} />
      <Route path={"/admin/lead-profile"} component={LeadProfile} />
      <Route path={"/admin/segments"} component={Segments} />
      <Route path={"/admin/tasks"} component={Tasks} />
      <Route path={"/admin/ab-testing"} component={ABTesting} />
      <Route path={"/admin/send-campaign"} component={SendCampaign} />
      <Route path={"/admin/email-templates"} component={EmailTemplates} />
      <Route path={"/admin/email-workflows"} component={EmailWorkflows} />
      <Route path={"/admin/analytics"} component={Analytics} />
      <Route path={"/admin/nft-gratitude"} component={NftGratitudeAdmin} />
      <Route path={"/admin/api-keys"} component={ApiKeysManagement} />
      <Route path={"/admin/honofication"} component={HonoficationAdminDashboard} />
      <Route path={"/admin/seed-nft"} component={SeedNftSources} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/temoignages"} component={Testimonials} />
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
          <ScrollToTop />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
