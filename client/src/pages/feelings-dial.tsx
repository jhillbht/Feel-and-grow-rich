import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feelingsDialSchema, type FeelingsDial } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Pause, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/session-context";

const emotions = [
  { key: "anger", label: "Anger", color: "text-red-500" },
  { key: "sadness", label: "Sadness", color: "text-blue-500" },
  { key: "guilt", label: "Guilt", color: "text-yellow-600" },
  { key: "shame", label: "Shame", color: "text-purple-500" },
  { key: "fear", label: "Fear", color: "text-orange-500" },
  { key: "joy", label: "Joy", color: "text-green-500" },
] as const;

export default function FeelingsDial() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [sitComplete, setSitComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { updateSessionData, currentSession } = useSession();

  const form = useForm<FeelingsDial>({
    resolver: zodResolver(feelingsDialSchema),
    defaultValues: {
      emotions: {
        anger: 5,
        sadness: 5,
        guilt: 5,
        shame: 5,
        fear: 5,
        joy: 5,
      },
      reflections: "",
    },
  });

  useEffect(() => {
    if (currentSession?.feelingsDial) {
      form.reset({
        emotions: currentSession.feelingsDial.emotions,
        reflections: currentSession.feelingsDial.reflections || "",
      });
    }
  }, [currentSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setSitComplete(true);
            toast({
              title: "90-Second Sit Complete",
              description: "Take a moment to notice how you feel.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, toast]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(90);
    setSitComplete(false);
  };

  const onSubmit = async (data: FeelingsDial) => {
    setIsSaving(true);
    try {
      const dataWithTimestamp = {
        ...data,
        sitCompletedAt: sitComplete ? new Date().toISOString() : undefined,
      };
      await updateSessionData({ feelingsDial: dataWithTimestamp });
      toast({
        title: "Feelings Recorded",
        description: "Your emotional state has been saved.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your feelings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const progress = ((90 - timeLeft) / 90) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Feelings Dial
          </h1>
          <p className="text-muted-foreground">
            Rate your emotions and complete a 90-second mindfulness sit
          </p>
        </div>

        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              90-Second Mindfulness Sit
            </CardTitle>
            <CardDescription>
              Sit quietly and observe your emotions without judgment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-border"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                    className="text-primary transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-heading font-bold">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {sitComplete ? "Complete!" : timerRunning ? "Breathe..." : "Ready"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                onClick={toggleTimer}
                disabled={sitComplete}
                data-testid="button-timer-toggle"
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {timeLeft === 90 ? "Start" : "Resume"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={resetTimer}
                data-testid="button-timer-reset"
              >
                Reset
              </Button>
            </div>

            {sitComplete && (
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <CheckCircle className="w-4 h-4" />
                <span>Mindfulness sit completed</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Rate Your Emotions</CardTitle>
                <CardDescription>
                  On a scale of 0-10, how intensely do you feel each emotion?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {emotions.map((emotion) => (
                  <FormField
                    key={emotion.key}
                    control={form.control}
                    name={`emotions.${emotion.key}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel className={`text-base ${emotion.color}`}>
                            {emotion.label}
                          </FormLabel>
                          <span className="text-2xl font-bold w-12 text-right">
                            {field.value}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            data-testid={`slider-${emotion.key}`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Reflections</CardTitle>
                <CardDescription>
                  What insights arose during your sit?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="reflections"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your reflections and observations..."
                          className="min-h-[150px] resize-none"
                          {...field}
                          data-testid="textarea-reflections"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={isSaving} data-testid="button-save-feelings">
              {isSaving ? "Saving..." : "Save Feelings"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
