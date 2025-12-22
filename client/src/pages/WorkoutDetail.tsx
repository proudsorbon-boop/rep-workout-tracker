import { useRoute } from "wouter";
import { useWorkout, useCreateExercise } from "@/hooks/use-workouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Plus, Calendar } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExerciseSchema } from "@shared/schema";
import { z } from "zod";
import { motion } from "framer-motion";

export default function WorkoutDetail() {
  const [match, params] = useRoute("/workout/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: workout, isLoading, error } = useWorkout(id);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <h2 className="text-xl font-bold">Workout not found</h2>
        <Link href="/" className="text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-display font-bold text-lg">{workout.name}</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(workout.date), "MMM d, yyyy")}</span>
            </div>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="space-y-6">
          {workout.exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExerciseCard exercise={exercise} />
            </motion.div>
          ))}
        </div>

        {workout.exercises.length === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-muted">
            <p className="text-muted-foreground mb-4">No exercises added yet.</p>
            <p className="text-sm text-muted-foreground/60">Tap + to add your first exercise</p>
          </div>
        )}
      </main>

      {/* Floating Action Button for Adding Exercise */}
      <div className="fixed bottom-6 right-6 z-20">
        <AddExerciseDialog 
          workoutId={workout.id} 
          open={isAddExerciseOpen} 
          onOpenChange={setIsAddExerciseOpen} 
        />
      </div>
    </div>
  );
}

function AddExerciseDialog({ workoutId, open, onOpenChange }: { workoutId: number, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate, isPending } = useCreateExercise();
  
  const form = useForm<z.infer<typeof insertExerciseSchema>>({
    resolver: zodResolver(insertExerciseSchema),
    defaultValues: {
      workoutId,
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof insertExerciseSchema>) => {
    mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset({ workoutId, name: "" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
        >
          <Plus className="h-6 w-6 text-primary-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Add Exercise</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <Input
            {...form.register("name")}
            placeholder="Exercise name (e.g. Bench Press)"
            className="bg-background border-input focus:border-primary"
            autoFocus
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Exercise"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
