import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Dumbbell, Activity, Zap, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSetSchema } from "@shared/schema";
import {
  useCreateSet,
  useDeleteSet,
  useDeleteExercise,
} from "@/hooks/use-workouts";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

type ExerciseProps = {
  exercise: {
    id: number;
    name: string;
    workoutId: number;
    sets: {
      id: number;
      reps: number;
      weight: number;
    }[];
  };
};

const setSchema = insertSetSchema.extend({
  exerciseId: z.number(),
  weight: z.coerce.number().min(0),
  reps: z.coerce.number().min(1),
});

// Helper function to get exercise icon based on name
function getExerciseIcon(name: string) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("press") || lowerName.includes("bench") || lowerName.includes("push")) {
    return Dumbbell;
  }
  if (lowerName.includes("curl") || lowerName.includes("bicep") || lowerName.includes("tricep")) {
    return Target;
  }
  if (lowerName.includes("squat") || lowerName.includes("leg") || lowerName.includes("deadlift")) {
    return Activity;
  }
  if (lowerName.includes("pull") || lowerName.includes("row") || lowerName.includes("lat")) {
    return Zap;
  }
  
  return Dumbbell; // Default icon
}

export function ExerciseCard({ exercise }: ExerciseProps) {
  const deleteExercise = useDeleteExercise();
  const createSet = useCreateSet();
  const deleteSet = useDeleteSet();

  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: {
      exerciseId: exercise.id,
      weight: 0,
      reps: 1,
    },
  });

  const onAddSet = (data: z.infer<typeof setSchema>) => {
    createSet.mutate(
      { ...data, workoutId: exercise.workoutId },
      {
        onSuccess: () =>
          form.reset({
            exerciseId: exercise.id,
            weight: 0,
            reps: 1,
          }),
      }
    );
  };

  const ExerciseIcon = getExerciseIcon(exercise.name);

  return (
    <Card className="overflow-hidden">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <ExerciseIcon className="h-5 w-5 text-primary" />
          <h3 className="font-bold">{exercise.name}</h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            deleteExercise.mutate({
              id: exercise.id,
              workoutId: exercise.workoutId,
            })
          }
        >
          <Trash2 />
        </Button>
      </div>

      {/* SETS */}
      <div className="p-4 space-y-2">
        <AnimatePresence>
          {exercise.sets.map((set, i) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between items-center"
            >
              <div>
                #{i + 1} — {set.weight} × {set.reps}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  deleteSet.mutate({
                    id: set.id,
                    workoutId: exercise.workoutId,
                  })
                }
              >
                <Trash2 />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ADD SET */}
        <form
          onSubmit={form.handleSubmit(onAddSet)}
          className="space-y-3 pt-2"
        >
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Weight (kg)
              </label>
              <Input
                type="number"
                {...form.register("weight")}
                placeholder="0"
                className="h-12 text-lg font-bold"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Reps
              </label>
              <Input
                type="number"
                {...form.register("reps")}
                placeholder="1"
                className="h-12 text-lg font-bold"
              />
            </div>
            <Button 
              type="submit" 
              disabled={createSet.isPending}
              className="h-12 w-12 shrink-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
