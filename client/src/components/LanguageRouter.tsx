import { Route, Switch, useLocation, Redirect } from "wouter";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import SprintClarte from "@/pages/SprintClarte";
import AutomatisationIA from "@/pages/AutomatisationIA";
import Calculateur from "@/pages/Calculateur";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Testimonials from "@/pages/Testimonials";
import NewsletterAnalytics from "@/pages/NewsletterAnalytics";
import ImportSubscribers from "@/pages/ImportSubscribers";
import HotLeads from "@/pages/admin/HotLeads";
import LeadProfile from "@/pages/admin/LeadProfile";
import Segments from "@/pages/admin/Segments";
import Tasks from "@/pages/admin/Tasks";
import ABTesting from "@/pages/admin/ABTesting";
import SendCampaign from "@/pages/admin/SendCampaign";
import EmailTemplates from "@/pages/admin/EmailTemplates";
import EmailWorkflows from "@/pages/admin/EmailWorkflows";
import Analytics from "@/pages/admin/Analytics";
import Portfolio from "@/pages/Portfolio";
import LoiClarte from "@/pages/LoiClarte";
import VisualGraphic from "@/pages/VisualGraphic";
import NftGratitudeDashboard from "@/pages/NftGratitudeDashboard";
import NftGratitudeAdmin from "@/pages/admin/NftGratitudeAdmin";
import CorrecteurUniversel from "@/pages/CorrecteurUniversel";
import NftRoyaltiesDashboard from "@/pages/NftRoyaltiesDashboard";
import HonoficationDashboard from "@/pages/HonoficationDashboard";
import ApiKeysManagement from "@/pages/admin/ApiKeysManagement";
import HonoficationAdminDashboard from "@/pages/admin/HonoficationAdminDashboard";
import SeedNftSources from "@/pages/admin/SeedNftSources";
import NftGratitudePresentation from "@/pages/NftGratitudePresentation";
import MonitoringDashboard from "@/pages/admin/MonitoringDashboard";
import ContentAnalyzer from "@/pages/ContentAnalyzer";
import CopyGenerator from "@/pages/CopyGenerator";
import AvatarBuilder from "@/pages/AvatarBuilder";
import ConfigDashboard from "@/pages/ConfigDashboard";
import ScriptAnalyzer from "@/pages/ScriptAnalyzer";
import FrameworksLibrary from "@/pages/FrameworksLibrary";
import ChatIA from "@/pages/ChatIA";
import Templates from "@/pages/Templates";
import UserDashboard from "@/pages/UserDashboard";
import Exemples from "@/pages/Exemples";
import CopyEditor from "@/pages/CopyEditor";
import Guide from "@/pages/Guide";
import Pricing from "@/pages/Pricing";
import Subscription from "@/pages/Subscription";
import Premium from "@/pages/Premium";
import Referral from "@/pages/Referral";
import PromoCodesAdmin from "@/pages/admin/PromoCodesAdmin";
import SubscriptionAnalytics from "@/pages/admin/SubscriptionAnalytics";
import NotFound from "@/pages/NotFound";

/**
 * LanguageRouter - Gère le routing multilingue avec préfixes /fr/, /en/, /es/, /de/
 * 
 * Fonctionnalités :
 * - Détecte la langue depuis l'URL
 * - Redirige automatiquement vers la langue du navigateur si pas de préfixe
 * - Synchronise la langue avec le LanguageContext
 * - Toutes les routes sont accessibles avec le préfixe de langue
 */
