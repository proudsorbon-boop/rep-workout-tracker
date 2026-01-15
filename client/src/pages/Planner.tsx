import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Flame, Dumbbell } from "lucide-react";

const plans = {
  beginner: {
    title: "Beginner",
    description: "Perfect for starting your fitness journey.",
    intensity: "Low",
    schedule: [
      { day: "Mon", focus: "Full Body Strength", duration: "30 min" },
      { day: "Tue", focus: "Rest", duration: "-" },
      { day: "Wed", focus: "Core & Mobility", duration: "20 min" },
      { day: "Thu", focus: "Rest", duration: "-" },
      { day: "Fri", focus: "Upper Body", duration: "30 min" },
      { day: "Sat", focus: "Active Recovery", duration: "15 min" },
      { day: "Sun", focus: "Rest", duration: "-" },
    ]
  },
  intermediate: {
    title: "Intermediate",
    description: "For those with some experience.",
    intensity: "Medium",
    schedule: [
      { day: "Mon", focus: "Upper Body Power", duration: "45 min" },
      { day: "Tue", focus: "Lower Body Strength", duration: "45 min" },
      { day: "Wed", focus: "Active Rest", duration: "20 min" },
      { day: "Thu", focus: "Push Day", duration: "45 min" },
      { day: "Fri", focus: "Pull Day", duration: "45 min" },
      { day: "Sat", focus: "Full Body", duration: "60 min" },
      { day: "Sun", focus: "Rest", duration: "-" },
    ]
  },
  advanced: {
    title: "Advanced",
    description: "Intense training for maximum results.",
    intensity: "High",
    schedule: [
      { day: "Mon", focus: "Chest & Triceps", duration: "60 min" },
      { day: "Tue", focus: "Back & Biceps", duration: "60 min" },
      { day: "Wed", focus: "Legs Power", duration: "75 min" },
      { day: "Thu", focus: "Shoulders & Core", duration: "60 min" },
      { day: "Fri", focus: "Full Body Burn", duration: "60 min" },
      { day: "Sat", focus: "Endurance", duration: "90 min" },
      { day: "Sun", focus: "Rest", duration: "-" },
    ]
  }
};

export default function Planner() {
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const currentPlan = plans[level];

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          Workout <span className="text-primary">Planner</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Choose a plan that fits your level.
        </p>
      </header>

      <Tabs value={level} onValueChange={(v) => setLevel(v as any)} className="mb-6">
        <TabsList className="grid grid-cols-3 bg-muted/50 p-1 h-12 rounded-xl">
          <TabsTrigger value="beginner" className="rounded-lg data-[state=active]:bg-background">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate" className="rounded-lg data-[state=active]:bg-background">Interm.</TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-background">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-6">
        <Card className="bg-card border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
             <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
               {currentPlan.intensity} Intensity
             </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{currentPlan.title}</CardTitle>
            <CardDescription className="text-base">{currentPlan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentPlan.schedule.map((day, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    day.focus === "Rest" ? "bg-muted/10 border-white/5 opacity-60" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold w-10">{day.day}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{day.focus}</span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{day.duration}</span>
                      </div>
                    </div>
                  </div>
                  {day.focus !== "Rest" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-white/5 p-4 flex flex-col gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-2xl font-black">12</span>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Day Streak</span>
          </Card>
          <Card className="bg-card border-white/5 p-4 flex flex-col gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-2xl font-black">42</span>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Workouts</span>
          </Card>
        </div>
      </div>
    </div>
  );
}
