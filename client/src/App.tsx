import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/Dashboard";
import StudentsPage from "@/pages/Students";
import ParentsPage from "@/pages/Parents";
import TeachersPage from "@/pages/Teachers";
import FinancePage from "@/pages/Finance";
import SettingsPage from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/students" component={StudentsPage} />
      <Route path="/parents" component={ParentsPage} />
      <Route path="/teachers" component={TeachersPage} />
      <Route path="/finance" component={FinancePage} />
      <Route path="/settings" component={SettingsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
