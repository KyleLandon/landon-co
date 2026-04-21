import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/error-boundary";
import { SupportWidget } from "@/components/support-widget";
import Analytics from "@/components/analytics";
import { LoadingPage } from "@/components/ui/loading-spinner";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Public marketing routes (lazy)
const Projects = lazy(() => import("@/pages/projects"));
const InsightsIndex = lazy(() =>
  import("@/pages/insights").then((m) => ({ default: m.InsightsIndex })),
);
const InsightsPost = lazy(() =>
  import("@/pages/insights").then((m) => ({ default: m.InsightsPost })),
);
const LocationPage = lazy(() =>
  import("@/pages/location").then((m) => ({ default: m.LocationPage })),
);
const ServicePage = lazy(() =>
  import("@/pages/service").then((m) => ({ default: m.ServicePage })),
);
const PrivacyPage = lazy(() =>
  import("@/pages/legal").then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() =>
  import("@/pages/legal").then((m) => ({ default: m.TermsPage })),
);

// Authenticated routes (lazy)
const Dashboard = lazy(() => import("@/pages/client/dashboard/dashboard"));
const UnifiedDashboard = lazy(() => import("@/pages/client/unified-dashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard/dashboard"));
const UnifiedAdminDashboard = lazy(() => import("@/pages/admin/unified-dashboard"));
const AdminProjects = lazy(() => import("@/pages/admin/projects"));
const AdminClients = lazy(() => import("@/pages/admin/clients"));
const AdminMessages = lazy(() => import("@/pages/admin/messages"));
const AdminSettings = lazy(() => import("@/pages/admin/settings"));
const AdminProjectDetail = lazy(() => import("@/pages/admin/project/project-detail"));
const AdminProjectMessages = lazy(() => import("@/pages/admin/project/project-messages-apple"));
const AdminProjectTimeline = lazy(() => import("@/pages/admin/project/project-timeline"));
const AdminProjectFiles = lazy(() => import("@/pages/admin/project/project-files"));
const AdminProjectContracts = lazy(() => import("@/pages/admin/project/project-contracts"));
const AdminProjectInvoices = lazy(() => import("@/pages/admin/project/project-invoices"));
const ProjectDetail = lazy(() => import("@/pages/client/project/project-detail"));
const ProjectOverviewSimple = lazy(() => import("@/pages/client/project/project-overview-simple"));
const ProjectMessages = lazy(() => import("@/pages/client/project/project-messages"));
const ProjectTimeline = lazy(() => import("@/pages/client/project/project-timeline"));
const ProjectUpdates = lazy(() => import("@/pages/client/project/project-updates"));
const ProjectInvoices = lazy(() => import("@/pages/client/project/project-invoices"));
const ProjectFiles = lazy(() => import("@/pages/client/project/project-files"));
const ProjectSettings = lazy(() => import("@/pages/client/project/project-settings"));
const ProjectContracts = lazy(() => import("@/pages/client/project/project-contracts"));

import {
  SAN_ANTONIO,
  CORPUS_CHRISTI,
  VICTORIA,
} from "@/lib/location-configs";
import {
  WEB_DESIGN,
  BRANDING,
  ECOMMERCE,
  AUTOMATION,
} from "@/lib/service-configs";

function Router() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />

      {/* Service pages */}
      <Route path="/services/web-design">{() => <ServicePage config={WEB_DESIGN} />}</Route>
      <Route path="/services/branding">{() => <ServicePage config={BRANDING} />}</Route>
      <Route path="/services/ecommerce">{() => <ServicePage config={ECOMMERCE} />}</Route>
      <Route path="/services/automation">{() => <ServicePage config={AUTOMATION} />}</Route>

      {/* Location pages */}
      <Route path="/web-design-san-antonio">{() => <LocationPage config={SAN_ANTONIO} />}</Route>
      <Route path="/web-design-corpus-christi">{() => <LocationPage config={CORPUS_CHRISTI} />}</Route>
      <Route path="/web-design-victoria-tx">{() => <LocationPage config={VICTORIA} />}</Route>

      {/* Insights */}
      <Route path="/insights" component={InsightsIndex} />
      <Route path="/insights/:slug">
        {(params) => <InsightsPost slug={params.slug} />}
      </Route>

      {/* Legal */}
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      
      {/* Protected client routes */}
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={UnifiedDashboard} />
          <Route path="/dashboard/legacy" component={Dashboard} />
          <Route path="/project/:id" component={ProjectDetail} />
          <Route path="/projects/:id" component={ProjectOverviewSimple} />
          <Route path="/projects/:id/messages" component={ProjectMessages} />
          <Route path="/projects/:id/timeline" component={ProjectTimeline} />
          <Route path="/projects/:id/updates" component={ProjectUpdates} />
          <Route path="/projects/:id/invoices" component={ProjectInvoices} />
          <Route path="/projects/:id/files" component={ProjectFiles} />
          <Route path="/projects/:id/settings" component={ProjectSettings} />
          <Route path="/projects/:id/contracts" component={ProjectContracts} />
        </>
      )}
      
      {/* Admin-only routes */}
      {isAuthenticated && isAdmin && (
        <>
          <Route path="/admin" component={UnifiedAdminDashboard} />
          <Route path="/admin/legacy" component={AdminDashboard} />
          <Route path="/admin/projects" component={AdminProjects} />
          <Route path="/admin/clients" component={AdminClients} />
          <Route path="/admin/messages" component={AdminMessages} />
          <Route path="/admin/settings" component={AdminSettings} />
          <Route path="/admin/projects/:id" component={AdminProjectDetail} />
          <Route path="/admin/projects/:id/messages" component={AdminProjectMessages} />
          <Route path="/admin/projects/:id/timeline" component={AdminProjectTimeline} />
          <Route path="/admin/projects/:id/files" component={AdminProjectFiles} />
          <Route path="/admin/projects/:id/contracts" component={AdminProjectContracts} />
          <Route path="/admin/projects/:id/invoices" component={AdminProjectInvoices} />
        </>
      )}

      {/* Redirect unauthenticated users trying to access protected routes */}
      {!isAuthenticated && (
        <>
          <Route path="/dashboard">
            {() => {
              window.location.href = "/api/login";
              return <LoadingPage message="Redirecting to login..." />;
            }}
          </Route>
          <Route path="/admin">
            {() => {
              window.location.href = "/api/login";
              return <LoadingPage message="Redirecting to login..." />;
            }}
          </Route>
          <Route path="/projects/:id">
            {() => {
              window.location.href = "/api/login";
              return <LoadingPage message="Redirecting to login..." />;
            }}
          </Route>
          <Route path="/project/:id">
            {() => {
              window.location.href = "/api/login";
              return <LoadingPage message="Redirecting to login..." />;
            }}
          </Route>
          {/* Catch-all for other routes - check if they're protected */}
          <Route>
            {() => {
              const path = window.location.pathname;
              // Check if this looks like a protected route
              if (path.includes('admin') || path.includes('dashboard') || path.includes('project')) {
                window.location.href = "/api/login";
                return <LoadingPage message="Redirecting to login..." />;
              }
              // Otherwise show 404
              return <NotFound />;
            }}
          </Route>
        </>
      )}
      
      {/* Authenticated users get 404 for unknown routes */}
      {isAuthenticated && <Route component={NotFound} />}
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Suspense fallback={<LoadingPage message="Loading..." />}>
            <Router />
          </Suspense>
          <Analytics />
          <SupportWidget />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
