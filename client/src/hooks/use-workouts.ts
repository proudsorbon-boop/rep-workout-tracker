import { useEffect, useState } from "react";

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
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveWorkouts(data: Workout[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ================= HOOKS ================= */

export function useWorkouts() {
  const [data, setData] = useState<Workout[]>([]);

  useEffect(() => {
    setData(loadWorkouts());
  }, []);

  return {
    data,
    setData,
    isLoading: false,
  };
}

export function useWorkout(id: number) {
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const all = loadWorkouts();
    setWorkout(all.find((w) => w.id === id) ?? null);
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

      options?.onSuccess?.(workout);
    },
    isPending: false,
  };
}

export function useDeleteWorkout() {
  return {
    mutate: ({ id }: { id: number }) => {
      const updated = loadWorkouts().filter((w) => w.id !== id);
      saveWorkouts(updated);
      window.dispatchEvent(new Event("storage"));
    },
  };
}

export function useCreateExercise() {
  return {
    mutate: (
      input: { workoutId: number; name: string },
      options?: { onSuccess?: () => void }
    ) => {
      const workouts = loadWorkouts();

      workouts.forEach((w) => {
        if (w.id === input.workoutId) {
          w.exercises.push({
            id: Date.now(),
            name: input.name,
            workoutId: w.id,
            sets: [],
          });
        }
      });

      saveWorkouts(workouts);
      options?.onSuccess?.();
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
    },
  };
}
