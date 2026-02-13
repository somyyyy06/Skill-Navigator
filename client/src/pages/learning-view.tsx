import {
  useEnrollment,
  useCompleteStep,
  useMlSkillLevel,
  useCreateAssessment,
  useGenerateCustomRoadmap,
} from "@/hooks/use-roadmaps";
import { useStepTimer } from "@/hooks/use-step-timer";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentDialog } from "@/components/assessment/assessment-dialog";
import { RoadmapRecommendationDialog } from "@/components/assessment/roadmap-recommendation-dialog";
import { useRoute, Link } from "wouter";
import { ArrowLeft, CheckCircle, Circle, PlayCircle, ExternalLink, Video, FileText, Clock, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SkillLevelBadge } from "@/components/ml-insights";

export default function LearningView() {
  const [, params] = useRoute("/learning/:id");
  const enrollmentId = Number(params?.id);
  const { data: enrollment, isLoading, refetch } = useEnrollment(enrollmentId);
  const { data: skillPrediction } = useMlSkillLevel(enrollmentId);
  const { mutate: completeStep, isPending, isError, error } = useCompleteStep();
  const { mutate: createAssessment, isPending: isAssessmentPending, isError: isAssessmentError, error: assessmentError, data: assessmentResult } = useCreateAssessment();
  const { mutate: generateRoadmap, isPending: isGeneratingRoadmap, data: generatedRoadmap } = useGenerateCustomRoadmap();
  
  // Track selected step ID locally
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  
  // Track step visit count for retry attempts
  const [stepVisitCount, setStepVisitCount] = useState<Record<number, number>>({});
  
  // Time tracking for the active step
  const { timeSpent, formatTime } = useStepTimer(selectedStepId, true);

  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false);

  // Set initial selected step to the first incomplete step
  useEffect(() => {
    if (enrollment && !selectedStepId) {
      const steps = enrollment.roadmap.steps.sort((a, b) => a.order - b.order);
      const completedIds = new Set(enrollment.progressDetails.map(p => p.stepId));
      const firstIncomplete = steps.find(s => !completedIds.has(s.id));
      setSelectedStepId(firstIncomplete ? firstIncomplete.id : steps[steps.length - 1].id);
    }
  }, [enrollment, selectedStepId]);

  // Track step selection to count retries
  const handleStepSelect = (stepId: number) => {
    setSelectedStepId(stepId);
    setStepVisitCount(prev => ({
      ...prev,
      [stepId]: (prev[stepId] || 0) + 1
    }));
  };

  if (isLoading || !enrollment) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"/>
          <p className="text-muted-foreground">Loading your learning environment...</p>
        </div>
      </div>
    );
  }

  const steps = enrollment.roadmap.steps.sort((a, b) => a.order - b.order);
  const activeStep = steps.find(s => s.id === selectedStepId);
  const completedStepIds = new Set(enrollment.progressDetails.map(p => p.stepId));
  const isCompleted = activeStep && completedStepIds.has(activeStep.id);
  const isRoadmapComplete = steps.length > 0 && completedStepIds.size === steps.length;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Navigation for Steps */}
      <div className="w-80 border-r border-border bg-card flex flex-col h-full">
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <div className="space-y-1 mb-4">
            <h2 className="font-bold text-lg leading-tight">{enrollment.roadmap.title}</h2>
            <div className="flex items-center gap-2">
              <SkillLevelBadge size="sm" skillLevel={skillPrediction?.skillLevel} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round((completedStepIds.size / steps.length) * 100)}% ({completedStepIds.size}/{steps.length})</span>
            </div>
            <Progress value={(completedStepIds.size / steps.length) * 100} className="h-2" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {steps.map((step, idx) => {
              const isDone = completedStepIds.has(step.id);
              const isActive = selectedStepId === step.id;
              const visitCount = stepVisitCount[step.id] || 0;
              
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepSelect(step.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all justify-between group",
                    isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      {isDone ? (
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white fill-white" />
                        </div>
                      ) : (
                        <div className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all",
                          isActive 
                            ? "border-primary-foreground text-primary-foreground bg-primary-foreground/20" 
                            : "border-muted-foreground text-muted-foreground"
                        )}>
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-sm font-medium truncate",
                        isDone && "opacity-60"
                      )}>
                        {step.title}
                      </div>
                      <div className={cn(
                        "text-xs opacity-70",
                        isActive && "opacity-80"
                      )}>
                        {step.estimatedMinutes}m
                      </div>
                    </div>
                  </div>
                  
                  {/* Retry count badge */}
                  {visitCount > 1 && (
                    <div className={cn(
                      "ml-2 text-xs font-bold shrink-0 rounded-full w-5 h-5 flex items-center justify-center",
                      isActive
                        ? "bg-primary-foreground/30 text-primary-foreground"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    )}>
                      {visitCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeStep ? (
          <ScrollArea className="flex-1 p-8 md:p-12">
            <div className="max-w-3xl mx-auto pb-20">
              <div className="mb-8 border-b pb-8">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge variant="outline">Step {steps.findIndex(s => s.id === activeStep.id) + 1} of {steps.length}</Badge>
                  <Badge variant="secondary" className="bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {activeStep.estimatedMinutes} min
                  </Badge>
                  
                  {/* Show skill level estimate */}
                  <SkillLevelBadge size="sm" showLabel={false} skillLevel={skillPrediction?.skillLevel} />
                </div>
                
                <h1 className="text-4xl font-display font-bold text-foreground mb-4">{activeStep.title}</h1>
                
                {/* Enhanced metrics display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                    <div className="text-xs text-muted-foreground font-medium">Estimated Time</div>
                    <div className="text-lg font-bold text-foreground">{activeStep.estimatedMinutes}m</div>
                  </div>
                  
                  {timeSpent > 0 && (
                    <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                      <div className="text-xs text-muted-foreground font-medium">Time Spent</div>
                      <div className="text-lg font-bold text-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" /> {formatTime(timeSpent)}
                      </div>
                    </div>
                  )}
                  
                  {stepVisitCount[activeStep.id] && stepVisitCount[activeStep.id] > 1 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                      <div className="text-xs text-orange-700 dark:text-orange-400 font-medium">Attempts</div>
                      <div className="text-lg font-bold text-orange-700 dark:text-orange-400">×{stepVisitCount[activeStep.id]}</div>
                    </div>
                  )}
                  
                  <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                    <div className="text-xs text-muted-foreground font-medium">Progress</div>
                    <div className="text-lg font-bold text-foreground">
                      {Math.round((completedStepIds.size / steps.length) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <ReactMarkdown>{activeStep.content}</ReactMarkdown>
              </div>

              {/* Resources */}
              {activeStep.resources && activeStep.resources.length > 0 && (
                <div className="mb-12 bg-secondary/50 rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-bold mb-4">Learning Resources</h3>
                  <div className="grid gap-3">
                    {activeStep.resources.map((resource: any, i: number) => (
                      <a 
                        key={i} 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-background rounded-lg border hover:border-primary transition-colors group"
                      >
                        <div className="p-2 bg-muted rounded-md mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {resource.type === 'video' ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-muted-foreground capitalize">{resource.type}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {isError && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive">
                    Failed to complete step: {error?.message || "Unknown error"}
                  </p>
                </div>
              )}

              {isRoadmapComplete && (
                <Card className="mb-10 border-primary/30">
                  <CardHeader>
                    <CardTitle>🎓 Roadmap Complete!</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Congratulations on completing {enrollment.roadmap.title}! Take the assessment to evaluate your learning.
                    </p>
                    <Button
                      onClick={() => setShowAssessmentDialog(true)}
                      className="w-full"
                    >
                      Take Assessment Test
                    </Button>

                    {assessmentResult && (
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-sm font-medium">
                          Assessment completed! Your skill level: <span className="font-bold capitalize text-primary">{assessmentResult.skillLevel}</span>
                        </p>
                      </div>
                    )}

                    {isAssessmentError && (
                      <div className="text-sm text-destructive">
                        Failed to save assessment: {assessmentError?.message || "Unknown error"}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between border-t pt-8 gap-4">
                <Button variant="outline" onClick={() => {
                  const currIdx = steps.findIndex(s => s.id === activeStep.id);
                  if (currIdx > 0) setSelectedStepId(steps[currIdx - 1].id);
                }} disabled={steps.findIndex(s => s.id === activeStep.id) === 0}>
                  Previous Step
                </Button>

                {isCompleted ? (
                  <Button 
                    onClick={() => {
                      const currIdx = steps.findIndex(s => s.id === activeStep.id);
                      if (currIdx < steps.length - 1) {
                        setSelectedStepId(steps[currIdx + 1].id);
                      }
                    }}
                    className="px-8 shadow-lg shadow-primary/20"
                  >
                    Next Step <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      const attemptNumber = stepVisitCount[activeStep.id] || 1;
                      completeStep({ 
                        enrollmentId, 
                        stepId: activeStep.id,
                        timeSpentSeconds: timeSpent,
                        attemptNumber,
                        startedAt: new Date(),
                      });
                    }} 
                    disabled={isPending} 
                    className="px-8 shadow-lg shadow-primary/20"
                  >
                    {isPending ? "Completing..." : "Mark as Complete"}
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a step to start learning
          </div>
        )}
      </div>

      <ChatWidget />

      {/* Assessment Dialog */}
      <AssessmentDialog
        open={showAssessmentDialog}
        onClose={() => setShowAssessmentDialog(false)}
        roadmapTitle={enrollment.roadmap.title}
        onSubmit={(score) => {
          createAssessment(
            { enrollmentId, score },
            {
              onSuccess: (result) => {
                setShowAssessmentDialog(false);
                // If skill level is beginner, show recommendation dialog
                if (result.skillLevel === "beginner") {
                  setTimeout(() => setShowRecommendationDialog(true), 500);
                }
              },
            }
          );
        }}
        isPending={isAssessmentPending}
      />

      {/* Roadmap Recommendation Dialog */}
      <RoadmapRecommendationDialog
        open={showRecommendationDialog}
        onClose={() => setShowRecommendationDialog(false)}
        skillLevel={assessmentResult?.skillLevel || "beginner"}
        roadmapTitle={enrollment.roadmap.title}
        onGenerateRoadmap={(weakAreas) => {
          generateRoadmap(
            {
              roadmapTitle: enrollment.roadmap.title,
              weakAreas: weakAreas || undefined,
              skillLevel: assessmentResult?.skillLevel || "beginner",
            },
            {
              onSuccess: (result) => {
                setShowRecommendationDialog(false);
                // Show success notification or navigate to custom roadmap view
                alert(`Custom roadmap "${result.roadmap.title}" generated! It has ${result.roadmap.steps.length} steps tailored to your needs.`);
              },
              onError: (error) => {
                alert(`Failed to generate roadmap: ${error.message}`);
              },
            }
          );
        }}
        isGenerating={isGeneratingRoadmap}
      />
    </div>
  );
}
