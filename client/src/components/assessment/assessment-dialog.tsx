import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  roadmapTitle: string;
  onSubmit: (score: number) => void;
  isPending?: boolean;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of this technology/concept?",
    options: [
      "Data storage",
      "User interface design",
      "Server-side logic",
      "All of the above"
    ],
    correctAnswer: 3
  },
  {
    id: 2,
    question: "Which approach is considered a best practice?",
    options: [
      "Writing clean, maintainable code",
      "Copying code without understanding",
      "Ignoring documentation",
      "Skipping testing"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "How would you handle errors in production?",
    options: [
      "Ignore them",
      "Log and monitor them",
      "Let users figure it out",
      "Restart the application"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "What is the importance of version control?",
    options: [
      "Not important at all",
      "Only for large teams",
      "Essential for all projects",
      "Optional for solo developers"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Which statement about performance optimization is true?",
    options: [
      "Optimize everything from the start",
      "Never worry about performance",
      "Measure first, then optimize",
      "Performance doesn't matter"
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "What is the purpose of automated testing?",
    options: [
      "To waste development time",
      "To ensure code quality and prevent regressions",
      "To make deployments slower",
      "Testing is unnecessary"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Which principle is most important in software architecture?",
    options: [
      "Write everything in one file",
      "Separation of concerns and modularity",
      "Never refactor code",
      "Avoid documentation"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "How should you approach learning a new technology?",
    options: [
      "Only read documentation once",
      "Skip the basics and start with advanced topics",
      "Build projects while learning fundamentals",
      "Memorize syntax without understanding concepts"
    ],
    correctAnswer: 2
  },
  {
    id: 9,
    question: "What is the best strategy for debugging complex issues?",
    options: [
      "Random code changes until it works",
      "Systematic isolation and testing of components",
      "Give up and rewrite everything",
      "Ignore error messages"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Which approach leads to better code maintainability?",
    options: [
      "Writing clever, complex one-liners",
      "Avoiding comments completely",
      "Clear naming, documentation, and simple logic",
      "Using global variables everywhere"
    ],
    correctAnswer: 2
  }
];

export function AssessmentDialog({
  open,
  onClose,
  roadmapTitle,
  onSubmit,
  isPending = false,
}: AssessmentDialogProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let correct = 0;
      SAMPLE_QUESTIONS.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
      const finalScore = Math.round((correct / SAMPLE_QUESTIONS.length) * 100);
      setScore(finalScore);
      setIsCompleted(true);
    }
  };

  const handleSubmit = () => {
    onSubmit(score);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setScore(0);
    onClose();
  };

  const progress = ((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100;
  const currentQ = SAMPLE_QUESTIONS[currentQuestion];
  const isAnswered = answers[currentQ?.id] !== undefined;

  if (isCompleted) {
    return (
      <Dialog open={open} onOpenChange={handleReset}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assessment Complete!</DialogTitle>
            <DialogDescription>
              Here are your results for {roadmapTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{score}%</span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Learning!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  You answered {Object.values(answers).filter((ans, idx) => ans === SAMPLE_QUESTIONS[idx].correctAnswer).length} out of {SAMPLE_QUESTIONS.length} questions correctly.
                </p>
              </div>

              <div className="flex gap-2 w-full">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Close
                </Button>
                <Button onClick={handleSubmit} disabled={isPending} className="flex-1">
                  {isPending ? "Submitting..." : "Submit Score"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assessment Test - {roadmapTitle}</DialogTitle>
          <DialogDescription>
            Answer all questions to complete your assessment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQ.question}</h3>
            
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!isAnswered}>
              {currentQuestion === SAMPLE_QUESTIONS.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
