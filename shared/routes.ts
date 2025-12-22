import { z } from "zod";
import { insertWorkoutSchema, insertExerciseSchema, insertSetSchema, workouts, exercises, sets } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  workouts: {
    list: {
      method: "GET" as const,
      path: "/api/workouts",
      responses: {
        200: z.array(z.custom<typeof workouts.$inferSelect & { exercises: (typeof exercises.$inferSelect & { sets: typeof sets.$inferSelect[] })[] }>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/workouts/:id",
      responses: {
        200: z.custom<typeof workouts.$inferSelect & { exercises: (typeof exercises.$inferSelect & { sets: typeof sets.$inferSelect[] })[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/workouts",
      input: insertWorkoutSchema,
      responses: {
        201: z.custom<typeof workouts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/workouts/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  exercises: {
    create: {
      method: "POST" as const,
      path: "/api/exercises",
      input: insertExerciseSchema,
      responses: {
        201: z.custom<typeof exercises.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/exercises/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  sets: {
    create: {
      method: "POST" as const,
      path: "/api/sets",
      input: insertSetSchema,
      responses: {
        201: z.custom<typeof sets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/sets/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
