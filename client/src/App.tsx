import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import WorkoutDetail from "@/pages/WorkoutDetail";
import Profile from "@/pages/Profile";
import Planner from "@/pages/Planner";
import Library from "@/pages/Library";
import Progress from "@/pages/Progress";
import Onboarding from "@/components/Onboarding";
import { Link, useLocation } from "wouter";
import { Dumbbell, User, Layout, BookOpen, BarChart } from "lucide-react";
import { useState, useEffect } from "react";

function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Layout, label: "Workouts" },
    { href: "/library", icon: BookOpen, label: "Library" },
    { href: "/planner", icon: Dumbbell, label: "Planner" },
    { href: "/progress", icon: BarChart, label: "Progress" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-white/5 px-4 pb-8 pt-3 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
                <item.icon className={`h-6 w-6 ${isActive ? "fill-primary/20" : ""}`} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/workout/:id" component={WorkoutDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/planner" component={Planner} />
      <Route path="/library" component={Library} />
      <Route path="/progress" component={Progress} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const onboarded = localStorage.getItem("onboarded");
    setShowOnboarding(!onboarded);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("onboarded", "true");
    setShowOnboarding(false);
  };

  if (showOnboarding === null) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
          <Router />
          <Navigation />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
