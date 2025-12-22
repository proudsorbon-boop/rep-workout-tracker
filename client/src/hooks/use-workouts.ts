import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Types derived from schema via routes
type Workout = z.infer<typeof api.workouts.get.responses[200]>;
type CreateWorkoutInput = z.infer<typeof api.workouts.create.input>;
type CreateExerciseInput = z.infer<typeof api.exercises.create.input>;
type CreateSetInput = z.infer<typeof api.sets.create.input>;

export function useWorkouts() {
  return useQuery({
    queryKey: [api.workouts.list.path],
    queryFn: async () => {
      const res = await fetch(api.workouts.list.path);
      if (!res.ok) throw new Error("Failed to fetch workouts");
      return api.workouts.list.responses[200].parse(await res.json());
    },
  });
}

export function useWorkout(id: number) {
  return useQuery({
    queryKey: [api.workouts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.workouts.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch workout");
      return api.workouts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWorkoutInput) => {
      const res = await fetch(api.workouts.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create workout");
      return api.workouts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.list.path] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.workouts.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete workout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.list.path] });
    },
  });
}

// Exercise Hooks
export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateExerciseInput) => {
      const res = await fetch(api.exercises.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add exercise");
      return api.exercises.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific workout to refresh the exercise list
      queryClient.invalidateQueries({ queryKey: [api.workouts.get.path, variables.workoutId] });
      // Also invalidate list just in case view depends on detailed data
      queryClient.invalidateQueries({ queryKey: [api.workouts.list.path] });
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, workoutId }: { id: number; workoutId: number }) => {
      const url = buildUrl(api.exercises.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete exercise");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.get.path, variables.workoutId] });
    },
  });
}

// Set Hooks
export function useCreateSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workoutId, ...data }: CreateSetInput & { workoutId: number }) => {
      const res = await fetch(api.sets.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add set");
      return api.sets.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.get.path, variables.workoutId] });
    },
  });
}

export function useDeleteSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, workoutId }: { id: number; workoutId: number }) => {
      const url = buildUrl(api.sets.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete set");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.get.path, variables.workoutId] });
    },
  });
}
