import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Flame, Dumbbell } from "lucide-react";
import {
  useCreateWorkout,
  useCreateExercise,
} from "@/hooks/use-workouts";
import { useLocation } from "wouter";

/**
 * 🧠 Планы + упражнения
 */
const plans = {
  beginner: {
    title: "Beginner Plan",
    intensity: "Low",
    exercises: ["Push Ups", "Squats", "Plank"],
    schedule: [
      { day: "Mon", focus: "Full Body", duration: "30 min" },
      { day: "Wed", focus: "Core", duration: "20 min" },
      { day: "Fri", focus: "Upper Body", duration: "30 min" },
    ],
  },
  intermediate: {
    title: "Intermediate Plan",
    intensity: "Medium",
    exercises: [
      "Bench Press",
      "Pull Ups",
      "Deadlift",
      "Shoulder Press",
    ],
    schedule: [
      { day: "Mon", focus: "Upper Body", duration: "45 min" },
      { day: "Tue", focus: "Lower Body", duration: "45 min" },
      { day: "Thu", focus: "Push", duration: "45 min" },
      { day: "Fri", focus: "Pull", duration: "45 min" },
    ],
  },
  advanced: {
    title: "Advanced Plan",
    intensity: "High",
    exercises: [
      "Bench Press",
      "Deadlift",
      "Squats",
      "Pull Ups",
      "Shoulder Press",
    ],
    schedule: [
      { day: "Mon", focus: "Chest & Triceps", duration: "60 min" },
      { day: "Tue", focus: "Back & Biceps", duration: "60 min" },
      { day: "Wed", focus: "Legs", duration: "75 min" },
      { day: "Fri", focus: "Full Body", duration: "60 min" },
    ],
  },
};

export default function Planner() {
  const [level, setLevel] =
    useState<"beginner" | "intermediate" | "advanced">("beginner");

  const plan = plans[level];
  const createWorkout = useCreateWorkout();
  const createExercise = useCreateExercise();
  const [, setLocation] = useLocation();

  /**
   * 🚀 СОЗДАНИЕ ВОРКАУТА + УПРАЖНЕНИЙ
   */
  const startPlan = () => {
    createWorkout.mutate(
      {
        name: plan.title,
        date: new Date(),
      },
      {
        onSuccess: (workout) => {
          // ➕ автоматически добавляем упражнения
          plan.exercises.forEach((name) => {
            createExercise.mutate({
              workoutId: workout.id,
              name,
            });
          });

          // ➜ переходим в workout
          setLocation(`/workout/${workout.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-extrabold">
          Workout <span className="text-primary">Planner</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Choose a plan and start training instantly.
        </p>
      </header>

      <Tabs value={level} onValueChange={(v) => setLevel(v as any)}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>
                Auto-generated workout with exercises
              </CardDescription>
            </div>
            <Badge variant="outline">{plan.intensity}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {plan.schedule.map((day, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 rounded-lg bg-muted/30"
            >
              <div>
                <p className="font-bold">{day.day}</p>
                <p className="text-sm text-muted-foreground">
                  {day.focus}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {day.duration}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={startPlan}
        className="w-full h-12 text-lg font-bold"
      >
        <CheckCircle2 className="h-5 w-5 mr-2" />
        Start this plan
      </Button>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card className="p-4">
          <Flame className="h-6 w-6 text-orange-500" />
          <p className="text-2xl font-black">12</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </Card>
        <Card className="p-4">
          <Dumbbell className="h-6 w-6 text-primary" />
          <p className="text-2xl font-black">42</p>
          <p className="text-xs text-muted-foreground">Workouts</p>
        </Card>
      </div>
    </div>
  );
}
