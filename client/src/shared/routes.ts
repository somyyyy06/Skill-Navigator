import { z } from 'zod';
import type { Roadmap, Step, RoadmapWithSteps, Enrollment, EnrollmentWithRoadmap, DailyStat } from './client-types';

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
  unauthorized: z.object({
    message: z.string(),
  }),
};

// Type schemas for validation (simplified for client)
const RoadmapSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  difficulty: z.string(),
  createdAt: z.date(),
}) as z.ZodType<Roadmap>;

const StepSchema = z.object({
  id: z.number(),
  roadmapId: z.number(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  order: z.number(),
  estimatedMinutes: z.number(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(['video', 'article', 'docs']),
  })),
}) as z.ZodType<Step>;

const EnrollmentSchema = z.object({
  id: z.number(),
  userId: z.string(),
  roadmapId: z.number(),
  status: z.string(),
  progress: z.number(),
  createdAt: z.date(),
  lastAccessedAt: z.date(),
}) as z.ZodType<Enrollment>;

export const api = {
  roadmaps: {
    list: {
      method: 'GET' as const,
      path: '/api/roadmaps',
      responses: {
        200: z.array(RoadmapSchema),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/roadmaps/:id',
      responses: {
        200: RoadmapSchema.extend({ steps: z.array(StepSchema) }).nullable(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/roadmaps',
      input: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      }),
      responses: {
        201: RoadmapSchema,
        400: errorSchemas.validation,
      },
    },
  },
  steps: {
    create: {
      method: 'POST' as const,
      path: '/api/roadmaps/:roadmapId/steps',
      input: z.object({
        title: z.string(),
        description: z.string(),
        content: z.string(),
        order: z.number(),
        estimatedMinutes: z.number().default(30),
        resources: z.array(z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(['video', 'article', 'docs']),
        })).default([]),
      }),
      responses: {
        201: StepSchema,
        400: errorSchemas.validation,
      },
    },
  },
  enrollments: {
    list: {
      method: 'GET' as const,
      path: '/api/enrollments',
      responses: {
        200: z.array(EnrollmentSchema.extend({ roadmap: RoadmapSchema })),
      },
    },
    enroll: {
      method: 'POST' as const,
      path: '/api/roadmaps/:roadmapId/enroll',
      responses: {
        201: EnrollmentSchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/enrollments/:id',
      responses: {
        200: EnrollmentSchema.extend({ roadmap: RoadmapSchema }),
        404: errorSchemas.notFound,
      },
    },
  },
  progress: {
    completeStep: {
      method: 'POST' as const,
      path: '/api/enrollments/:enrollmentId/steps/:stepId/complete',
      responses: {
        200: z.object({
          enrollment: EnrollmentSchema,
          newProgress: z.number(),
        }),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.object({
          streak: z.number(),
          totalSteps: z.number(),
          totalMinutes: z.number(),
          dailyActivity: z.array(z.object({
            id: z.number(),
            userId: z.string(),
            date: z.date(),
            minutesSpent: z.number(),
            stepsCompleted: z.number(),
          })),
        }),
      },
    },
  },
  assessments: {
    create: {
      method: 'POST' as const,
      path: '/api/assessments',
      input: z.object({
        enrollmentId: z.number().int().positive(),
        score: z.number().min(0).max(100),
      }),
      responses: {
        201: z.object({
          assessmentId: z.number(),
          skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
        }),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    generateCustomRoadmap: {
      method: 'POST' as const,
      path: '/api/assessments/generate-roadmap',
      input: z.object({
        roadmapTitle: z.string(),
        weakAreas: z.string().optional(),
        skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
      }),
      responses: {
        200: z.object({
          roadmap: z.object({
            title: z.string(),
            description: z.string(),
            steps: z.array(z.object({
              title: z.string(),
              description: z.string(),
            })),
          }),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  ml: {
    predictRoadmapRecommendation: {
      method: 'POST' as const,
      path: '/api/ml/predict/roadmap-recommendation',
      input: z.object({
        skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
        goal: z.string().min(1),
        year: z.number().int().nonnegative(),
        interest: z.string().min(1),
      }),
      responses: {
        200: z.object({
          recommendedRoadmapId: z.number(),
          confidence: z.number(),
        }),
        404: errorSchemas.notFound,
      },
    },
    predictSkillLevel: {
      method: 'POST' as const,
      path: '/api/ml/predict/skill-level',
      input: z.object({
        enrollmentId: z.number().int().positive(),
      }),
      responses: {
        200: z.object({
          skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
        }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    predictProgressSpeed: {
      method: 'POST' as const,
      path: '/api/ml/predict/progress-speed',
      input: z.object({
        enrollmentId: z.number().int().positive(),
      }),
      responses: {
        200: z.object({
          predictedDaysToCompletion: z.number(),
          learningPace: z.enum(["slow", "steady", "fast"]),
        }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    predictDropoutRisk: {
      method: 'POST' as const,
      path: '/api/ml/predict/dropout-risk',
      input: z.object({
        enrollmentId: z.number().int().positive(),
      }),
      responses: {
        200: z.object({
          dropoutRisk: z.boolean(),
          riskScore: z.number(),
        }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
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
