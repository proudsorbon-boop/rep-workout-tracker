import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";

/* ================= TYPES ================= */

export type Set = {
  id: number;
  reps: number;
  weight: number;
};

export type Exercise = {
  id: number;
  name: string;
  workoutId: number;
  sets: Set[];
};

export type Workout = {
  id: number;
  name: string;
  date: string;
  exercises: Exercise[];
};

/* ================= STORAGE ================= */

const STORAGE_KEY = "workouts_data";

function loadWorkouts(): Workout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load workouts:", e);
    return [];
  }
}

function saveWorkouts(data: Workout[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Notify other components about the update
    window.dispatchEvent(new Event("storage_update"));
  } catch (e) {
    console.error("Failed to save workouts:", e);
  }
}

/* ================= HOOKS ================= */

export function useWorkouts() {
  const [data, setData] = useState<Workout[]>(loadWorkouts());

  useEffect(() => {
    const handleUpdate = () => {
      setData(loadWorkouts());
    };
    window.addEventListener("storage_update", handleUpdate);
    window.addEventListener("storage", handleUpdate); // Also listen to native storage event
    return () => {
      window.removeEventListener("storage_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    data,
    isLoading: false,
  };
}

export function useWorkout(id: number) {
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const all = loadWorkouts();
      setWorkout(all.find((w) => w.id === id) ?? null);
    };
    handleUpdate();
    window.addEventListener("storage_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("storage_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [id]);

  return {
    data: workout,
    isLoading: false,
  };
}

/* ================= MUTATIONS ================= */

export function useCreateWorkout() {
  return {
    mutate: (
      input: { name: string; date: Date },
      options?: { onSuccess?: (w: Workout) => void }
    ) => {
      const workouts = loadWorkouts();

      const workout: Workout = {
        id: Date.now(),
        name: input.name,
        date: input.date.toISOString(),
        exercises: [],
      };

      const updated = [workout, ...workouts];
      saveWorkouts(updated);

      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] }); // Invalidate both formats
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      options?.onSuccess?.(workout);
    },
    isPending: false,
  };
}

export function useDeleteWorkout() {
  return {
    mutate: ({ id }: { id: number }, options?: { onSuccess?: () => void }) => {
      const updated = loadWorkouts().filter((w) => w.id !== id);
      saveWorkouts(updated);
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      options?.onSuccess?.();
    },
  };
}

export function useCreateExercise() {
  return {
    mutate: (
      input: { workoutId: number; name: string },
      options?: { onSuccess?: (e: Exercise) => void }
    ) => {
      const workouts = loadWorkouts();
      let newExercise: Exercise | null = null;

      const updated = workouts.map((w) => {
        if (w.id === input.workoutId) {
          newExercise = {
            id: Date.now(),
            name: input.name,
            workoutId: w.id,
            sets: [],
          };
          return {
            ...w,
            exercises: [...w.exercises, newExercise],
          };
        }
        return w;
      });

      saveWorkouts(updated);
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      if (newExercise) options?.onSuccess?.(newExercise);
    },
    isPending: false,
  };
}

export function useDeleteExercise() {
  return {
    mutate: ({ id, workoutId }: { id: number; workoutId: number }) => {
      const workouts = loadWorkouts();

      const updated = workouts.map((w) => {
        if (w.id === workoutId) {
          return {
            ...w,
            exercises: w.exercises.filter((e) => e.id !== id),
          };
        }
        return w;
      });

      saveWorkouts(updated);
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  };
}

export function useCreateSet() {
  return {
    mutate: (
      input: {
        workoutId: number;
        exerciseId: number;
        reps: number;
        weight: number;
      },
      options?: { onSuccess?: () => void }
    ) => {
      const workouts = loadWorkouts();

      const updated = workouts.map((w) => {
        if (w.id === input.workoutId) {
          const updatedExercises = w.exercises.map((e) => {
            if (e.id === input.exerciseId) {
              return {
                ...e,
                sets: [
                  ...e.sets,
                  {
                    id: Date.now(),
                    reps: input.reps,
                    weight: input.weight,
                  },
                ],
              };
            }
            return e;
          });
          return { ...w, exercises: updatedExercises };
        }
        return w;
      });

      saveWorkouts(updated);
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      options?.onSuccess?.();
    },
    isPending: false,
  };
}

export function useDeleteSet() {
  return {
    mutate: ({ id, workoutId }: { id: number; workoutId: number }) => {
      const workouts = loadWorkouts();

      const updated = workouts.map((w) => {
        if (w.id === workoutId) {
          const updatedExercises = w.exercises.map((e) => ({
            ...e,
            sets: e.sets.filter((s) => s.id !== id),
          }));
          return { ...w, exercises: updatedExercises };
        }
        return w;
      });

      saveWorkouts(updated);
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  };
}
