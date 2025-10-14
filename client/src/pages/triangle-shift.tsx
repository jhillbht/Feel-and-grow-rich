import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { triangleShiftSchema, type TriangleShift } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Triangle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/session-context";

export default function TriangleShiftPage() {
  const [showTransformation, setShowTransformation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { updateSessionData, currentSession } = useSession();

  const form = useForm<TriangleShift>({
    resolver: zodResolver(triangleShiftSchema),
    defaultValues: {
      currentRole: "victim",
      situation: "",
      transformedRole: "creator",
      newPerspective: "",
    },
  });

  useEffect(() => {
    if (currentSession?.triangleShift) {
      form.reset(currentSession.triangleShift);
    }
  }, [currentSession]);

  const currentRole = form.watch("currentRole");
  const transformedRole = form.watch("transformedRole");

  const roleDescriptions = {
    victim: "Feeling powerless, blaming circumstances or others",
    hero: "Rescuing others, taking on their problems",
    persecutor: "Blaming, criticizing, or controlling others",
  };

  const transformedDescriptions = {
    creator: "Taking responsibility and creating solutions",
    coach: "Supporting others while maintaining boundaries",
    challenger: "Holding others accountable with compassion",
  };

  const roleMapping = {
    victim: "creator",
    hero: "coach",
    persecutor: "challenger",
  };

  const onSubmit = async (data: TriangleShift) => {
    setIsSaving(true);
    try {
      await updateSessionData({ triangleShift: data });
      setShowTransformation(true);
      toast({
        title: "Transformation Complete",
        description: "Your perspective shift has been saved.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your transformation.",
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
            Triangle Shift
          </h1>
          <p className="text-muted-foreground">
            Transform from Victim/Hero/Persecutor to Creator/Coach/Challenger
          </p>
        </div>

        <div className="mb-8">
          <Card className="bg-accent/30 border-accent">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <Triangle className="w-5 h-5 text-primary" />
                The Drama Triangle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Drama Triangle represents three roles we unconsciously play in conflict. 
                By identifying your current role and shifting perspective, you can transform 
                these patterns into empowering positions.
              </p>
            </CardContent>
          </Card>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Current Role</CardTitle>
                <CardDescription>
                  Which role do you find yourself playing in this situation?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="currentRole"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          {(["victim", "hero", "persecutor"] as const).map((role) => (
                            <div
                              key={role}
                              className="flex items-start space-x-3 p-4 rounded-lg border hover-elevate transition-all"
                            >
                              <RadioGroupItem value={role} id={role} data-testid={`radio-current-${role}`} />
                              <div className="flex-1">
                                <Label htmlFor={role} className="capitalize font-medium cursor-pointer">
                                  {role}
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {roleDescriptions[role]}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Describe the Situation</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="situation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the situation where you're playing this role..."
                          className="min-h-[150px] resize-none"
                          {...field}
                          data-testid="textarea-situation"
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific about the context and your feelings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">From</p>
                  <Badge variant="outline" className="capitalize text-base px-4 py-2">
                    {currentRole}
                  </Badge>
                </div>
                <ArrowRight className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">To</p>
                  <Badge className="capitalize text-base px-4 py-2">
                    {roleMapping[currentRole as keyof typeof roleMapping]}
                  </Badge>
                </div>
              </div>
            </div>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="font-heading">New Perspective</CardTitle>
                <CardDescription>
                  How would a {roleMapping[currentRole as keyof typeof roleMapping]} approach this situation?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="newPerspective"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={`From the ${roleMapping[currentRole as keyof typeof roleMapping]} perspective...`}
                          className="min-h-[150px] resize-none"
                          {...field}
                          data-testid="textarea-perspective"
                        />
                      </FormControl>
                      <FormDescription>
                        {transformedDescriptions[roleMapping[currentRole as keyof typeof roleMapping] as keyof typeof transformedDescriptions]}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={isSaving} data-testid="button-complete-shift">
              {isSaving ? "Saving..." : "Complete Transformation"}
            </Button>
          </form>
        </Form>

        {showTransformation && (
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-center text-sm text-muted-foreground">
                ✨ Your transformation from <strong>{currentRole}</strong> to <strong>{roleMapping[currentRole as keyof typeof roleMapping]}</strong> has been recorded
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
