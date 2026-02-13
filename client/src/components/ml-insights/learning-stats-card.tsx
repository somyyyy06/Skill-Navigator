import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Zap, Target } from "lucide-react";

interface LearningStatsCardProps {
  totalEnrollments: number;
  averageProgress: number;
  totalHoursSpent: number;
  activeDaysStreak: number;
}

/**
 * Shows overall learning statistics and progress across all roadmaps
 */
export function LearningStatsCard({
  totalEnrollments,
  averageProgress,
  totalHoursSpent,
  activeDaysStreak,
}: LearningStatsCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Learning Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Average Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground font-medium">Avg Progress</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                {Math.round(averageProgress)}%
              </p>
              <Progress value={averageProgress} className="h-1.5" />
            </div>
          </div>

          {/* Active Enrollments */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Active Roads</p>
            <p className="text-2xl font-bold">{totalEnrollments}</p>
            <p className="text-xs text-muted-foreground">in progress</p>
          </div>

          {/* Hours Spent */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Time Invested</p>
            <p className="text-2xl font-bold">{totalHoursSpent.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">hours</p>
          </div>

          {/* Streak */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <p className="text-xs text-muted-foreground font-medium">Streak</p>
            </div>
            <p className="text-2xl font-bold text-orange-500">{activeDaysStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
