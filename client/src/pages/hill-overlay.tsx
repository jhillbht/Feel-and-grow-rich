import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hillOverlaySchema, type HillOverlay } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mountain, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/session-context";

const principles = [
  "Authenticity",
  "Courage",
  "Compassion",
  "Growth",
  "Presence",
  "Gratitude",
  "Resilience",
  "Connection",
  "Purpose",
  "Balance",
];

export default function HillOverlayPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { updateSessionData, currentSession } = useSession();

  const form = useForm<HillOverlay>({
    resolver: zodResolver(hillOverlaySchema),
    defaultValues: {
      principle: "",
      microAction: "",
      commitment: "",
    },
  });

  useEffect(() => {
    if (currentSession?.hillOverlay) {
      form.reset(currentSession.hillOverlay);
    }
  }, [currentSession]);

  const selectedPrinciple = form.watch("principle");

  const onSubmit = async (data: HillOverlay) => {
    setIsSaving(true);
    try {
      await updateSessionData({ hillOverlay: data });
      toast({
        title: "Commitment Recorded",
        description: `Your micro-action for ${data.principle} has been saved.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your commitment.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Hill Overlay
          </h1>
          <p className="text-muted-foreground">
            Choose a guiding principle and commit to a micro-action
          </p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              The Hill Principle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The hill represents your journey. At the top stands a principle you want to embody. 
              The micro-action is your first step up the hill. Small, consistent actions lead to 
              meaningful transformation.
            </p>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Select Your Principle</CardTitle>
                <CardDescription>
                  Which principle do you want to cultivate in your life?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="principle"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger data-testid="select-principle">
                            <SelectValue placeholder="Choose a principle..." />
                          </SelectTrigger>
                          <SelectContent>
                            {principles.map((principle) => (
                              <SelectItem key={principle} value={principle} data-testid={`option-${principle.toLowerCase()}`}>
                                {principle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {selectedPrinciple && (
              <>
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Your Micro-Action
                    </CardTitle>
                    <CardDescription>
                      What small, specific action will you take to embody {selectedPrinciple.toLowerCase()}?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="microAction"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., Speak my truth in one conversation today"
                              {...field}
                              data-testid="input-micro-action"
                            />
                          </FormControl>
                          <FormDescription>
                            Make it small enough to do today, specific enough to know when you've done it
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Commitment Statement</CardTitle>
                    <CardDescription>
                      Deepen your commitment with a personal statement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="commitment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="I commit to..."
                              className="min-h-[120px] resize-none"
                              {...field}
                              data-testid="textarea-commitment"
                            />
                          </FormControl>
                          <FormDescription>
                            Optional: Write a commitment statement to strengthen your intention
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" size="lg" disabled={isSaving} data-testid="button-save-commitment">
                  {isSaving ? "Saving..." : "Save My Commitment"}
                </Button>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
