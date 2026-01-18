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
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveWorkouts(data: Workout[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Notify other components about the update
  window.dispatchEvent(new Event("storage_update"));
}

/* ================= HOOKS ================= */

export function useWorkouts() {
  const [data, setData] = useState<Workout[]>(loadWorkouts());

  useEffect(() => {
    const handleUpdate = () => {
      setData(loadWorkouts());
    };
    window.addEventListener("storage_update", handleUpdate);
    return () => window.removeEventListener("storage_update", handleUpdate);
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
    return () => window.removeEventListener("storage_update", handleUpdate);
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

      workouts.forEach((w) => {
        if (w.id === input.workoutId) {
          newExercise = {
            id: Date.now(),
            name: input.name,
            workoutId: w.id,
            sets: [],
          };
          w.exercises.push(newExercise);
        }
      });

      saveWorkouts(workouts);
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

      workouts.forEach((w) => {
        if (w.id === workoutId) {
          w.exercises = w.exercises.filter((e) => e.id !== id);
        }
      });

      saveWorkouts(workouts);
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

      workouts.forEach((w) => {
        if (w.id === input.workoutId) {
          w.exercises.forEach((e) => {
            if (e.id === input.exerciseId) {
              e.sets.push({
                id: Date.now(),
                reps: input.reps,
                weight: input.weight,
              });
            }
          });
        }
      });

      saveWorkouts(workouts);
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

      workouts.forEach((w) => {
        if (w.id === workoutId) {
          w.exercises.forEach((e) => {
            e.sets = e.sets.filter((s) => s.id !== id);
          });
        }
      });

      saveWorkouts(workouts);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  };
}
