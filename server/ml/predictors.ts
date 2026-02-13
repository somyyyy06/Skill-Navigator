import type { Roadmap } from "@shared/schema";

export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type LearningPace = "slow" | "steady" | "fast";

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  backend: ["backend", "server", "api", "database", "node", "express"],
  frontend: ["frontend", "ui", "ux", "web", "react", "css", "html"],
  ai: ["ai", "ml", "machine", "learning", "data"],
  devops: ["devops", "ci", "cd", "docker", "kubernetes"],
  mobile: ["mobile", "android", "ios", "flutter", "react native"],
  cybersecurity: ["cyber", "security", "infosec", "pentest"],
  cloud: ["cloud", "aws", "azure", "gcp"],
  blockchain: ["blockchain", "web3", "crypto", "solidity"],
  fullstack: ["fullstack", "full-stack", "full stack"],
};

function normalizeCategory(input: string): string | null {
  const text = input.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }
  return null;
}

function difficultyFromSkillLevel(skillLevel: SkillLevel): SkillLevel {
  return skillLevel;
}

function difficultyFromYear(year: number): SkillLevel | null {
  if (year <= 1) return "beginner";
  if (year <= 3) return "intermediate";
  return "advanced";
}

export function predictSkillLevel(
  avgTimePerStep: number,
  retryFrequency: number
): SkillLevel {
  if (avgTimePerStep > 120 && retryFrequency > 1.5) {
    return "beginner";
  }
  if (avgTimePerStep > 60 && retryFrequency > 1) {
    return "intermediate";
  }
  return "advanced";
}

export function skillLevelFromAssessmentScore(score: number): SkillLevel {
  if (score >= 80) return "advanced";
  if (score >= 55) return "intermediate";
  return "beginner";
}

export function estimateDaysToCompletion(
  progressPercent: number,
  completionSpeed: number,
  totalSteps: number
): number {
  if (completionSpeed <= 0 || totalSteps <= 0) return -1;

  const stepsCompleted = Math.round((progressPercent / 100) * totalSteps);
  const stepsRemaining = Math.max(0, totalSteps - stepsCompleted);
  const daysToComplete = Math.ceil(stepsRemaining / completionSpeed);

  return Math.max(1, daysToComplete);
}

export function calculateDropoutRisk(
  daysInactive: number,
  progressSpeed: number,
  streakLength: number
): number {
  let risk = 0;

  if (daysInactive > 7) risk += 0.6;
  else if (daysInactive > 3) risk += 0.3;
  else if (daysInactive > 0) risk += 0.1;

  if (progressSpeed < 0.1) risk += 0.2;
  else if (progressSpeed < 0.5) risk += 0.1;

  if (streakLength === 0) risk += 0.1;

  return Math.min(1, risk);
}

export function predictLearningPace(completionSpeed: number): LearningPace {
  if (completionSpeed < 0.25) return "slow";
  if (completionSpeed < 1) return "steady";
  return "fast";
}

export function recommendRoadmap(
  roadmaps: Roadmap[],
  input: { skillLevel: SkillLevel; goal: string; year: number; interest: string }
): { recommendedRoadmapId: number; confidence: number } {
  const interestCategory = normalizeCategory(input.interest);
  const goalCategory = normalizeCategory(input.goal);
  const targetDifficulty = difficultyFromSkillLevel(input.skillLevel);
  const yearDifficulty = difficultyFromYear(input.year);

  let best = roadmaps[0];
  let bestScore = -1;

  for (const roadmap of roadmaps) {
    let score = 0;

    if (interestCategory && roadmap.category === interestCategory) score += 0.5;
    if (goalCategory && roadmap.category === goalCategory) score += 0.2;
    if (roadmap.difficulty === targetDifficulty) score += 0.2;
    if (yearDifficulty && roadmap.difficulty === yearDifficulty) score += 0.1;

    if (score > bestScore || (score === bestScore && roadmap.id < best.id)) {
      best = roadmap;
      bestScore = score;
    }
  }

  const confidence = Math.min(0.95, 0.4 + 0.6 * Math.max(0, bestScore));

  return { recommendedRoadmapId: best.id, confidence };
}
