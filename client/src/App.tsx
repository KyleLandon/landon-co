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
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjects from "@/pages/admin/projects";
import AdminClients from "@/pages/admin/clients";
import AdminMessages from "@/pages/admin/messages";
import AdminSettings from "@/pages/admin/settings";
import ProjectDetail from "@/pages/project-detail";
import ProjectOverviewSimple from "@/pages/project-overview-simple";
import ProjectMessages from "@/pages/project-messages";
import ProjectTimeline from "@/pages/project-timeline";
import ProjectUpdates from "@/pages/project-updates";
import ProjectInvoices from "@/pages/project-invoices";
import ProjectFiles from "@/pages/project-files";
import ProjectSettings from "@/pages/project-settings";
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
