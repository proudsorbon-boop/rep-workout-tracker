import { useRoute, Link, useLocation } from "wouter";
import {
  useWorkout,
  useCreateExercise,
  useDeleteWorkout,
} from "@/hooks/use-workouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Plus,
  Calendar,
  Trash2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExerciseSchema } from "@shared/schema";
import { z } from "zod";
import { motion } from "framer-motion";

export default function WorkoutDetail() {
  const [, params] = useRoute("/workout/:id");
  const id = params ? Number(params.id) : 0;
  const [, setLocation] = useLocation();

  const { data: workout, isLoading } = useWorkout(id);
  const deleteWorkout = useDeleteWorkout();
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <h2 className="text-xl font-bold">Workout not found</h2>
        <Link href="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const exercises = workout.exercises ?? [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>

          <div className="flex flex-col items-center">
            <h1 className="font-display font-bold text-lg">
              {workout.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(workout.date), "MMM d, yyyy")}
            </div>
          </div>

          {/* DELETE WORKOUT */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete workout?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the workout and all exercises.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <AlertDialogCancel className="bg-white/5 border-white/10">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground"
                  onClick={() =>
                    deleteWorkout.mutate({ id: workout.id }, {
                      onSuccess: () => setLocation("/")
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ExerciseCard exercise={exercise} />
            </motion.div>
          ))
        ) : (
          /* ✅ CLICKABLE EMPTY STATE */
          <button
            onClick={() => setIsAddExerciseOpen(true)}
            className="w-full text-center py-12 px-4 rounded-2xl border-2 border-dashed border-muted
                       hover:border-primary/50 hover:bg-primary/5 transition"
          >
            <p className="text-muted-foreground mb-2">
              No exercises added yet
            </p>
            <p className="text-sm text-primary font-medium">
              Tap here to add your first exercise
            </p>
          </button>
        )}
      </main>

      {/* ADD EXERCISE FAB */}
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

/* ================= ADD EXERCISE DIALOG ================= */

function AddExerciseDialog({
  workoutId,
  open,
  onOpenChange,
}: {
  workoutId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = useCreateExercise();

  const form = useForm<z.infer<typeof insertExerciseSchema>>({
    resolver: zodResolver(insertExerciseSchema),
    defaultValues: {
      workoutId,
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof insertExerciseSchema>) => {
    console.log("Submitting exercise:", data);
    mutate(data, {
      onSuccess: () => {
        console.log("Exercise added successfully");
        form.reset({ workoutId, name: "" });
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/30 hover:scale-105 transition"
        >
          <Plus className="h-6 w-6 text-primary-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-white/10 p-0 overflow-hidden rounded-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <DialogTitle className="text-xl font-bold text-center flex-1">
              Add Exercise
            </DialogTitle>
            <DialogClose asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                {...form.register("name")}
                placeholder="Exercise name (Bench Press)"
                className="bg-white/5 border-2 border-primary/20 h-14 px-4 rounded-xl focus:border-primary transition-all text-lg"
                autoFocus
              />
            </div>
            
            {form.formState.errors.name && (
              <p className="text-sm text-destructive px-1">
                {form.formState.errors.name.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {isPending ? "Adding..." : "Add Exercise"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
