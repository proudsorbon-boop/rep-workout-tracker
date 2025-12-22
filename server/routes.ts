import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Workouts
  app.get(api.workouts.list.path, async (req, res) => {
    const workouts = await storage.getWorkouts();
    res.json(workouts);
  });

  app.get(api.workouts.get.path, async (req, res) => {
    const workout = await storage.getWorkout(Number(req.params.id));
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workout);
  });

  app.post(api.workouts.create.path, async (req, res) => {
    try {
      const input = api.workouts.create.input.parse(req.body);
      const workout = await storage.createWorkout(input);
      res.status(201).json(workout);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.workouts.delete.path, async (req, res) => {
    await storage.deleteWorkout(Number(req.params.id));
    res.sendStatus(204);
  });

  // Exercises
  app.post(api.exercises.create.path, async (req, res) => {
    try {
      const input = api.exercises.create.input.parse(req.body);
      const exercise = await storage.createExercise(input);
      res.status(201).json(exercise);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.exercises.delete.path, async (req, res) => {
    await storage.deleteExercise(Number(req.params.id));
    res.sendStatus(204);
  });

  // Sets
  app.post(api.sets.create.path, async (req, res) => {
    try {
      const input = api.sets.create.input.parse(req.body);
      const set = await storage.createSet(input);
      res.status(201).json(set);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.sets.delete.path, async (req, res) => {
    await storage.deleteSet(Number(req.params.id));
    res.sendStatus(204);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingWorkouts = await storage.getWorkouts();
  if (existingWorkouts.length === 0) {
    const workout = await storage.createWorkout({ name: "Full Body Starter" });
    
    const squat = await storage.createExercise({ 
      workoutId: workout.id, 
      name: "Barbell Squat" 
    });
    await storage.createSet({ exerciseId: squat.id, reps: 10, weight: 135 });
    await storage.createSet({ exerciseId: squat.id, reps: 8, weight: 145 });

    const bench = await storage.createExercise({ 
      workoutId: workout.id, 
      name: "Bench Press" 
    });
    await storage.createSet({ exerciseId: bench.id, reps: 10, weight: 95 });
  }
}
