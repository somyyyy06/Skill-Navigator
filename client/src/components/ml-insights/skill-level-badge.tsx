import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  getSkillLevelColor,
  calculateSkillLevel,
} from "@/lib/ml-utils";

interface SkillLevelBadgeProps {
  avgTimePerStep?: number;
  retryFrequency?: number;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}

/**
 * Displays user's current skill level with color coding
 * Shows: Beginner (blue), Intermediate (orange), Advanced (green)
 */
export function SkillLevelBadge({
  avgTimePerStep = 90,
  retryFrequency = 1,
  skillLevel,
  size = "default",
  showLabel = true,
}: SkillLevelBadgeProps) {
  const level =
    skillLevel || calculateSkillLevel(avgTimePerStep, retryFrequency);
  const bgColor = getSkillLevelColor(level);

  const sizeClasses: Record<string, string> = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const labelText: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  return (
    <div className={`${bgColor} rounded-full ${sizeClasses[size]} inline-block`}>
      {showLabel ? (
        <span className="font-semibold capitalize">{labelText[level]}</span>
      ) : (
        <span className="font-semibold">{level.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
