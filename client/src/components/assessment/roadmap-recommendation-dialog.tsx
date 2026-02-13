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
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RoadmapRecommendationDialogProps {
  open: boolean;
  onClose: () => void;
  skillLevel: string;
  roadmapTitle: string;
  onGenerateRoadmap: (weakAreas: string) => void;
  isGenerating?: boolean;
}

export function RoadmapRecommendationDialog({
  open,
  onClose,
  skillLevel,
  roadmapTitle,
  onGenerateRoadmap,
  isGenerating = false,
}: RoadmapRecommendationDialogProps) {
  const [weakAreas, setWeakAreas] = useState("");

  const handleGenerate = () => {
    if (weakAreas.trim()) {
      onGenerateRoadmap(weakAreas);
    }
  };

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
