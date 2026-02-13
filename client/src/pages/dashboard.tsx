import {
  useStats,
  useEnrollments,
  useRoadmaps,
  useMlDropoutRisk,
  useMlProgressSpeed,
  useMlSkillLevel,
} from "@/hooks/use-roadmaps";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Clock, Trophy, ArrowRight, PlayCircle, Zap } from "lucide-react";
import { Link } from "wouter";
import {
  SkillLevelBadge,
  DropoutRiskAlert,
  LearningStatsCard,
} from "@/components/ml-insights";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: allRoadmaps, isLoading: roadmapsLoading } = useRoadmaps();

  // Filter recommended roadmaps (those not enrolled)
  const recommendedRoadmaps = allRoadmaps?.filter(
    (r) => !enrollments?.some((e) => e.roadmapId === r.id)
  ).slice(0, 3);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="glass-card">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-display">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );

  if (statsLoading || enrollmentsLoading || roadmapsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Ready to continue learning?</p>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
              <span className="font-bold">{stats?.streak || 0} Day Streak</span>
            </div>
          </div>

          {/* Learning Overview Stats */}
          <LearningStatsCard
            totalEnrollments={enrollments?.length || 0}
            averageProgress={
              enrollments && enrollments.length > 0
                ? Math.round(
                    enrollments.reduce((sum, e) => sum + e.progress, 0) /
                      enrollments.length
                  )
                : 0
            }
            totalHoursSpent={(stats?.totalMinutes || 0) / 60}
            activeDaysStreak={stats?.streak || 0}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Daily Streak" 
              value={stats?.streak || 0} 
              icon={Flame} 
              color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" 
            />
            <StatCard 
              title="Minutes Spent" 
              value={stats?.totalMinutes || 0} 
              icon={Clock} 
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
            />
            <StatCard 
              title="Steps Completed" 
              value={stats?.totalSteps || 0} 
              icon={Trophy} 
              color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column: Active Enrollments */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display">Active Enrollments</h2>
                  <Link href="/learning" className="text-sm font-medium text-primary hover:underline">View All</Link>
                </div>

                {enrollments && enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                  ))
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground mb-4">You haven't enrolled in any roadmaps yet.</p>
                      <Link href="/roadmaps">
                        <Button variant="outline">Browse Roadmaps</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.dailyActivity || []}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(val) => format(new Date(val), 'MMM d')}
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                          itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="minutesSpent" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: 'hsl(var(--background))', strokeWidth: 2 }} 
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Recommendations */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-display">Recommended For You</h2>
                <div className="space-y-4">
                  {recommendedRoadmaps?.map((roadmap) => (
                    <Card key={roadmap.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">{roadmap.difficulty}</Badge>
                        <h4 className="font-bold mb-1">{roadmap.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{roadmap.description}</p>
                        <Link href={`/roadmaps/${roadmap.id}`}>
                          <Button variant="ghost" size="sm" className="w-full justify-between text-primary hover:text-primary hover:bg-primary/10">
                            View Details <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {(!recommendedRoadmaps || recommendedRoadmaps.length === 0) && (
                    <p className="text-sm text-muted-foreground">No new recommendations available right now.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: any }) {
  const { data: skillPrediction } = useMlSkillLevel(enrollment.id);
  const { data: progressPrediction } = useMlProgressSpeed(enrollment.id);
  const { data: dropoutPrediction } = useMlDropoutRisk(enrollment.id);

  const predictedDays = progressPrediction?.predictedDaysToCompletion;

  return (
    <div className="space-y-4">
      <DropoutRiskAlert riskScore={dropoutPrediction?.riskScore} showDetails={false} />

      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {enrollment.roadmap.category.toUpperCase()}
                </Badge>
                <SkillLevelBadge skillLevel={skillPrediction?.skillLevel} size="sm" />
                <span className="text-xs text-muted-foreground font-medium">Last accessed today</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{enrollment.roadmap.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{enrollment.roadmap.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Progress</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[160px]">
              <Link href={`/learning/${enrollment.id}`}>
                <Button className="w-full gap-2 shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:translate-y-[-2px] transition-all">
                  <PlayCircle className="h-4 w-4" /> Continue
                </Button>
              </Link>
              <div className="text-xs text-muted-foreground text-center">
                {typeof predictedDays === "number" && predictedDays > 0
                  ? `~${predictedDays} days to finish`
                  : "Estimated time unavailable"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block w-72 border-r border-border" />
      <main className="flex-1 p-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
