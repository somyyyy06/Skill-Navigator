import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

// Import Auth Models
import { users, sessions } from "./models/auth";
// Import Chat Models
import { conversations, messages } from "./models/chat";

export { users, sessions, conversations, messages };

// === ROADMAP SYSTEM ===
export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'backend', 'frontend', 'ai', 'devops', 'mobile', 'cybersecurity', 'cloud', 'blockchain', 'fullstack'
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  createdAt: timestamp("created_at").defaultNow(),
});

export const steps = pgTable("steps", {
  id: serial("id").primaryKey(),
  roadmapId: integer("roadmap_id").notNull().references(() => roadmaps.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(), // Markdown content
  order: integer("order").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull().default(30),
  resources: jsonb("resources").$type<{ title: string; url: string; type: 'video' | 'article' | 'docs' }[]>().default([]),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Replit Auth user ID is string
  roadmapId: integer("roadmap_id").notNull().references(() => roadmaps.id),
  status: text("status").notNull().default("active"), // 'active', 'completed', 'dropped'
  progress: integer("progress").notNull().default(0), // Percentage 0-100
  createdAt: timestamp("created_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollments.id),
  stepId: integer("step_id").notNull().references(() => steps.id),
  status: text("status").notNull().default("completed"),
  attemptCount: integer("attempt_count").notNull().default(1), // How many times revisited
  timeSpentSeconds: integer("time_spent_seconds").notNull().default(0), // Actual time in seconds
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  date: date("date").notNull(), // YYYY-MM-DD
  stepsCompleted: integer("steps_completed").notNull().default(0),
  minutesSpent: integer("minutes_spent").notNull().default(0),
  streakCurrent: integer("streak_current").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true), // Active = did something today
});

// Session Logs - Detailed user interaction tracking for ML
export const sessionLogs = pgTable("session_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollments.id),
  stepId: integer("step_id").notNull().references(() => steps.id),
  sessionStarted: timestamp("session_started").defaultNow(),
  sessionEnded: timestamp("session_ended"),
  timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
  retryAttempt: integer("retry_attempt").notNull().default(1),
});

// User Metrics - Aggregated for ML models
export const userMetrics = pgTable("user_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollments.id),
  avgTimePerStep: integer("avg_time_per_step").default(0),
  retryFrequency: real("retry_frequency").default(0),
  completionSpeed: real("completion_speed").default(0),
  streakLength: integer("streak_length").default(0),
  doubtFrequency: integer("doubt_frequency").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Post-roadmap assessment results
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollments.id),
  score: integer("score").notNull(), // 0-100
  skillLevel: text("skill_level").notNull(), // 'beginner', 'intermediate', 'advanced'
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const roadmapsRelations = relations(roadmaps, ({ many }) => ({
  steps: many(steps),
  enrollments: many(enrollments),
}));

export const stepsRelations = relations(steps, ({ one }) => ({
  roadmap: one(roadmaps, {
    fields: [steps.roadmapId],
    references: [roadmaps.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  roadmap: one(roadmaps, {
    fields: [enrollments.roadmapId],
    references: [roadmaps.id],
  }),
  progress: many(progress),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [progress.enrollmentId],
    references: [enrollments.id],
  }),
  step: one(steps, {
    fields: [progress.stepId],
    references: [steps.id],
  }),
}));

// === ZOD SCHEMAS ===
export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({ id: true, createdAt: true });
export const insertStepSchema = createInsertSchema(steps).omit({ id: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, createdAt: true, lastAccessedAt: true, progress: true });
export const insertProgressSchema = createInsertSchema(progress).omit({ id: true, completedAt: true });
export const insertSessionLogSchema = createInsertSchema(sessionLogs).omit({ id: true, sessionStarted: true });
export const insertUserMetricSchema = createInsertSchema(userMetrics).omit({ id: true, lastUpdated: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true, skillLevel: true });

// === TYPES ===
export type Roadmap = typeof roadmaps.$inferSelect;
export type Step = typeof steps.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type UserProgress = typeof progress.$inferSelect;
export type DailyStat = typeof dailyStats.$inferSelect;
export type SessionLog = typeof sessionLogs.$inferSelect;
export type UserMetric = typeof userMetrics.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;

export type RoadmapWithSteps = Roadmap & { steps: Step[] };
export type EnrollmentWithRoadmap = Enrollment & { roadmap: Roadmap; progressDetails: UserProgress[] };

// Request Types
export type CreateRoadmapRequest = z.infer<typeof insertRoadmapSchema>;
export type CreateStepRequest = z.infer<typeof insertStepSchema>;
export type EnrollRequest = { roadmapId: number };
export type CompleteStepRequest = { stepId: number };
