import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/lib/session-context";
import { useAuth } from "@/hooks/useAuth";
import { AppNav } from "@/components/app-nav";
import { AIInsights } from "@/components/ai-insights";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth";
import IntakeWizard from "@/pages/intake-wizard";
import BeliefMapper from "@/pages/belief-mapper";
import TriangleShift from "@/pages/triangle-shift";
import SixFears from "@/pages/six-fears";
import FeelingsDial from "@/pages/feelings-dial";
import HillOverlay from "@/pages/hill-overlay";
import Daily10 from "@/pages/daily-10";
import ExportPage from "@/pages/export";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show landing page while loading or when not authenticated
  if (isLoading || !isAuthenticated) {
    return <Route path="/" component={AuthPage} />;
  }

  // Show app routes when authenticated
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/intake" component={IntakeWizard} />
      <Route path="/belief-mapper" component={BeliefMapper} />
      <Route path="/triangle-shift" component={TriangleShift} />
      <Route path="/six-fears" component={SixFears} />
      <Route path="/feelings-dial" component={FeelingsDial} />
      <Route path="/hill-overlay" component={HillOverlay} />
      <Route path="/daily-10" component={Daily10} />
      <Route path="/export" component={ExportPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <SessionProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <AppNav />
              <Router />
              <AIInsights />
            </div>
            <Toaster />
          </TooltipProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
