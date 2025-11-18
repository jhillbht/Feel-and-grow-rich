import { Button } from "@/components/ui/button";
import { Sparkles, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent/10 p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Feel and Grow Rich
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Transform your relationship with wealth through 8 powerful assessment tools and AI-powered insights
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">8 Transformative Tools</h3>
            <p className="text-sm text-muted-foreground">
              Belief mapping, emotional awareness, and daily practices for wealth consciousness
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">AI-Powered Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized abundance insights powered by advanced AI
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Track Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              Export your journey as PDF, Excel, or JSON to measure your growth
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={signInWithGoogle}
              disabled={isLoading}
              data-testid="button-login-google"
            >
              {isLoading ? "Loading..." : "Continue with Google"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in to begin your wealth transformation journey
          </p>
        </div>
      </div>
    </div>
  );
}
