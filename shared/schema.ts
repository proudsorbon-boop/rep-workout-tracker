import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(),
  name: text("name").notNull(),
});

export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull(),
  reps: integer("reps").notNull(),
  weight: integer("weight").notNull(),
});

export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [exercises.workoutId],
    references: [workouts.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));

export const insertWorkoutSchema = createInsertSchema(workouts).omit({ id: true, date: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertSetSchema = createInsertSchema(sets).omit({ id: true });

export type Workout = typeof workouts.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type Set = typeof sets.$inferSelect;
