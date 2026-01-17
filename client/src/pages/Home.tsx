import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import {
  Dumbbell,
  CalendarDays,
  Quote,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  useWorkouts,
  useCreateWorkout,
  useDeleteWorkout,
} from "@/hooks/use-workouts";
import { queryClient } from "@/lib/queryClient";

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Fitness is not about being better than someone else.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your body can stand almost anything.",
  "Action is the foundational key to all success.",
  "Motivation is what gets you started. Habit is what keeps you going.",
];

const AUTO_NAMES = [
  "Full Body",
  "Chest",
  "Back",
  "Legs",
  "Arms",
  "Cardio",
  "Stretch",
];

export default function Home() {
  const { data: workouts = [], isLoading } = useWorkouts();
  const createWorkout = useCreateWorkout();
  const deleteWorkout = useDeleteWorkout();
  const [, setLocation] = useLocation();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  /* ---------- AUTO NAME ---------- */
  const getAutoWorkoutName = () => {
    const base = AUTO_NAMES[workouts.length % AUTO_NAMES.length];
    const count = workouts.filter((w) =>
      w.name.startsWith(base)
    ).length;

    return count > 0 ? `${base} #${count + 1}` : base;
  };

  /* ---------- CREATE ---------- */
  const handleAddWorkout = () => {
    if (createWorkout.isPending) return;

    const name = getAutoWorkoutName();

    createWorkout.mutate(
      {
        name,
        date: new Date(),
      },
      {
        onSuccess: (workout) => {
          queryClient.invalidateQueries({ queryKey: ["workouts"] });
          setLocation(`/workout/${workout.id}`);
        },
      }
    );
  };

  /* ---------- DELETE ---------- */
  const handleDeleteWorkout = (id: number) => {
    deleteWorkout.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["workouts"] });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* HEADER */}
      <header className="pt-12 pb-6 px-6 max-w-md mx-auto flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold">
            Your <span className="text-primary">Workouts</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your progress, one rep at a time.
          </p>
        </div>

        <Button
          size="icon"
          onClick={handleAddWorkout}
          disabled={createWorkout.isPending}
          className="h-12 w-12 rounded-full bg-primary shadow-lg shadow-primary/30 hover:scale-105 transition"
        >
          <Plus className="h-6 w-6 text-primary-foreground" />
        </Button>
      </header>

      <main className="px-4 max-w-md mx-auto">
        {/* QUOTE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 relative"
        >
          <Quote className="absolute opacity-5 right-4 top-4" />
          <p className="italic text-primary text-lg">
            "{quote}"
          </p>
        </motion.div>

        {/* STATES */}
        {isLoading && (
          <div className="text-center text-muted-foreground py-20">
            Loading workouts...
          </div>
        )}

        {!isLoading && workouts.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            No workouts yet
          </div>
        )}

        {/* LIST */}
        <AnimatePresence>
          {workouts.map((workout) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-2xl bg-card p-5 border border-transparent hover:border-primary/20 transition"
            >
              <div className="flex justify-between items-start">
                <Link href={`/workout/${workout.id}`}>
                  <a className="flex-1">
                    <h3 className="text-xl font-bold">
                      {workout.name}
                    </h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {format(
                          new Date(workout.date),
                          "MMM d, yyyy"
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell size={14} />
                        {workout.exercises.length} exercises
                      </span>
                    </div>
                  </a>
                </Link>

                {/* DELETE */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete workout?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove the workout.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3">
                      <AlertDialogCancel>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground"
                        onClick={() =>
                          handleDeleteWorkout(workout.id)
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
}
