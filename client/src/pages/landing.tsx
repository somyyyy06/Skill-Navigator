import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Terminal, Code2, BrainCircuit, Sparkles, Trophy, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import habitsImg from "@assets/image_1770021142728.png";
import analyticsImg from "@assets/image_1770021201894.png";
import streakImg from "@assets/image_1770021222554.png";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">AI</div>
            <span className="text-lg font-display font-bold tracking-tight">LearnAI</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">Features</Button>
            <Button onClick={() => window.location.href = '/auth'} className="shadow-lg shadow-primary/20 hover-elevate">
              Log in
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto text-center space-y-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6">
              One place to run your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">entire learning life</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Everything connected, nothing isolated. Master tech skills with personalized roadmaps and AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/25 hover-elevate" onClick={() => window.location.href = '/auth'}>
                Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-background/50 backdrop-blur-sm hover-elevate">
                Explore Paths
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Feature Timeline Visual */}
        <div className="max-w-5xl mx-auto px-4 mb-32">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
            {[
              { icon: BrainCircuit, label: "Daily Habits", sub: "Build discipline" },
              { icon: Code2, label: "Skill Learning", sub: "Structured paths" },
              { icon: Terminal, label: "Execution", sub: "Clear milestones" },
              { icon: ArrowRight, label: "Progress", sub: "Data-driven" },
              { icon: Trophy, label: "Streaks", sub: "Compounding growth" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Screenshots Grid - UniDash Style */}
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center">
            <h2 className="text-4xl font-display font-bold mb-4">Everything tracked, nothing missed</h2>
            <p className="text-muted-foreground">A comprehensive system for your tech success</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-8 rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-card hover-elevate cursor-pointer"
            >
              <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">dashboard_overview.png</span>
              </div>
              <img src={habitsImg} alt="Dashboard Overview" className="w-full h-auto" />
            </motion.div>

            <div className="lg:col-span-4 space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl overflow-hidden border border-border/50 shadow-xl bg-card hover-elevate cursor-pointer"
              >
                <img src={analyticsImg} alt="Analytics" className="w-full h-auto" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl overflow-hidden border border-border/50 shadow-xl bg-card hover-elevate cursor-pointer"
              >
                <img src={streakImg} alt="Consistency" className="w-full h-auto" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="py-24 bg-secondary/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4">Upcoming</h2>
            <p className="text-muted-foreground">Exciting features coming to enhance your journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "AI-Powered Guide", desc: "Personalized recommendations based on your progress.", tag: "Next Up" },
              { icon: Trophy, title: "Hackathon Updates", desc: "Real-time notifications for internships and hackathons.", tag: "Planned" },
              { icon: Share2, title: "Social Assistant", desc: "Auto-post achievements to LinkedIn and Twitter.", tag: "Planned" },
            ].map((feature, i) => (
              <Card key={i} className="glass-card hover-elevate">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                      {feature.tag}
                    </span>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 LearnAI Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
