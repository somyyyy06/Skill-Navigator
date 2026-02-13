import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { jwtMiddleware } from "./middleware/jwtAuth";
import {
  calculateDropoutRisk,
  estimateDaysToCompletion,
  predictLearningPace,
  predictSkillLevel,
  skillLevelFromAssessmentScore,
  recommendRoadmap,
} from "./ml/predictors";

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiBaseUrl = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
const geminiModel = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

function getGeminiUrl(method: "generateContent" | "streamGenerateContent" = "generateContent") {
  if (!geminiApiKey) return null;
  return `${geminiBaseUrl}/models/${geminiModel}:${method}?key=${geminiApiKey}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function coerceDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(from: Date | string | null | undefined, to: Date = new Date()): number {
  const start = coerceDate(from);
  if (!start) return 0;
  return Math.max(0, Math.floor((to.getTime() - start.getTime()) / DAY_MS));
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth - Skip Replit Auth for local development, using JWT instead
  // await setupAuth(app);
  registerAuthRoutes(app);
  
  // Setup Chat
  registerChatRoutes(app);

  // === API ROUTES ===

  // Roadmaps
  app.get(api.roadmaps.list.path, async (req, res) => {
    const roadmaps = await storage.getRoadmaps();
    res.json(roadmaps);
  });

  app.get(api.roadmaps.get.path, async (req, res) => {
    const roadmap = await storage.getRoadmap(Number(req.params.id));
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    const steps = await storage.getRoadmapSteps(roadmap.id);
    res.json({ ...roadmap, steps });
  });

  app.post(api.roadmaps.create.path, async (req, res) => {
    try {
      const input = api.roadmaps.create.input.parse(req.body);
      const roadmap = await storage.createRoadmap(input);
      res.status(201).json(roadmap);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Steps
  app.post(api.steps.create.path, async (req, res) => {
    try {
      const roadmapId = Number(req.params.roadmapId);
      const input = api.steps.create.input.parse(req.body);
      const step = await storage.createStep({ ...input, roadmapId });
      res.status(201).json(step);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Enrollments
  app.get(api.enrollments.list.path, jwtMiddleware, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const enrollments = await storage.getEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Get enrollments error:", error);
      res.status(500).json({ message: "Failed to get enrollments" });
    }
  });

  app.post(api.enrollments.enroll.path, jwtMiddleware, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        console.error("No userId found in request");
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const roadmapId = Number(req.params.roadmapId);
      console.log(`Enrolling user ${userId} in roadmap ${roadmapId}`);

      if (isNaN(roadmapId)) {
        return res.status(400).json({ message: "Invalid roadmap ID" });
      }

      const existing = await storage.getEnrollmentByRoadmap(userId, roadmapId);
      if (existing) return res.status(400).json({ message: "Already enrolled" });

      const enrollment = await storage.createEnrollment(userId, roadmapId);
      console.log("Enrollment successful:", enrollment);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Enrollment error:", error);
      res.status(500).json({ message: "Failed to enroll" });
    }
  });

  app.get(api.enrollments.get.path, jwtMiddleware, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const enrollment = await storage.getEnrollment(Number(req.params.id));
      if (!enrollment) return res.status(404).json({ message: "Not found" });
      
      // Check ownership
      if (enrollment.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      // Fetch steps for the roadmap
      const steps = await storage.getRoadmapSteps(enrollment.roadmapId);
      const progress = await storage.getEnrollmentProgress(enrollment.id);
      
      res.json({ 
        ...enrollment, 
        roadmap: { 
          ...enrollment.roadmap, 
          steps 
        },
        progressDetails: progress 
      });
    } catch (error) {
      console.error("Get enrollment error:", error);
      res.status(500).json({ message: "Failed to get enrollment" });
    }
  });

  // Progress
  app.post(api.progress.completeStep.path, jwtMiddleware, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const enrollmentId = Number(req.params.enrollmentId);
      const stepId = Number(req.params.stepId);
      
      // Extract enriched data from request body
      const { timeSpentSeconds = 0, attemptNumber = 1, startedAt } = req.body;

      const enrollment = await storage.getEnrollment(enrollmentId);
      if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

      if (enrollment.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      // Complete step with metadata
      await storage.completeStep(enrollmentId, stepId, timeSpentSeconds, attemptNumber);
      
      // Log session for ML training
      await storage.logSession(userId, enrollmentId, stepId, timeSpentSeconds, attemptNumber);
      
      // Update streak calculation
      const newStreak = await storage.calculateAndUpdateStreak(userId);
      
      // Record activity (convert seconds to minutes)
      const minutes = Math.ceil(timeSpentSeconds / 60) || 30; // Default to 30 mins if not tracked
      await storage.recordActivity(userId, minutes);

      // Recalculate progress
      const steps = await storage.getRoadmapSteps(enrollment.roadmapId);
      const completed = await storage.getEnrollmentProgress(enrollmentId);
      const newProgress = Math.round((completed.length / steps.length) * 100);
      
      await storage.updateEnrollmentProgress(enrollmentId, newProgress);
      
      // Update user metrics for ML
      await storage.updateUserMetrics(userId, enrollmentId);

      res.json({ 
        message: "Step completed successfully",
        progress: newProgress,
        streak: newStreak,
        timeTracked: timeSpentSeconds,
      });
    } catch (error) {
      console.error("Complete step error:", error);
      res.status(500).json({ message: "Failed to complete step" });
    }
  });

  // Stats
  app.get(api.stats.get.path, jwtMiddleware, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const stats = await storage.getUserStats(userId);
      const activity = await storage.getDailyActivity(userId);
      res.json({ ...stats, dailyActivity: activity });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Assessments
  app.post(api.assessments.create.path, jwtMiddleware, async (req, res) => {
    try {
      const input = api.assessments.create.input.parse(req.body);
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const enrollment = await storage.getEnrollment(input.enrollmentId);
      if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
      if (enrollment.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      const skillLevel = skillLevelFromAssessmentScore(input.score);
      const assessment = await storage.createAssessment(userId, input.enrollmentId, input.score, skillLevel);

      res.status(201).json({ assessmentId: assessment.id, skillLevel });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Assessment creation error:", error);
      res.status(500).json({ message: "Failed to record assessment" });
    }
  });

  // Generate Custom Roadmap based on weak areas
  app.post(api.assessments.generateCustomRoadmap.path, jwtMiddleware, async (req, res) => {
    try {
      const input = api.assessments.generateCustomRoadmap.input.parse(req.body);
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const prompt = `You are an expert learning path designer. Create a personalized learning roadmap to help someone improve their skills.

Context:
- Original Roadmap: ${input.roadmapTitle}
- Current Skill Level: ${input.skillLevel}
- Weak Areas: ${input.weakAreas || "General improvement needed"}

Generate a focused 6-8 step roadmap that addresses their weak areas. Each step should:
1. Build on previous concepts
2. Include specific, actionable learning objectives
3. Be realistic and achievable

Return ONLY valid JSON in this exact format:
{
  "title": "Custom Improvement Roadmap for [Topic]",
  "description": "A brief description of what this roadmap will help them achieve",
  "steps": [
    {
      "title": "Step title",
      "description": "What they will learn in this step"
    }
  ]
}`;

      const geminiUrl = getGeminiUrl("generateContent");
      if (!geminiUrl) {
        return res.status(500).json({ message: "Gemini API key is not configured" });
      }

      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
        }),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Gemini roadmap generation error:", errorText);
        return res.status(500).json({ message: "Failed to generate custom roadmap" });
      }

      const geminiData = await geminiResponse.json();
      const content =
        geminiData?.candidates?.[0]?.content?.parts?.map((part: { text: string }) => part.text).join("") || "{}";
      const roadmapData = JSON.parse(content);

      res.json({ roadmap: roadmapData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Custom roadmap generation error:", error);
      res.status(500).json({ message: "Failed to generate custom roadmap" });
    }
  });

  // ML Predictions
  app.post(api.ml.predictRoadmapRecommendation.path, async (req, res) => {
    try {
      const input = api.ml.predictRoadmapRecommendation.input.parse(req.body);
      const roadmaps = await storage.getRoadmaps();
      if (roadmaps.length === 0) return res.status(404).json({ message: "No roadmaps found" });

      const recommendation = recommendRoadmap(roadmaps, input);
      res.json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Roadmap recommendation error:", error);
      res.status(500).json({ message: "Failed to generate recommendation" });
    }
  });

  app.post(api.ml.predictSkillLevel.path, jwtMiddleware, async (req, res) => {
    try {
      const input = api.ml.predictSkillLevel.input.parse(req.body);
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const enrollment = await storage.getEnrollment(input.enrollmentId);
      if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
      if (enrollment.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      const latestAssessment = await storage.getLatestAssessment(userId, input.enrollmentId);
      let skillLevel = latestAssessment?.skillLevel;

      if (!skillLevel) {
        const metrics = await storage.getUserMetrics(userId, input.enrollmentId);
        const avgTimePerStep = metrics?.avgTimePerStep ?? 90;
        const retryFrequency = metrics?.retryFrequency ?? 1.2;
        skillLevel = predictSkillLevel(avgTimePerStep, retryFrequency);
      }

      res.json({ skillLevel });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Skill level prediction error:", error);
      res.status(500).json({ message: "Failed to predict skill level" });
    }
  });

  app.post(api.ml.predictProgressSpeed.path, jwtMiddleware, async (req, res) => {
    try {
      const input = api.ml.predictProgressSpeed.input.parse(req.body);
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const enrollment = await storage.getEnrollment(input.enrollmentId);
      if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
      if (enrollment.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      const steps = await storage.getRoadmapSteps(enrollment.roadmapId);
      const progress = await storage.getEnrollmentProgress(enrollment.id);
      const totalSteps = steps.length;
      const stepsCompleted = progress.length;
      const daysSinceEnrollment = Math.max(1, daysBetween(enrollment.createdAt) || 1);
      const completionSpeed = stepsCompleted / daysSinceEnrollment;
      const progressPercent = totalSteps > 0 ? Math.round((stepsCompleted / totalSteps) * 100) : enrollment.progress;

      const predictedDaysToCompletion = estimateDaysToCompletion(
        progressPercent,
        completionSpeed,
        totalSteps
      );
      const learningPace = predictLearningPace(completionSpeed);

      res.json({ predictedDaysToCompletion, learningPace });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Progress speed prediction error:", error);
      res.status(500).json({ message: "Failed to predict progress speed" });
    }
  });

  app.post(api.ml.predictDropoutRisk.path, jwtMiddleware, async (req, res) => {
    try {
      const input = api.ml.predictDropoutRisk.input.parse(req.body);
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const enrollment = await storage.getEnrollment(input.enrollmentId);
      if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
      if (enrollment.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      const steps = await storage.getRoadmapSteps(enrollment.roadmapId);
      const progress = await storage.getEnrollmentProgress(enrollment.id);
      const totalSteps = steps.length;
      const stepsCompleted = progress.length;
      const daysSinceEnrollment = Math.max(1, daysBetween(enrollment.createdAt) || 1);
      const progressSpeed = stepsCompleted / daysSinceEnrollment;

      const lastAccessedAt = enrollment.lastAccessedAt ?? enrollment.createdAt;
      const daysInactive = daysBetween(lastAccessedAt);

      const metrics = await storage.getUserMetrics(userId, input.enrollmentId);
      const latestDailyStat = metrics ? null : await storage.getLatestDailyStat(userId);
      const streakLength = metrics?.streakLength ?? latestDailyStat?.streakCurrent ?? 0;

      const riskScore = calculateDropoutRisk(daysInactive, progressSpeed, streakLength);
      const dropoutRisk = riskScore >= 0.6;

      res.json({ dropoutRisk, riskScore });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Dropout risk prediction error:", error);
      res.status(500).json({ message: "Failed to predict dropout risk" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const roadmapCount = await storage.getRoadmaps();
  if (roadmapCount.length === 0) {
    const roadmapData = [
      {
        slug: "frontend-developer",
        title: "Frontend Developer",
        description: "Build beautiful and interactive user interfaces.",
        category: "frontend",
        difficulty: "beginner",
        steps: [
          "HTML Fundamentals", 
          "CSS Basics & Flexbox", 
          "Responsive Design with Tailwind", 
          "JavaScript Essentials",
          "DOM Manipulation", 
          "Async JS (Fetch & Promises)", 
          "React Fundamentals", 
          "React Hooks & State",
          "Frontend Project Construction"
        ]
      },
      {
        slug: "backend-developer",
        title: "Backend Developer",
        description: "Master server-side logic, databases, and APIs.",
        category: "backend",
        difficulty: "intermediate",
        steps: [
          "Node.js Runtime Basics", 
          "NPM & Package Management", 
          "Express.js Framework", 
          "REST API Design Principles",
          "SQL Fundamentals", 
          "Drizzle ORM & PostgreSQL", 
          "Authentication & Security", 
          "Testing & Error Handling",
          "API Deployment & Scaling"
        ]
      },
      {
        slug: "ai-engineer",
        title: "AI Engineer",
        description: "Learn to build and deploy intelligent systems.",
        category: "ai",
        difficulty: "advanced",
        steps: [
          "Python for AI & Data Science", 
          "Math for ML: Linear Algebra", 
          "Statistical Modeling Basics", 
          "Supervised Learning Models",
          "Deep Learning & Neural Networks", 
          "Natural Language Processing", 
          "Large Language Models (LLMs)", 
          "Prompt Engineering Strategies",
          "AI Model Deployment"
        ]
      },
      {
        slug: "devops-engineer",
        title: "DevOps Engineer",
        description: "Automate, deploy, and manage scalable infrastructure.",
        category: "devops",
        difficulty: "intermediate",
        steps: [
          "Linux System Administration",
          "Git & Version Control",
          "Docker Fundamentals",
          "Kubernetes Orchestration",
          "CI/CD Pipeline Design",
          "Infrastructure as Code (Terraform)",
          "Monitoring & Logging",
          "Cloud Platform Basics",
          "DevOps Best Practices"
        ]
      },
      {
        slug: "mobile-developer",
        title: "Mobile Developer",
        description: "Create native and cross-platform mobile applications.",
        category: "mobile",
        difficulty: "beginner",
        steps: [
          "Mobile Development Overview",
          "React Native Basics",
          "Component Architecture",
          "State Management in Mobile",
          "Navigation & Routing",
          "API Integration & Networking",
          "Local Storage & Persistence",
          "Mobile UI/UX Patterns",
          "Publishing to App Stores"
        ]
      },
      {
        slug: "cybersecurity-specialist",
        title: "Cybersecurity Specialist",
        description: "Protect systems and data from cyber threats.",
        category: "cybersecurity",
        difficulty: "advanced",
        steps: [
          "Network Security Fundamentals",
          "Cryptography & Encryption",
          "Ethical Hacking Basics",
          "Penetration Testing Methods",
          "Web Application Security",
          "Threat Detection & Analysis",
          "Security Compliance & Standards",
          "Incident Response & Forensics",
          "Advanced Security Operations"
        ]
      },
      {
        slug: "cloud-architect",
        title: "Cloud Architect",
        description: "Design and manage cloud infrastructure at scale.",
        category: "cloud",
        difficulty: "intermediate",
        steps: [
          "Cloud Computing Fundamentals",
          "AWS Core Services",
          "Azure Platform Overview",
          "Cloud Networking & VPC",
          "Serverless Architecture",
          "Cloud Storage Solutions",
          "Identity & Access Management",
          "Cost Optimization Strategies",
          "Cloud Migration Patterns"
        ]
      },
      {
        slug: "blockchain-developer",
        title: "Blockchain Developer",
        description: "Build decentralized applications and smart contracts.",
        category: "blockchain",
        difficulty: "advanced",
        steps: [
          "Blockchain Fundamentals",
          "Ethereum & Smart Contracts",
          "Solidity Programming",
          "Web3.js Integration",
          "DApp Development",
          "Token Standards (ERC-20, ERC-721)",
          "DeFi Protocols",
          "Security Best Practices",
          "Deployment & Testing"
        ]
      },
      {
        slug: "fullstack-developer",
        title: "Full-Stack Developer",
        description: "Master both frontend and backend development.",
        category: "fullstack",
        difficulty: "intermediate",
        steps: [
          "HTML, CSS & JavaScript Mastery",
          "Modern Frontend Frameworks",
          "Backend Architecture Patterns",
          "Database Design & Optimization",
          "RESTful & GraphQL APIs",
          "Authentication & Authorization",
          "Deployment & Hosting",
          "Performance Optimization",
          "Full-Stack Project Integration"
        ]
      }
    ];

    for (const data of roadmapData) {
      const roadmap = await storage.createRoadmap({
        slug: data.slug,
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
      });

      for (let i = 0; i < data.steps.length; i++) {
        await storage.createStep({
          roadmapId: roadmap.id,
          title: data.steps[i],
          description: `Master ${data.steps[i]} in this detailed learning guide.`,
          content: `# ${data.steps[i]}\n\nThis guide covers the core concepts and practical implementations of ${data.steps[i]}.`,
          order: i + 1,
          estimatedMinutes: 60,
          resources: []
        });
      }
    }
  }
}
