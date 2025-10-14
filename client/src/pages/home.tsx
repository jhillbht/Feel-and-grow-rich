import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Triangle, 
  Heart, 
  Smile, 
  Mountain, 
  ClipboardList,
  ArrowRight,
  Sparkles
} from "lucide-react";

const tools = [
  {
    path: "/intake",
    title: "Intake Wizard",
    description: "Begin your wealth journey with a comprehensive assessment",
    icon: ClipboardList,
    color: "text-chart-1",
    estimate: "10-15 min",
  },
  {
    path: "/belief-mapper",
    title: "Belief Mapper",
    description: "Map limiting beliefs about wealth and identify blocks to prosperity",
    icon: TrendingUp,
    color: "text-chart-2",
    estimate: "15-20 min",
  },
  {
    path: "/triangle-shift",
    title: "Triangle Shift",
    description: "Transform from scarcity mindset to abundance consciousness",
    icon: Triangle,
    color: "text-chart-3",
    estimate: "10 min",
  },
  {
    path: "/six-fears",
    title: "Six Fears Assessment",
    description: "Identify fears blocking your path to wealth and worthiness",
    icon: Heart,
    color: "text-chart-4",
    estimate: "5-10 min",
  },
  {
    path: "/feelings-dial",
    title: "Feelings Dial",
    description: "Track emotions with abundance-focused mindfulness",
    icon: Smile,
    color: "text-chart-5",
    estimate: "5 min",
  },
  {
    path: "/hill-overlay",
    title: "Hill Overlay",
    description: "Select a wealth principle and commit to prosperity action",
    icon: Mountain,
    color: "text-chart-1",
    estimate: "5 min",
  },
  {
    path: "/daily-10",
    title: "Daily 10",
    description: "Complete your 10-minute wealth consciousness practice",
    icon: ClipboardList,
    color: "text-chart-2",
    estimate: "10 min",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Wealth, Worthiness & Personal Development</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Feel and Grow Rich
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive platform for wealth, worthiness, and personal development. 
              Explore powerful tools designed to help you feel and grow rich in all areas of your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.path} href={tool.path}>
                  <Card className="h-full hover-elevate active-elevate-2 transition-all cursor-pointer" data-testid={`card-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg bg-card-foreground/5 ${tool.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          {tool.estimate}
                        </span>
                      </div>
                      <CardTitle className="font-heading text-xl">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed mb-4">
                        {tool.description}
                      </CardDescription>
                      <Button variant="ghost" size="sm" className="gap-2 -ml-3">
                        Start Exercise
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-accent/30 border-accent">
              <CardHeader>
                <CardTitle className="font-heading">Track Your Progress</CardTitle>
                <CardDescription>
                  All your sessions are automatically saved. Export your data anytime to review your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/export">
                  <Button variant="default" data-testid="button-view-export">
                    View Export Options
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
