import { useWorkouts, useDeleteWorkout } from "@/hooks/use-workouts";
import { CreateWorkoutDialog } from "@/components/CreateWorkoutDialog";
import { Link } from "wouter";
import { format } from "date-fns";
import { Dumbbell, ChevronRight, CalendarDays, Trash2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Fitness is not about being better than someone else. It's about being better than you were yesterday.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your body can stand almost anything. It’s your mind that you have to convince.",
  "Action is the foundational key to all success.",
  "Motivation is what gets you started. Habit is what keeps you going."
];

export default function Home() {
  const { data: workouts, isLoading, error } = useWorkouts();
  const deleteWorkout = useDeleteWorkout();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex flex-col gap-4 max-w-md mx-auto">
        <div className="h-10 w-32 bg-muted rounded animate-pulse mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <p className="text-destructive">Error loading workouts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="pt-12 pb-6 px-6 max-w-md mx-auto">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          Your <span className="text-primary">Workouts</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your progress, one rep at a time.
        </p>
      </header>

      <main className="px-4 max-w-md mx-auto">
        {/* Motivation Block */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden group"
        >
          <Quote className="absolute -top-2 -right-2 h-16 w-16 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          <p className="italic text-primary font-medium text-lg leading-relaxed relative z-10">
            "{quote}"
          </p>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence>
            {workouts?.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="group relative overflow-hidden rounded-2xl bg-card border border-white/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-5 flex items-center justify-between relative z-0">
                    <Link href={`/workout/${workout.id}`} className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between pr-4">
                        <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                          {workout.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{format(new Date(workout.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Dumbbell className="h-3.5 w-3.5" />
                          <span>{workout.exercises.length} exercises</span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation
                          if (confirm("Delete this workout?")) {
                            deleteWorkout.mutate(workout.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link href={`/workout/${workout.id}`} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {workouts?.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 px-4"
            >
              <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No workouts yet</h3>
              <p className="text-muted-foreground">Start your journey by adding a new workout.</p>
            </motion.div>
          )}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-20">
        <CreateWorkoutDialog />
      </div>
    </div>
  );
}
