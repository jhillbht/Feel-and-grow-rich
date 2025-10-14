import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { daily10Schema, type Daily10 } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/session-context";

const prompts = [
  {
    id: "prompt1",
    question: "What am I grateful for today?",
    description: "List 3 things you appreciate right now",
  },
  {
    id: "prompt2",
    question: "What challenge am I facing?",
    description: "Name one difficulty and how it's affecting you",
  },
  {
    id: "prompt3",
    question: "What strength can I draw upon?",
    description: "Identify a personal resource or quality to help you",
  },
  {
    id: "prompt4",
    question: "What would love do?",
    description: "How would you approach this situation with compassion?",
  },
  {
    id: "prompt5",
    question: "What is one small action I can take?",
    description: "Choose something doable within the next 24 hours",
  },
];

export default function Daily10() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { updateSessionData, currentSession } = useSession();

  const form = useForm<Daily10>({
    resolver: zodResolver(daily10Schema),
    defaultValues: {
      prompt1: "",
      prompt2: "",
      prompt3: "",
      prompt4: "",
      prompt5: "",
    },
  });

  useEffect(() => {
    if (currentSession?.daily10) {
      form.reset({
        prompt1: currentSession.daily10.prompt1 || "",
        prompt2: currentSession.daily10.prompt2 || "",
        prompt3: currentSession.daily10.prompt3 || "",
        prompt4: currentSession.daily10.prompt4 || "",
        prompt5: currentSession.daily10.prompt5 || "",
      });
    }
  }, [currentSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const toggleTimer = () => {
    if (!timerRunning && timeElapsed === 0) {
      toast({
        title: "Timer Started",
        description: "Take your time with each question. There's no rush.",
      });
    }
    setTimerRunning(!timerRunning);
  };

  const onSubmit = async (data: Daily10) => {
    setIsSaving(true);
    try {
      const completedData = {
        ...data,
        completedAt: new Date().toISOString(),
        duration: timeElapsed,
      };
      await updateSessionData({ daily10: completedData });
      setIsComplete(true);
      setTimerRunning(false);
      toast({
        title: "Daily Practice Complete",
        description: `Completed in ${Math.floor(timeElapsed / 60)} minutes ${timeElapsed % 60} seconds`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your daily practice.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const progress = (timeElapsed / 600) * 100;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-heading text-2xl">Practice Complete!</CardTitle>
            <CardDescription className="mt-2">
              You completed your Daily 10 in {minutes} minutes {seconds} seconds. 
              Your reflections have been saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/"} data-testid="button-return-home">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Daily 10
          </h1>
          <p className="text-muted-foreground">
            A 10-minute daily reflection practice for clarity and growth
          </p>
        </div>

        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Timer
              </CardTitle>
              <span className="text-2xl font-heading font-bold">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Target: 10 minutes</span>
              <span>{Math.min(Math.floor(progress), 100)}% complete</span>
            </div>
            <div className="flex justify-center">
              <Button onClick={toggleTimer} variant="outline" data-testid="button-timer-toggle">
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {timeElapsed === 0 ? "Start Timer" : "Resume"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {prompts.map((prompt, index) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-heading text-lg">{prompt.question}</CardTitle>
                      <CardDescription className="mt-1">{prompt.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name={prompt.id as keyof Daily10}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Your reflection..."
                            className="min-h-[120px] resize-none"
                            {...field}
                            data-testid={`textarea-${prompt.id}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

            <Button type="submit" className="w-full" size="lg" disabled={isSaving} data-testid="button-complete-practice">
              {isSaving ? "Saving..." : "Complete Practice"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
