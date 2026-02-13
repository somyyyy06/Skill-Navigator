import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Loader2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing.tsx";
import Dashboard from "@/pages/dashboard.tsx";
import RoadmapsList from "@/pages/roadmaps-list.tsx";
import RoadmapDetail from "@/pages/roadmap-detail.tsx";
import LearningView from "@/pages/learning-view.tsx";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-card shadow-lg hover-elevate"
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth'); 
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return <Component {...rest} />;
}

import AuthPage from "@/pages/auth.tsx";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Switch>
        <Route path="/">
          {user ? <Dashboard /> : <LandingPage />}
        </Route>
        
        <Route path="/auth">
          <AuthPage />
        </Route>
        
        <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} />
        </Route>
        
        <Route path="/roadmaps">
          <ProtectedRoute component={RoadmapsList} />
        </Route>
        
        <Route path="/roadmaps/:id">
          <ProtectedRoute component={RoadmapDetail} />
        </Route>
        
        <Route path="/learning/:id">
          <ProtectedRoute component={LearningView} />
        </Route>
        
        <Route path="/learning">
          <ProtectedRoute component={Dashboard} /> 
        </Route>

        <Route component={NotFound} />
      </Switch>
      <ThemeToggle />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
