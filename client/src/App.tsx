import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/lib/session-context";
import { ProtectedRoute } from "@/components/protected-route";
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
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/intake">
        <ProtectedRoute>
          <IntakeWizard />
        </ProtectedRoute>
      </Route>
      <Route path="/belief-mapper">
        <ProtectedRoute>
          <BeliefMapper />
        </ProtectedRoute>
      </Route>
      <Route path="/triangle-shift">
        <ProtectedRoute>
          <TriangleShift />
        </ProtectedRoute>
      </Route>
      <Route path="/six-fears">
        <ProtectedRoute>
          <SixFears />
        </ProtectedRoute>
      </Route>
      <Route path="/feelings-dial">
        <ProtectedRoute>
          <FeelingsDial />
        </ProtectedRoute>
      </Route>
      <Route path="/hill-overlay">
        <ProtectedRoute>
          <HillOverlay />
        </ProtectedRoute>
      </Route>
      <Route path="/daily-10">
        <ProtectedRoute>
          <Daily10 />
        </ProtectedRoute>
      </Route>
      <Route path="/export">
        <ProtectedRoute>
          <ExportPage />
        </ProtectedRoute>
      </Route>
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
