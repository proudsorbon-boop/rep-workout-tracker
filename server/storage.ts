import { db } from "./db";
import {
  workouts, exercises, sets,
  type Workout, type Exercise, type Set,
  type InsertWorkout, type InsertExercise, type InsertSet
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Workouts
  getWorkouts(): Promise<(Workout & { exercises: (Exercise & { sets: Set[] })[] })[]>;
  getWorkout(id: number): Promise<(Workout & { exercises: (Exercise & { sets: Set[] })[] }) | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  deleteWorkout(id: number): Promise<void>;

  // Exercises
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  deleteExercise(id: number): Promise<void>;

  // Sets
  createSet(set: InsertSet): Promise<Set>;
  deleteSet(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getWorkouts() {
    return await db.query.workouts.findMany({
      orderBy: [desc(workouts.date)],
      with: {
        exercises: {
          with: {
            sets: true
          }
        }
      }
    });
  }

  async getWorkout(id: number) {
    return await db.query.workouts.findFirst({
      where: eq(workouts.id, id),
      with: {
        exercises: {
          with: {
            sets: true
          }
        }
      }
    });
  }

  async createWorkout(workout: InsertWorkout) {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }

  async deleteWorkout(id: number) {
    await db.delete(workouts).where(eq(workouts.id, id));
  }

  async createExercise(exercise: InsertExercise) {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  async deleteExercise(id: number) {
    await db.delete(exercises).where(eq(exercises.id, id));
  }

  async createSet(set: InsertSet) {
    const [newSet] = await db.insert(sets).values(set).returning();
    return newSet;
  }

  async deleteSet(id: number) {
    await db.delete(sets).where(eq(sets.id, id));
  }
}

export const storage = new DatabaseStorage();
