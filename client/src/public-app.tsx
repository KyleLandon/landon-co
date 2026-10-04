import { Router, Switch, Route } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { SupportWidget } from "@/components/support-widget";
import Analytics from "@/components/analytics";
import { PublicPageContext } from "./public-context";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import { InsightsIndex, InsightsPost, POSTS } from "@/pages/insights";
import { LocationPage } from "@/pages/location";
import { ServicePage } from "@/pages/service";
import { PrivacyPage, TermsPage } from "@/pages/legal";
import Brand from "@/pages/brand";
import Pricing from "@/pages/pricing";
import NotFound from "@/pages/not-found";
import { SAN_ANTONIO, CORPUS_CHRISTI, VICTORIA } from "@/lib/location-configs";
import { WEB_DESIGN, BRANDING, ECOMMERCE, AUTOMATION } from "@/lib/service-configs";

export const publicPaths = [
  "/", "/projects", "/pricing", "/brand", "/privacy", "/terms",
  "/services/web-design", "/services/branding", "/services/ecommerce", "/services/automation",
  "/web-design-san-antonio", "/web-design-corpus-christi", "/web-design-victoria-tx",
  "/insights", ...POSTS.map(post => `/insights/${post.slug}`),
];

export function PublicApp({ path, helmetContext = {}, queryClient = new QueryClient() }: {
  path?: string;
  helmetContext?: {};
  queryClient?: QueryClient;
}) {
  useEffect(() => {
    document.documentElement.removeAttribute("data-prerender-pending");
  }, []);
  return (
    <HelmetProvider context={helmetContext}>
      <PublicPageContext.Provider value={true}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Router ssrPath={path}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/projects" component={Projects} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/brand" component={Brand} />
                <Route path="/privacy" component={PrivacyPage} />
                <Route path="/terms" component={TermsPage} />
                <Route path="/services/web-design">{() => <ServicePage config={WEB_DESIGN} />}</Route>
                <Route path="/services/branding">{() => <ServicePage config={BRANDING} />}</Route>
                <Route path="/services/ecommerce">{() => <ServicePage config={ECOMMERCE} />}</Route>
                <Route path="/services/automation">{() => <ServicePage config={AUTOMATION} />}</Route>
                <Route path="/web-design-san-antonio">{() => <LocationPage config={SAN_ANTONIO} />}</Route>
                <Route path="/web-design-corpus-christi">{() => <LocationPage config={CORPUS_CHRISTI} />}</Route>
                <Route path="/web-design-victoria-tx">{() => <LocationPage config={VICTORIA} />}</Route>
                <Route path="/insights" component={InsightsIndex} />
                <Route path="/insights/:slug">{params => <InsightsPost slug={params.slug} />}</Route>
                <Route component={NotFound} />
              </Switch>
              <Analytics />
              <SupportWidget />
              <Toaster />
            </Router>
          </TooltipProvider>
        </QueryClientProvider>
      </PublicPageContext.Provider>
    </HelmetProvider>
  );
}