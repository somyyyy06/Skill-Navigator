import { db } from "./db";
import { 
  roadmaps, steps, enrollments, progress, dailyStats, sessionLogs, userMetrics, assessments,
  type Roadmap, type Step, type Enrollment, type UserProgress, type DailyStat, type SessionLog, type UserMetric, type Assessment,
  type CreateRoadmapRequest, type CreateStepRequest, type EnrollRequest
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Roadmaps
  getRoadmaps(): Promise<Roadmap[]>;
  getRoadmap(id: number): Promise<Roadmap | undefined>;
  getRoadmapSteps(roadmapId: number): Promise<Step[]>;
  createRoadmap(roadmap: CreateRoadmapRequest): Promise<Roadmap>;
  createStep(step: CreateStepRequest): Promise<Step>;

  // Enrollments
  getEnrollments(userId: string): Promise<(Enrollment & { roadmap: Roadmap })[]>;
  getEnrollment(id: number): Promise<(Enrollment & { roadmap: Roadmap }) | undefined>;
  getEnrollmentByRoadmap(userId: string, roadmapId: number): Promise<Enrollment | undefined>;
  createEnrollment(userId: string, roadmapId: number): Promise<Enrollment>;
  
  // Progress
  getEnrollmentProgress(enrollmentId: number): Promise<UserProgress[]>;
  completeStep(enrollmentId: number, stepId: number): Promise<void>;
  updateEnrollmentProgress(enrollmentId: number, progressPercent: number): Promise<void>;

  // Stats
  getUserStats(userId: string): Promise<{ totalSteps: number; totalMinutes: number; streak: number }>;
  getDailyActivity(userId: string): Promise<DailyStat[]>;
  recordActivity(userId: string, minutes: number): Promise<void>;
  calculateAndUpdateStreak(userId: string): Promise<number>;
  
  // Session Logging & Metrics
  logSession(userId: string, enrollmentId: number, stepId: number, timeSeconds: number, retryAttempt: number): Promise<SessionLog>;
  recordStepAttempt(enrollmentId: number, stepId: number, timeSeconds: number, attemptNumber: number): Promise<void>;
  updateUserMetrics(userId: string, enrollmentId: number): Promise<void>;
  getUserMetrics(userId: string, enrollmentId: number): Promise<UserMetric | undefined>;
  getLatestDailyStat(userId: string): Promise<DailyStat | undefined>;
  createAssessment(userId: string, enrollmentId: number, score: number, skillLevel: string): Promise<Assessment>;
  getLatestAssessment(userId: string, enrollmentId: number): Promise<Assessment | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Roadmaps
  async getRoadmaps(): Promise<Roadmap[]> {
    return await db.select().from(roadmaps);
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
    return roadmap;
  }

  async getRoadmapSteps(roadmapId: number): Promise<Step[]> {
    return await db.select().from(steps).where(eq(steps.roadmapId, roadmapId)).orderBy(steps.order);
  }

  async createRoadmap(roadmap: CreateRoadmapRequest): Promise<Roadmap> {
    const [newRoadmap] = await db.insert(roadmaps).values(roadmap).returning();
    return newRoadmap;
  }

  async createStep(step: CreateStepRequest): Promise<Step> {
    const [newStep] = await db.insert(steps).values(step).returning();
    return newStep;
  }

  // Enrollments
  async getEnrollments(userId: string): Promise<(Enrollment & { roadmap: Roadmap })[]> {
    const result = await db.select()
      .from(enrollments)
      .innerJoin(roadmaps, eq(enrollments.roadmapId, roadmaps.id))
      .where(eq(enrollments.userId, userId));
    
    return result.map(r => ({ ...r.enrollments, roadmap: r.roadmaps }));
  }

  async getEnrollment(id: number): Promise<(Enrollment & { roadmap: Roadmap }) | undefined> {
    const [result] = await db.select()
      .from(enrollments)
      .innerJoin(roadmaps, eq(enrollments.roadmapId, roadmaps.id))
      .where(eq(enrollments.id, id));
    
    if (!result) return undefined;
    return { ...result.enrollments, roadmap: result.roadmaps };
  }

  async getEnrollmentByRoadmap(userId: string, roadmapId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.roadmapId, roadmapId)));
    return enrollment;
  }

  async createEnrollment(userId: string, roadmapId: number): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments)
      .values({ userId, roadmapId })
      .returning();
    return enrollment;
  }

  // Progress
  async getEnrollmentProgress(enrollmentId: number): Promise<UserProgress[]> {
    try {
      return await db.select().from(progress).where(eq(progress.enrollmentId, enrollmentId));
    } catch (error) {
      // Fallback if new columns don't exist yet
      console.warn("Error fetching progress with new columns, using fallback:", error);
      return [];
    }
  }

  async completeStep(enrollmentId: number, stepId: number, timeSpentSeconds: number = 0, attemptNumber: number = 1): Promise<void> {
    await db.insert(progress)
      .values({ 
        enrollmentId, 
        stepId, 
        status: "completed",
        timeSpentSeconds,
        attemptCount: attemptNumber,
        startedAt: new Date(),
      })
      .onConflictDoNothing(); // Idempotent
  }

  async recordStepAttempt(enrollmentId: number, stepId: number, timeSeconds: number, attemptNumber: number): Promise<void> {
    const existingRecord = await db.select()
      .from(progress)
      .where(and(eq(progress.enrollmentId, enrollmentId), eq(progress.stepId, stepId)))
      .limit(1);

    if (existingRecord.length > 0) {
      await db.update(progress)
        .set({
          timeSpentSeconds: existingRecord[0].timeSpentSeconds + timeSeconds,
          attemptCount: attemptNumber,
        })
        .where(and(eq(progress.enrollmentId, enrollmentId), eq(progress.stepId, stepId)));
    }
  }

  async updateEnrollmentProgress(enrollmentId: number, progressPercent: number): Promise<void> {
    await db.update(enrollments)
      .set({ progress: progressPercent, lastAccessedAt: new Date() })
      .where(eq(enrollments.id, enrollmentId));
  }

  // Stats
  async getUserStats(userId: string): Promise<{ totalSteps: number; totalMinutes: number; streak: number }> {
    try {
      // This is a simplified calculation. Real apps might aggregate properly.
      const [stat] = await db.select({
        totalSteps: sql<number>`sum(${dailyStats.stepsCompleted})`,
        totalMinutes: sql<number>`sum(${dailyStats.minutesSpent})`,
      }).from(dailyStats).where(eq(dailyStats.userId, userId));

      // Get current streak from the latest dailyStat or calculate it
      const [latest] = await db.select().from(dailyStats)
        .where(eq(dailyStats.userId, userId))
        .orderBy(desc(dailyStats.date))
        .limit(1);

      return {
        totalSteps: Number(stat?.totalSteps || 0),
        totalMinutes: Number(stat?.totalMinutes || 0),
        streak: latest?.streakCurrent || 0
      };
    } catch (error) {
      console.warn("Error fetching user stats:", error);
      // Return defaults if database columns don't exist yet
      return { totalSteps: 0, totalMinutes: 0, streak: 0 };
    }
  }

  async getDailyActivity(userId: string): Promise<DailyStat[]> {
    return await db.select().from(dailyStats)
      .where(eq(dailyStats.userId, userId))
      .orderBy(desc(dailyStats.date))
      .limit(30); // Last 30 days
  }

  async recordActivity(userId: string, minutes: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if entry exists for today
    const [existing] = await db.select().from(dailyStats)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, today)));

    if (existing) {
      await db.update(dailyStats)
        .set({ 
          minutesSpent: existing.minutesSpent + minutes,
          stepsCompleted: existing.stepsCompleted + 1,
          isActive: true,
        })
        .where(eq(dailyStats.id, existing.id));
    } else {
      // Calculate streak by checking if active yesterday
      const streak = await this.calculateAndUpdateStreak(userId);
      await db.insert(dailyStats).values({
        userId,
        date: today,
        minutesSpent: minutes,
        stepsCompleted: 1,
        streakCurrent: streak,
        isActive: true,
      });
    }
  }

  async calculateAndUpdateStreak(userId: string): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Check if user was active yesterday
      const [yesterdayRecord] = await db.select()
        .from(dailyStats)
        .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, yesterday)))
        .limit(1);

      // Check if there's already an entry for today
      const [todayRecord] = await db.select()
        .from(dailyStats)
        .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, today)))
        .limit(1);

      let newStreak = 1;
      if (yesterdayRecord && yesterdayRecord.isActive) {
        newStreak = (yesterdayRecord.streakCurrent || 0) + 1;
      }

      if (todayRecord) {
        await db.update(dailyStats)
          .set({ streakCurrent: newStreak, isActive: true })
          .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, today)));
      } else {
        await db.insert(dailyStats).values({
          userId,
          date: today,
          minutesSpent: 0,
          stepsCompleted: 0,
          streakCurrent: newStreak,
          isActive: true,
        });
      }

      return newStreak;
    } catch (error) {
      console.warn("Error calculating streak:", error);
      return 1; // Default to 1 if calculation fails
    }
  }

  async logSession(userId: string, enrollmentId: number, stepId: number, timeSeconds: number, retryAttempt: number): Promise<SessionLog> {
    try {
      const [session] = await db.insert(sessionLogs).values({
        userId,
        enrollmentId,
        stepId,
        timeSpentSeconds: timeSeconds,
        retryAttempt,
      }).returning();
      return session;
    } catch (error) {
      console.warn("Error logging session:", error);
      // Return a default session log if table doesn't exist
      return {
        id: 0,
        userId,
        enrollmentId,
        stepId,
        sessionStarted: new Date(),
        sessionEnded: null,
        timeSpentSeconds: timeSeconds,
        retryAttempt,
      } as SessionLog;
    }
  }

  async updateUserMetrics(userId: string, enrollmentId: number): Promise<void> {
    try {
      // Calculate aggregated metrics from session logs and progress records
      const sessionData = await db.select()
        .from(sessionLogs)
        .where(and(eq(sessionLogs.userId, userId), eq(sessionLogs.enrollmentId, enrollmentId)));

      const progressData = await db.select()
        .from(progress)
        .where(eq(progress.enrollmentId, enrollmentId));

      if (progressData.length === 0) return;

      // Calculate averages
      const avgTimePerStep = Math.round(
        sessionData.reduce((sum, s) => sum + s.timeSpentSeconds, 0) / (progressData.length || 1)
      );

      const retryFrequency = sessionData.length > 0 
      ? sessionData.reduce((sum, s) => sum + s.retryAttempt, 0) / sessionData.length
      : 0;

      const [userStats] = await db.select().from(dailyStats)
        .where(eq(dailyStats.userId, userId))
        .orderBy(desc(dailyStats.date))
        .limit(1);

      const streakLength = userStats?.streakCurrent || 0;

      // Upsert user metrics
      const [existing] = await db.select()
        .from(userMetrics)
        .where(and(eq(userMetrics.userId, userId), eq(userMetrics.enrollmentId, enrollmentId)))
        .limit(1);

      if (existing) {
        await db.update(userMetrics)
          .set({
            avgTimePerStep,
            retryFrequency,
            streakLength,
            lastUpdated: new Date(),
          })
          .where(and(eq(userMetrics.userId, userId), eq(userMetrics.enrollmentId, enrollmentId)));
      } else {
        await db.insert(userMetrics).values({
          userId,
          enrollmentId,
          avgTimePerStep,
          retryFrequency,
          streakLength,
        });
      }
    } catch (error) {
      console.warn("Error updating user metrics:", error);
      // Silently fail if metrics table doesn't exist yet
    }
  }

  async getUserMetrics(userId: string, enrollmentId: number): Promise<UserMetric | undefined> {
    const [metric] = await db.select()
      .from(userMetrics)
      .where(and(eq(userMetrics.userId, userId), eq(userMetrics.enrollmentId, enrollmentId)))
      .limit(1);
    return metric;
  }

  async getLatestDailyStat(userId: string): Promise<DailyStat | undefined> {
    const [stat] = await db.select()
      .from(dailyStats)
      .where(eq(dailyStats.userId, userId))
      .orderBy(desc(dailyStats.date))
      .limit(1);
    return stat;
  }

  async createAssessment(
    userId: string,
    enrollmentId: number,
    score: number,
    skillLevel: string
  ): Promise<Assessment> {
    const [assessment] = await db.insert(assessments)
      .values({ userId, enrollmentId, score, skillLevel })
      .returning();
    return assessment;
  }

  async getLatestAssessment(userId: string, enrollmentId: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select()
      .from(assessments)
      .where(and(eq(assessments.userId, userId), eq(assessments.enrollmentId, enrollmentId)))
      .orderBy(desc(assessments.createdAt))
      .limit(1);
    return assessment;
  }
}

export const storage = new DatabaseStorage();
