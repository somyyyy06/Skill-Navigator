import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingDown } from "lucide-react";
import { estimateDaysToCompletion } from "@/lib/ml-utils";

interface CompletionTimeCardProps {
  progressPercent: number;
  completionSpeed?: number;
  totalSteps: number;
  estimatedDays?: number;
  isCompact?: boolean;
}

/**
 * Shows estimated time to completion based on current progress and speed
 */
export function CompletionTimeCard({
  progressPercent,
  completionSpeed = 2, // Default: 2 steps per day
  totalSteps,
  estimatedDays,
  isCompact = false,
}: CompletionTimeCardProps) {
  const daysToComplete =
    estimatedDays || estimateDaysToCompletion(progressPercent, completionSpeed, totalSteps);

  if (isCompact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10">
        <Clock className="w-4 h-4 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Est. Completion</p>
          <p className="text-sm font-semibold">
            {daysToComplete === -1 ? "N/A" : `${daysToComplete}d`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-5 h-5 text-primary" />
          Estimated Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-primary">
              {daysToComplete === -1 ? "—" : `${daysToComplete}`}
            </p>
            <p className="text-sm text-muted-foreground">days remaining</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progressPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Speed</span>
            <span className="font-medium">{completionSpeed.toFixed(1)} steps/day</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
