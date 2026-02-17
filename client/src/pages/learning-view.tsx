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
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold">
                    Step {steps.findIndex(s => s.id === activeStep.id) + 1} of {steps.length}
                  </Badge>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-100/50 to-purple-50 dark:from-purple-950/40 dark:to-purple-900/30 border border-purple-200/50 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 font-semibold">
                    <Clock className="h-3 w-3 mr-1" /> {activeStep.estimatedMinutes} min
                  </Badge>
                  
                  {/* Show skill level estimate */}
                  <SkillLevelBadge size="sm" showLabel={false} skillLevel={skillPrediction?.skillLevel} />
                </div>
                
                <h1 className="text-4xl font-display font-bold text-foreground mb-6">{activeStep.title}</h1>
                
                {/* Enhanced Premium Metrics Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {/* Estimated Time Card */}
                  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 p-4 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg hover:border-blue-300/70 dark:hover:border-blue-700/70 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 group-hover:from-blue-400/5 group-hover:via-blue-400/10 group-hover:to-blue-400/5 transition-all" />
                    <div className="relative flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Estimated Time</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{activeStep.estimatedMinutes}m</div>
                    </div>
                  </div>
                  
                  {/* Time Spent Card */}
                  {timeSpent > 0 && (
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/30 p-4 border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg hover:border-emerald-300/70 dark:hover:border-emerald-700/70 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 group-hover:from-emerald-400/5 group-hover:via-emerald-400/10 group-hover:to-emerald-400/5 transition-all" />
                      <div className="relative flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Time Spent</span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">{formatTime(timeSpent)}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Attempts Card */}
                  {stepVisitCount[activeStep.id] && stepVisitCount[activeStep.id] > 1 && (
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/30 p-4 border border-amber-200/50 dark:border-amber-800/50 hover:shadow-lg hover:border-amber-300/70 dark:hover:border-amber-700/70 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 group-hover:from-amber-400/5 group-hover:via-amber-400/10 group-hover:to-amber-400/5 transition-all" />
                      <div className="relative flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Attempts</span>
                        </div>
                        <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">×{stepVisitCount[activeStep.id]}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Progress Card */}
                  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/30 p-4 border border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg hover:border-purple-300/70 dark:hover:border-purple-700/70 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 group-hover:from-purple-400/5 group-hover:via-purple-400/10 group-hover:to-purple-400/5 transition-all" />
                    <div className="relative flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Progress</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                        {Math.round((completedStepIds.size / steps.length) * 100)}%
                      </div>
                      <div className="mt-2 h-1.5 bg-purple-200/50 dark:bg-purple-800/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{width: `${Math.round((completedStepIds.size / steps.length) * 100)}%`}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <ReactMarkdown>{activeStep.content}</ReactMarkdown>
              </div>

              {/* Enhanced Learning Resources Section */}
              {activeStep.resources && activeStep.resources.length > 0 && (
                <div className="mb-12">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">📚 Learning Resources</h3>
                    <p className="text-sm text-muted-foreground">Click below to access the learning materials for this step</p>
                  </div>
                  <div className="grid gap-4">
                    {activeStep.resources.map((resource: any, i: number) => (
                      <a 
                        key={i} 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/40 dark:to-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all" />
                        
                        <div className="relative p-4 flex items-start gap-4">
                          {/* Icon Container */}
                          <div className={cn(
                            "p-3 rounded-lg shrink-0 transition-all duration-300",
                            resource.type === 'video' 
                              ? "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/40 dark:to-red-900/30 group-hover:from-red-200 group-hover:to-red-100 dark:group-hover:from-red-900/60 dark:group-hover:to-red-800/50"
                              : "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/30 group-hover:from-blue-200 group-hover:to-blue-100 dark:group-hover:from-blue-900/60 dark:group-hover:to-blue-800/50"
                          )}>
                            {resource.type === 'video' 
                              ? <PlayCircle className="h-6 w-6 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" /> 
                              : <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                            }
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-tight">
                                {resource.title}
                              </h4>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-200/40 dark:bg-slate-800/40 group-hover:bg-primary/10 transition-colors">
                              <Video className={cn("h-3 w-3", resource.type === 'video' ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400")} />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary capitalize">{resource.type}</span>
                            </div>
                          </div>
                        </div>
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
        onClose={() => {
          setShowRecommendationDialog(false);
        }}
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
              onError: (error) => {
                console.error('Roadmap generation error:', error);
                alert(`❌ Failed to generate roadmap: ${error.message}\n\nPlease check:\n1. GEMINI_API_KEY is set in .env\n2. API key is valid\n3. Server console for detailed errors`);
              },
            }
          );
        }}
        isGenerating={isGeneratingRoadmap}
        generatedRoadmap={generatedRoadmap?.roadmap}
      />
    </div>
  );
}
