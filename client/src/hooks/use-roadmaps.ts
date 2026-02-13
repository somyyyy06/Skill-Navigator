import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Types derived from API response schemas (best practice when shared types aren't explicitly exported for every return shape)
// But here we rely on the Zod schemas in the routes file implicitly handled by the fetcher, 
// and we can type the data based on the @shared/schema exports.
import type { Roadmap, RoadmapWithSteps, Step, EnrollmentWithRoadmap, DailyStat } from "@shared/schema";

// --- ROADMAPS ---

function getAuthHeader() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useRoadmaps() {
  return useQuery({
    queryKey: [api.roadmaps.list.path],
    queryFn: async () => {
      const res = await fetch(api.roadmaps.list.path, { headers: getAuthHeader() });
      if (!res.ok) throw new Error("Failed to fetch roadmaps");
      return await res.json() as Roadmap[];
    },
  });
}

export function useRoadmap(id: number) {
  return useQuery({
    queryKey: [api.roadmaps.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.roadmaps.get.path, { id });
      const res = await fetch(url, { headers: getAuthHeader() });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch roadmap");
      return await res.json() as RoadmapWithSteps;
    },
    enabled: !!id,
  });
}

// --- ENROLLMENTS ---

export function useEnrollments() {
  return useQuery({
    queryKey: [api.enrollments.list.path],
    queryFn: async () => {
      const res = await fetch(api.enrollments.list.path, { headers: getAuthHeader() });
      if (!res.ok) throw new Error("Failed to fetch enrollments");
      return await res.json() as EnrollmentWithRoadmap[];
    },
  });
}

export function useEnrollment(id: number) {
  return useQuery({
    queryKey: [api.enrollments.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.enrollments.get.path, { id });
      const res = await fetch(url, { headers: getAuthHeader() });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch enrollment");
      return await res.json() as EnrollmentWithRoadmap;
    },
    enabled: !!id,
  });
}

export function useEnrollInRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roadmapId: number) => {
      const url = buildUrl(api.enrollments.enroll.path, { roadmapId });
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      if (!res.ok) throw new Error("Failed to enroll");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.enrollments.list.path] });
    },
  });
}

// --- PROGRESS ---

export function useCompleteStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      enrollmentId, 
      stepId, 
      timeSpentSeconds = 0,
      attemptNumber = 1,
      startedAt = new Date(),
    }: { 
      enrollmentId: number
      stepId: number
      timeSpentSeconds?: number
      attemptNumber?: number
      startedAt?: Date
    }) => {
      const url = buildUrl(api.progress.completeStep.path, { enrollmentId, stepId });
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          timeSpentSeconds,
          attemptNumber,
          startedAt: startedAt.toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to complete step");
      return await res.json();
    },
    onSuccess: async (data, variables) => {
      // Invalidate and wait for the refetch to complete
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: [api.enrollments.get.path, variables.enrollmentId],
          exact: true,
        }),
        queryClient.invalidateQueries({ 
          queryKey: [api.stats.get.path],
          exact: true,
        }),
      ]);
    },
  });
}

// --- STATS ---

export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { headers: getAuthHeader() });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json() as {
        streak: number;
        totalSteps: number;
        totalMinutes: number;
        dailyActivity: DailyStat[];
      };
    },
  });
}

// --- ML PREDICTIONS ---

export function useMlSkillLevel(enrollmentId: number) {
  return useQuery({
    queryKey: [api.ml.predictSkillLevel.path, enrollmentId],
    queryFn: async () => {
      const res = await fetch(api.ml.predictSkillLevel.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ enrollmentId }),
      });
      if (!res.ok) throw new Error("Failed to predict skill level");
      return await res.json() as { skillLevel: "beginner" | "intermediate" | "advanced" };
    },
    enabled: !!enrollmentId,
  });
}

export function useMlProgressSpeed(enrollmentId: number) {
  return useQuery({
    queryKey: [api.ml.predictProgressSpeed.path, enrollmentId],
    queryFn: async () => {
      const res = await fetch(api.ml.predictProgressSpeed.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ enrollmentId }),
      });
      if (!res.ok) throw new Error("Failed to predict progress speed");
      return await res.json() as { predictedDaysToCompletion: number; learningPace: "slow" | "steady" | "fast" };
    },
    enabled: !!enrollmentId,
  });
}

export function useMlDropoutRisk(enrollmentId: number) {
  return useQuery({
    queryKey: [api.ml.predictDropoutRisk.path, enrollmentId],
    queryFn: async () => {
      const res = await fetch(api.ml.predictDropoutRisk.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ enrollmentId }),
      });
      if (!res.ok) throw new Error("Failed to predict dropout risk");
      return await res.json() as { dropoutRisk: boolean; riskScore: number };
    },
    enabled: !!enrollmentId,
  });
}

// --- ASSESSMENTS ---

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ enrollmentId, score }: { enrollmentId: number; score: number }) => {
      const res = await fetch(api.assessments.create.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ enrollmentId, score }),
      });
      if (!res.ok) throw new Error("Failed to record assessment");
      return await res.json() as { assessmentId: number; skillLevel: "beginner" | "intermediate" | "advanced" };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [api.ml.predictSkillLevel.path, variables.enrollmentId],
        exact: true,
      });
    },
  });
}

export function useGenerateCustomRoadmap() {
  return useMutation({
    mutationFn: async ({ 
      roadmapTitle, 
      weakAreas, 
      skillLevel 
    }: { 
      roadmapTitle: string; 
      weakAreas?: string; 
      skillLevel: "beginner" | "intermediate" | "advanced" 
    }) => {
      const res = await fetch(api.assessments.generateCustomRoadmap.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ roadmapTitle, weakAreas, skillLevel }),
      });
      if (!res.ok) throw new Error("Failed to generate custom roadmap");
      return await res.json() as { 
        roadmap: { 
          title: string; 
          description: string; 
          steps: Array<{ title: string; description: string }> 
        } 
      };
    },
  });
}
