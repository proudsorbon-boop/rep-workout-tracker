import { LocalNotifications } from "@capacitor/local-notifications";
import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import WorkoutDetail from "@/pages/WorkoutDetail";
import Profile from "@/pages/Profile";
import Planner from "@/pages/Planner";
import Library from "@/pages/Library";
import Progress from "@/pages/Progress";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/not-found";

import Onboarding from "@/components/Onboarding";
import { Dumbbell, User, Layout, BarChart, Bell } from "lucide-react";
import { useEffect, useState } from "react";

/* -------------------- Navigation -------------------- */

function Navigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { href: "/", icon: Layout, label: "Workouts" },
    { href: "/planner", icon: Dumbbell, label: "Planner" },
    { href: "/progress", icon: BarChart, label: "Progress" },
    { href: "/notifications", icon: Bell, label: "Remind" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur border-t border-border px-4 pb-6 pt-2 z-50">
      <div className="max-w-md mx-auto flex justify-between">
        {navItems.map((item) => {
          const isActive = location === item.href;

          return (
            <button
              key={item.href}
              onClick={() => setLocation(item.href)}
              className={`flex flex-col items-center gap-1 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] uppercase font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* -------------------- Router -------------------- */

function Router() {
  const [location] = useLocation();

  return (
    // 🔥 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ
    <Switch key={location}>
      <Route path="/" component={Home} />
      <Route path="/workout/:id" component={WorkoutDetail} />
      <Route path="/planner" component={Planner} />
      <Route path="/progress" component={Progress} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/library" component={Library} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

/* -------------------- App -------------------- */

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // 🔔 уведомления
    LocalNotifications.requestPermissions();

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
          {showOnboarding ? (
            <Onboarding onComplete={completeOnboarding} />
          ) : (
            <>
              <Router />
              <Navigation />
            </>
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
