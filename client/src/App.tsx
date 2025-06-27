import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/error-boundary";
import { SupportWidget } from "@/components/support-widget";
import { LoadingPage } from "@/components/ui/loading-spinner";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import Dashboard from "@/pages/client/dashboard/dashboard";
import AdminDashboard from "@/pages/admin/dashboard/dashboard";
import AdminProjects from "@/pages/admin/projects";
import AdminClients from "@/pages/admin/clients";
import AdminMessages from "@/pages/admin/messages";
import AdminSettings from "@/pages/admin/settings";
import AdminProjectDetail from "@/pages/admin/project/project-detail";
import AdminProjectMessages from "@/pages/admin/project/project-messages";
import AdminProjectTimeline from "@/pages/admin/project/project-timeline";
import AdminProjectFiles from "@/pages/admin/project/project-files";
import AdminProjectContracts from "@/pages/admin/project/project-contracts";
import AdminProjectInvoices from "@/pages/admin/project/project-invoices";
import ProjectDetail from "@/pages/client/project/project-detail";
import ProjectOverviewSimple from "@/pages/client/project/project-overview-simple";
import ProjectMessages from "@/pages/client/project/project-messages";
import ProjectTimeline from "@/pages/client/project/project-timeline";
import ProjectUpdates from "@/pages/client/project/project-updates";
import ProjectInvoices from "@/pages/client/project/project-invoices";
import ProjectFiles from "@/pages/client/project/project-files";
import ProjectSettings from "@/pages/client/project/project-settings";
import ProjectContracts from "@/pages/client/project/project-contracts";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />
      
      {/* Protected client routes */}
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={Dashboard} />
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
          <Route path="/admin" component={AdminDashboard} />
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <SupportWidget />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
