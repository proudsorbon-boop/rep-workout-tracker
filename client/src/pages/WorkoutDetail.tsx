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
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import { RestTimer } from "@/components/RestTimer";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { format } from "date-fns";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const COMMON_EXERCISES = [
  "Bench Press", "Squats", "Deadlift", "Shoulder Press", 
  "Pull Ups", "Push Ups", "Plank", "Bicep Curls", 
  "Tricep Extensions", "Leg Press", "Lunges", "Rows",
  "Barbell Row", "Lat Pulldown", "Chest Fly", "Leg Curl",
  "Leg Extension", "Calf Raise", "Overhead Press", "Lateral Raise",
  "Front Raise", "Hammer Curl", "Cable Crossover", "Dips"
];

export default function WorkoutDetail() {
  const [, params] = useRoute("/workout/:id");
  const id = params ? Number(params.id) : 0;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  const handleFinishWorkout = () => {
    toast({
      title: "Workout saved!",
      description: "Great job! Your progress has been updated.",
    });
    setLocation("/progress");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>

            <div className="flex flex-col items-center">
              <h1 className="font-display font-bold text-lg text-primary">
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
              <AlertDialogContent className="bg-card border-white/10 max-w-[90vw] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete workout?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the workout and all exercises.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-3 mt-4">
                  <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground rounded-xl"
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
          <div className="flex justify-center">
            <WorkoutTimer />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        {exercises.length > 0 ? (
          <>
            <RestTimer defaultSeconds={60} />
            {exercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ExerciseCard exercise={exercise} />
              </motion.div>
            ))}
            
            <Button
              onClick={handleFinishWorkout}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-primary shadow-lg shadow-primary/20 mt-8"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Finish Workout
            </Button>
          </>
        ) : (
          /* ✅ CLICKABLE EMPTY STATE */
          <button
            onClick={() => setIsAddExerciseOpen(true)}
            className="w-full text-center py-16 px-4 rounded-3xl border-2 border-dashed border-white/5
                       bg-white/2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-1 text-lg">
              No exercises added yet
            </p>
            <p className="text-sm text-primary font-bold">
              Tap here to add your first exercise
            </p>
          </button>
        )}
      </main>

      {/* ✅ ADD EXERCISE FAB - ВСЕГДА ПОКАЗЫВАЕМ */}
      <div className="fixed bottom-24 right-6 z-20">
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
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof insertExerciseSchema>>({
    resolver: zodResolver(insertExerciseSchema),
    defaultValues: {
      workoutId,
      name: "",
    },
  });

  const nameValue = form.watch("name");
  
  // Load custom exercises from localStorage
  const getCustomExercises = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("custom_exercises");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveCustomExercise = (name: string) => {
    if (typeof window === "undefined") return;
    try {
      const custom = getCustomExercises();
      if (!custom.includes(name)) {
        localStorage.setItem("custom_exercises", JSON.stringify([...custom, name]));
      }
    } catch {
      // Ignore errors
    }
  };

  const filteredExercises = COMMON_EXERCISES.filter(ex =>
    ex.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const customExercises = getCustomExercises().filter(ex =>
    ex.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: z.infer<typeof insertExerciseSchema>) => {
    if (!data.name.trim()) return;
    
    // Save as custom exercise if not in common list
    if (!COMMON_EXERCISES.includes(data.name.trim())) {
      saveCustomExercise(data.name.trim());
    }
    
    mutate({ ...data, name: data.name.trim() }, {
      onSuccess: () => {
        form.reset({ workoutId, name: "" });
        onOpenChange(false);
        setShowQuickSelect(false);
        setSearchQuery("");
      },
    });
  };

  const selectExercise = (name: string) => {
    setShowQuickSelect(false);
    setSearchQuery("");
    setTimeout(() => {
      const data = { workoutId, name };
      onSubmit(data);
    }, 100);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const data = form.getValues();
    console.log("Button clicked, data:", data);
    onSubmit(data);
  };

  return (
    <Dialog open={open}       onOpenChange={(val) => {
      onOpenChange(val);
      if(!val) {
        setShowQuickSelect(false);
        setSearchQuery("");
        form.reset({ workoutId, name: "" });
      }
    }}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-16 w-16 rounded-full bg-primary shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
        >
          <Plus className="h-8 w-8 text-primary-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-white/10 p-0 overflow-visible rounded-[2.5rem] bottom-0 sm:bottom-auto mb-0 sm:mb-auto">
        <div className="p-8 pt-10">
          <div className="flex justify-between items-center mb-8">
            <DialogTitle className="text-2xl font-black text-center flex-1">
              {showQuickSelect ? "Choose Exercise" : "Add Exercise"}
            </DialogTitle>
          </div>

          <AnimatePresence mode="wait">
            {!showQuickSelect ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      {...form.register("name")}
                      placeholder="Exercise name (Bench Press)"
                      className="bg-white/5 border-2 border-white/10 h-16 px-6 rounded-2xl focus:border-primary transition-all text-xl font-bold"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddClick(e as any);
                        }
                      }}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full h-14 rounded-2xl border-2 border-dashed border-white/10 text-muted-foreground hover:text-primary hover:border-primary/50"
                    onClick={() => setShowQuickSelect(true)}
                  >
                    Or pick from list
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={handleAddClick}
                  disabled={isPending || !nameValue || !nameValue.trim()}
                  className="w-full h-16 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  style={{ pointerEvents: 'auto', zIndex: 9999 }}
                >
                  {isPending ? "Adding..." : "Add Exercise"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border-2 border-white/10 h-12 px-4 rounded-xl focus:border-primary"
                    autoFocus
                  />
                </div>
                
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredExercises.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                        Common Exercises
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {filteredExercises.map((ex) => (
                          <Button
                            key={ex}
                            type="button"
                            variant="outline"
                            className="justify-center h-14 bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/30 text-sm font-bold rounded-xl"
                            onClick={() => selectExercise(ex)}
                          >
                            {ex}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {customExercises.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                        Your Custom Exercises
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {customExercises.map((ex) => (
                          <Button
                            key={ex}
                            type="button"
                            variant="outline"
                            className="justify-center h-14 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-sm font-bold rounded-xl"
                            onClick={() => selectExercise(ex)}
                          >
                            {ex}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {filteredExercises.length === 0 && customExercises.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No exercises found</p>
                      <p className="text-sm mt-2">Try typing a custom exercise name</p>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full h-12 text-muted-foreground"
                  onClick={() => {
                    setShowQuickSelect(false);
                    setSearchQuery("");
                  }}
                >
                  Back to typing
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}