export function LanguageRouter() {
  const [location, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();

  // Extraire la langue depuis l'URL
  const getLangFromPath = (path: string): Language | null => {
    const match = path.match(/^\/(fr|en|es|de)(\/|$)/);
    return match ? (match[1] as Language) : null;
  };

  useEffect(() => {
    const langFromUrl = getLangFromPath(location);
    
    if (langFromUrl) {
      // Si l'URL contient une langue, la définir comme langue active
      if (langFromUrl !== language) {
        setLanguage(langFromUrl);
      }
    } else if (location === '/') {
      // Redirection de la racine vers la langue active
      setLocation(`/${language}`, { replace: true });
    }
  }, [location, language, setLanguage, setLocation]);

  // Routes pour chaque langue
  const langPrefix = '/:lang(fr|en|es|de)';

  return (
    <Switch>
      {/* Redirection racine vers langue active */}
      <Route path="/">
        {() => {
          setLocation(`/${language}`, { replace: true });
          return null;
        }}
      </Route>

      {/* Routes multilingues */}
      <Route path={`${langPrefix}`} component={Home} />
      <Route path={`${langPrefix}/sprint`} component={SprintClarte} />
      <Route path={`${langPrefix}/dashboard/nft-gratitude`} component={NftGratitudeDashboard} />
      <Route path={`${langPrefix}/nft-gratitude`} component={NftGratitudePresentation} />
      <Route path={`${langPrefix}/correcteur`} component={CorrecteurUniversel} />
      <Route path={`${langPrefix}/dashboard/nft-royalties`} component={NftRoyaltiesDashboard} />
      <Route path={`${langPrefix}/dashboard/honofication`} component={HonoficationDashboard} />
      <Route path={`${langPrefix}/portfolio`} component={Portfolio} />
      <Route path={`${langPrefix}/automatisation-ia`} component={AutomatisationIA} />
      <Route path={`${langPrefix}/calculateur`} component={Calculateur} />
      <Route path={`${langPrefix}/about`} component={About} />
      <Route path={`${langPrefix}/contact`} component={Contact} />
      <Route path={`${langPrefix}/payment/success`} component={PaymentSuccess} />
      <Route path={`${langPrefix}/payment/cancel`} component={PaymentCancel} />
      <Route path={`${langPrefix}/dashboard`} component={Dashboard} />
      <Route path={`${langPrefix}/admin`} component={Admin} />
      <Route path={`${langPrefix}/admin/newsletter`} component={NewsletterAnalytics} />
      <Route path={`${langPrefix}/admin/import-subscribers`} component={ImportSubscribers} />
      <Route path={`${langPrefix}/admin/hot-leads`} component={HotLeads} />
      <Route path={`${langPrefix}/admin/lead-profile`} component={LeadProfile} />
      <Route path={`${langPrefix}/admin/segments`} component={Segments} />
      <Route path={`${langPrefix}/admin/tasks`} component={Tasks} />
      <Route path={`${langPrefix}/admin/ab-testing`} component={ABTesting} />
      <Route path={`${langPrefix}/admin/send-campaign`} component={SendCampaign} />
      <Route path={`${langPrefix}/admin/email-templates`} component={EmailTemplates} />
      <Route path={`${langPrefix}/admin/email-workflows`} component={EmailWorkflows} />
      <Route path={`${langPrefix}/admin/analytics`} component={Analytics} />
      <Route path={`${langPrefix}/admin/nft-gratitude`} component={NftGratitudeAdmin} />
      <Route path={`${langPrefix}/admin/api-keys`} component={ApiKeysManagement} />
      <Route path={`${langPrefix}/admin/honofication`} component={HonoficationAdminDashboard} />
      <Route path={`${langPrefix}/admin/seed-nft`} component={SeedNftSources} />
      <Route path={`${langPrefix}/admin/monitoring`} component={MonitoringDashboard} />
      <Route path={`${langPrefix}/content-analyzer`} component={ContentAnalyzer} />
      <Route path={`${langPrefix}/copy-generator`} component={CopyGenerator} />
      <Route path={`${langPrefix}/avatar-builder`} component={AvatarBuilder} />
      <Route path={`${langPrefix}/script-analyzer`} component={ScriptAnalyzer} />
      <Route path={`${langPrefix}/frameworks`} component={FrameworksLibrary} />
      <Route path={`${langPrefix}/chat-ia`} component={ChatIA} />
      <Route path={`${langPrefix}/templates`} component={Templates} />
      <Route path={`${langPrefix}/dashboard-user`} component={UserDashboard} />
      <Route path={`${langPrefix}/exemples`} component={Exemples} />
      <Route path={`${langPrefix}/editor`} component={CopyEditor} />
      <Route path={`${langPrefix}/guide`} component={Guide} />
      <Route path={`${langPrefix}/pricing`} component={Pricing} />
      <Route path={`${langPrefix}/subscription`} component={Subscription} />
      <Route path={`${langPrefix}/premium`} component={Premium} />
      <Route path={`${langPrefix}/referral`} component={Referral} />
      <Route path={`${langPrefix}/admin/promo-codes`} component={PromoCodesAdmin} />
      <Route path={`${langPrefix}/admin/subscription-analytics`} component={SubscriptionAnalytics} />
      <Route path={`${langPrefix}/config`} component={ConfigDashboard} />
      <Route path={`${langPrefix}/blog`} component={Blog} />
      <Route path={`${langPrefix}/blog/:slug`} component={BlogPost} />
      <Route path={`${langPrefix}/temoignages`} component={Testimonials} />
      <Route path={`${langPrefix}/404`} component={NotFound} />
      
      {/* Fallback 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}
