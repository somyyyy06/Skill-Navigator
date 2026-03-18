// Client-only type definitions (no database imports)

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Roadmap {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: Date;
}

export interface Step {
  id: number;
  roadmapId: number;
  title: string;
  description: string;
  content: string;
  order: number;
  estimatedMinutes: number;
  resources: Array<{
    title: string;
    url: string;
    type: 'video' | 'article' | 'docs';
  }>;
}

export interface RoadmapWithSteps extends Roadmap {
  steps: Step[];
}

export interface Enrollment {
  id: number;
  userId: string;
  roadmapId: number;
  status: string;
  progress: number;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface EnrollmentWithRoadmap extends Enrollment {
  roadmap: Roadmap;
}

export interface DailyStat {
  id: number;
  userId: string;
  date: Date;
  minutesSpent: number;
  stepsCompleted: number;
}

export interface ProgressEntry {
  id: number;
  enrollmentId: number;
  stepId: number;
  status: string;
  attemptCount: number;
  completedAt?: Date;
  timeSpentMinutes: number;
}

export interface Assessment {
  id: number;
  userId: string;
  enrollmentId: number;
  score: number;
  skillLevel: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  userId?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}
