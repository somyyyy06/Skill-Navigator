import { useRoadmaps } from "@/hooks/use-roadmaps";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen, Clock, Signal } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { ChatWidget } from "@/components/chat/chat-widget";

export default function RoadmapsList() {
  const { data: roadmaps, isLoading } = useRoadmaps();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredRoadmaps = roadmaps?.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Explore Roadmaps</h1>
              <p className="text-muted-foreground text-lg">Curated learning paths to master modern technologies.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search roadmaps..." 
                className="pl-10 h-12 bg-card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['all', 'backend', 'frontend', 'ai', 'devops'].map(cat => (
                <Button 
                  key={cat} 
                  variant={filter === cat ? "default" : "outline"}
                  onClick={() => setFilter(cat)}
                  className="capitalize whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[300px] bg-muted/20 animate-pulse rounded-2xl" />
              ))
            ) : filteredRoadmaps?.map((roadmap) => (
              <Card key={roadmap.id} className="flex flex-col h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-semibold">
                      {roadmap.category.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      <Signal className="h-3 w-3" />
                      <span className="capitalize">{roadmap.difficulty}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{roadmap.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {roadmap.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>12 Steps</span> {/* Mock count if not available in list view */}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>40 Hours</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href={`/roadmaps/${roadmap.id}`} className="w-full">
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                      View Roadmap
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredRoadmaps?.length === 0 && !isLoading && (
            <div className="text-center py-20 text-muted-foreground">
              <p>No roadmaps found matching your criteria.</p>
              <Button variant="link" onClick={() => {setSearch(""); setFilter("all");}}>Clear filters</Button>
            </div>
          )}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
