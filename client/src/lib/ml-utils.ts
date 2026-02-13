/**
 * ML-Ready Utility Functions
 * Calculate metrics that will feed into ML models
 */

/**
 * Calculate skill level based on retry frequency and time per step
 * @param avgTimePerStep - Average seconds spent per step
 * @param retryFrequency - Number of retries per step
 * @returns "beginner" | "intermediate" | "advanced"
 */
export function calculateSkillLevel(
  avgTimePerStep: number,
  retryFrequency: number
): "beginner" | "intermediate" | "advanced" {
  // Logic: 
  // - Beginner: High time per step (>120s) + High retries (>1.5)
  // - Intermediate: Medium time (60-120s) + Medium retries (1-1.5)
  // - Advanced: Low time (<60s) + Low retries (<1)
  
  if (avgTimePerStep > 120 && retryFrequency > 1.5) {
    return "beginner";
  }
  if (avgTimePerStep > 60 && retryFrequency > 1) {
    return "intermediate";
  }
  return "advanced";
}

/**
 * Estimate days to completion
 * @param progressPercent - Current progress (0-100)
 * @param completionSpeed - Steps per day (based on historical data)
 * @param totalSteps - Total steps in roadmap
 * @returns Estimated days to completion
 */
export function estimateDaysToCompletion(
  progressPercent: number,
  completionSpeed: number,
  totalSteps: number
): number {
  if (completionSpeed <= 0) return -1; // Can't calculate
  
  const stepsCompleted = Math.round((progressPercent / 100) * totalSteps);
  const stepsRemaining = totalSteps - stepsCompleted;
  const daysToComplete = Math.ceil(stepsRemaining / completionSpeed);
  
  return Math.max(1, daysToComplete); // At least 1 day
}

/**
 * Calculate dropout risk score (0-1)
 * @param daysInactive - Days since last activity
 * @param progressSpeed - Steps completed per day
 * @param streakLength - Current streak length
 * @returns Risk score 0-1 (0 = safe, 1 = high risk)
 */
export function calculateDropoutRisk(
  daysInactive: number,
  progressSpeed: number,
  streakLength: number
): number {
  let risk = 0;
  
  // Inactivity is major risk factor
  if (daysInactive > 7) risk += 0.6;
  else if (daysInactive > 3) risk += 0.3;
  else if (daysInactive > 0) risk += 0.1;
  
  // Low speed indicates struggle
  if (progressSpeed < 0.1) risk += 0.2;
  else if (progressSpeed < 0.5) risk += 0.1;
  
  // Broken streak indicates disengagement
  if (streakLength === 0) risk += 0.1;
  
  return Math.min(1, risk); // Cap at 1
}

/**
 * Get skill level color for UI
 */
export function getSkillLevelColor(
  level: "beginner" | "intermediate" | "advanced"
): string {
  const colors: Record<string, string> = {
    beginner: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    intermediate:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return colors[level] || colors.beginner;
}

/**
 * Get risk level color for UI
 */
export function getRiskColor(risk: number): string {
  if (risk > 0.6) {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
  if (risk > 0.3) {
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
  }
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
}

/**
 * Get risk level label
 */
export function getRiskLabel(risk: number): string {
  if (risk > 0.6) return "High Risk";
  if (risk > 0.3) return "Medium Risk";
  return "Low Risk";
}
