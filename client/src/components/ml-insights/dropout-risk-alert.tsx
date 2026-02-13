import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  calculateDropoutRisk,
  getRiskColor,
  getRiskLabel,
} from "@/lib/ml-utils";

interface DropoutRiskAlertProps {
  daysInactive?: number;
  progressSpeed?: number;
  streakLength?: number;
  riskScore?: number;
  showDetails?: boolean;
}

/**
 * Shows dropout risk alert based on user engagement metrics
 * High risk (>0.6): Red alert
 * Medium risk (0.3-0.6): Orange warning
 * Low risk (<0.3): Green info
 */
export function DropoutRiskAlert({
  daysInactive = 0,
  progressSpeed = 1,
  streakLength = 5,
  riskScore,
  showDetails = true,
}: DropoutRiskAlertProps) {
  const risk =
    riskScore || calculateDropoutRisk(daysInactive, progressSpeed, streakLength);
  const riskLabel = getRiskLabel(risk);
  const riskColor = getRiskColor(risk);

  const getIcon = () => {
    if (risk > 0.6) return <AlertTriangle className="h-4 w-4" />;
    if (risk > 0.3) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  const getMessage = () => {
    if (risk > 0.6) {
      return "You haven't been active recently. Let's get back on track!";
    }
    if (risk > 0.3) {
      return "Keep up your momentum to complete this roadmap.";
    }
    return "Great job maintaining your progress!";
  };

  const getBgColor = () => {
    if (risk > 0.6) return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
    if (risk > 0.3) return "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800";
    return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
  };

  if (risk < 0.1) return null; // Don't show if risk is very low

  return (
    <Alert className={getBgColor()}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <AlertTitle className="capitalize">{riskLabel}</AlertTitle>
          <AlertDescription>{getMessage()}</AlertDescription>

          {showDetails && (
            <div className="mt-3 text-xs space-y-1 text-muted-foreground">
              {daysInactive > 0 && (
                <p>• Last activity: {daysInactive} days ago</p>
              )}
              {progressSpeed < 0.5 && (
                <p>• Progress speed is slower than average</p>
              )}
              {streakLength === 0 && (
                <p>• Current streak: None (resume today!)</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
}
