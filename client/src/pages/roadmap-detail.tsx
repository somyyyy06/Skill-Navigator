import { useRoadmap, useEnrollInRoadmap } from "@/hooks/use-roadmaps";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatWidget } from "@/components/chat/chat-widget";

export default function RoadmapDetail() {
  const [, params] = useRoute("/roadmaps/:id");
  const id = Number(params?.id);
  const [, setLocation] = useLocation();
  const { data: roadmap, isLoading } = useRoadmap(id);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollInRoadmap();
  const { toast } = useToast();

  const handleEnroll = () => {
    enroll(id, {
      onSuccess: () => {
        toast({
          title: "Enrolled Successfully!",
          description: "This roadmap has been added to your dashboard.",
        });
        setLocation("/dashboard");
      },
      onError: (err) => {
        toast({
          title: "Enrollment Failed",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!roadmap) {
    return <div>Roadmap not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roadmaps
          </Button>
          
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <Badge>{roadmap.category}</Badge>
              <Badge variant="outline">{roadmap.difficulty}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{roadmap.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{roadmap.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold font-display text-primary mb-1">{roadmap.steps.length}</div>
                <div className="text-sm text-muted-foreground">Learning Steps</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold font-display text-primary mb-1">
                  {Math.ceil(roadmap.steps.reduce((acc, s) => acc + s.estimatedMinutes, 0) / 60)}h
                </div>
                <div className="text-sm text-muted-foreground">Estimated Time</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6 flex items-center justify-center">
                <Button size="lg" className="w-full text-lg shadow-lg shadow-primary/20" onClick={handleEnroll} disabled={isEnrolling}>
                  {isEnrolling ? "Enrolling..." : "Start Learning Now"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Curriculum</h2>
            <div className="relative border-l-2 border-muted pl-8 space-y-12">
              {roadmap.steps.sort((a, b) => a.order - b.order).map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="absolute -left-[41px] top-0 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  
                  <div className="bg-card rounded-xl p-6 border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{step.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.estimatedMinutes}m
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
