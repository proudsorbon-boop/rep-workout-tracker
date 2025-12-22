import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Dumbbell } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSetSchema } from "@shared/schema";
import { useCreateSet, useDeleteSet, useDeleteExercise } from "@/hooks/use-workouts";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

// Helper type for the deep nested structure
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
  weight: z.coerce.number().min(0, "Required"),
  reps: z.coerce.number().min(1, "Required"),
});

export function ExerciseCard({ exercise }: ExerciseProps) {
  const deleteExercise = useDeleteExercise();
  const createSet = useCreateSet();
  const deleteSet = useDeleteSet();

  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: {
      exerciseId: exercise.id,
      weight: 0,
      reps: 0,
    },
  });

  const onAddSet = (data: z.infer<typeof setSchema>) => {
    createSet.mutate(
      { ...data, workoutId: exercise.workoutId },
      { onSuccess: () => form.reset({ exerciseId: exercise.id, weight: data.weight, reps: data.reps }) } // Keep values for next set convenience
    );
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Dumbbell className="h-4 w-4" />
          </div>
          <h3 className="font-display font-bold text-lg">{exercise.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => deleteExercise.mutate({ id: exercise.id, workoutId: exercise.workoutId })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Sets List */}
        <div className="space-y-2">
          <div className="grid grid-cols-6 gap-2 text-xs uppercase tracking-wider text-muted-foreground font-medium px-2 mb-2">
            <div className="col-span-1">Set</div>
            <div className="col-span-2 text-center">kg/lbs</div>
            <div className="col-span-2 text-center">Reps</div>
            <div className="col-span-1"></div>
          </div>
          
          <AnimatePresence initial={false}>
            {exercise.sets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-6 gap-2 items-center bg-background/50 rounded-lg p-2 border border-white/5"
              >
                <div className="col-span-1 text-sm font-bold text-muted-foreground pl-2">
                  {index + 1}
                </div>
                <div className="col-span-2 text-center font-mono text-sm">
                  {set.weight}
                </div>
                <div className="col-span-2 text-center font-mono text-sm text-primary">
                  {set.reps}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground/50 hover:text-destructive hover:bg-transparent"
                    onClick={() => deleteSet.mutate({ id: set.id, workoutId: exercise.workoutId })}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {exercise.sets.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm italic">
              No sets recorded yet
            </div>
          )}
        </div>

        {/* Add Set Form */}
        <form onSubmit={form.handleSubmit(onAddSet)} className="grid grid-cols-6 gap-2 items-end pt-2 border-t border-white/5">
          <div className="col-span-1 pb-2 pl-2 text-xs font-medium text-primary uppercase">
            New
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="0"
              className="h-8 text-center font-mono bg-background/50 border-white/10 focus:border-primary px-1"
              {...form.register("weight")}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="0"
              className="h-8 text-center font-mono bg-background/50 border-white/10 focus:border-primary px-1"
              {...form.register("reps")}
            />
          </div>
          <div className="col-span-1 flex justify-end">
            <Button
              type="submit"
              size="icon"
              disabled={createSet.isPending}
              className="h-8 w-8 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
