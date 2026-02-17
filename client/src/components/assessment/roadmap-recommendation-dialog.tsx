import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RoadmapRecommendationDialogProps {
  open: boolean;
  onClose: () => void;
  skillLevel: string;
  roadmapTitle: string;
  onGenerateRoadmap: (weakAreas: string) => void;
  isGenerating?: boolean;
  generatedRoadmap?: {
    title: string;
    description: string;
    steps: Array<{ title: string; description: string }>;
  };
}

export function RoadmapRecommendationDialog({
  open,
  onClose,
  skillLevel,
  roadmapTitle,
  onGenerateRoadmap,
  isGenerating = false,
  generatedRoadmap,
}: RoadmapRecommendationDialogProps) {
  const [weakAreas, setWeakAreas] = useState("");

  const handleGenerate = () => {
    if (weakAreas.trim() || true) {  // Allow generation even without input
      onGenerateRoadmap(weakAreas);
    }
  };

  // Show generated roadmap if available
  if (generatedRoadmap) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Your Custom Learning Path
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-bold text-lg mb-2">{generatedRoadmap.title}</h3>
              <p className="text-sm text-muted-foreground">{generatedRoadmap.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Learning Steps ({generatedRoadmap.steps.length} Total)
              </h4>
              {generatedRoadmap.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-muted/50 rounded-lg border">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold mb-1">{step.title}</h5>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={onClose} className="w-full">
              Got It, Thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Personalized Learning Recommendation
          </DialogTitle>
          <DialogDescription>
            Based on your {skillLevel} skill level, we can create a custom roadmap to help you improve.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You scored below average on this roadmap. Let's create a personalized learning path to strengthen your weak areas.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="weak-areas">
              What topics do you want to focus on? (Optional)
            </Label>
            <Textarea
              id="weak-areas"
              placeholder="e.g., I struggled with async programming, API design, and database optimization..."
              value={weakAreas}
              onChange={(e) => setWeakAreas(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to let AI analyze your performance and suggest areas automatically.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Maybe Later
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Custom Roadmap
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
