import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { intakeDataSchema, type IntakeData } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProgressStepper } from "@/components/progress-stepper";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/session-context";

const steps = [
  { label: "Personal Info", completed: false },
  { label: "Birth Data", completed: false },
  { label: "Consent", completed: false },
  { label: "Life Conditions", completed: false },
  { label: "Loop to Break", completed: false },
];

export default function IntakeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { updateSessionData, currentSession } = useSession();

  const form = useForm<IntakeData>({
    resolver: zodResolver(intakeDataSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      consent: false,
      conditionsOfLife: "",
      loopToBreak: "",
    },
  });

  useEffect(() => {
    if (currentSession?.intake) {
      form.reset(currentSession.intake);
    }
  }, [currentSession]);

  const onSubmit = async (data: IntakeData) => {
    setIsSaving(true);
    try {
      await updateSessionData({ intake: data });
      setIsComplete(true);
      toast({
        title: "Intake Complete",
        description: "Your intake assessment has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your intake data.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields as any);
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof IntakeData)[] => {
    switch (step) {
      case 0: return ["name"];
      case 1: return ["birthDate", "birthTime", "birthPlace"];
      case 2: return ["consent"];
      case 3: return ["conditionsOfLife"];
      case 4: return ["loopToBreak"];
      default: return [];
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-heading text-2xl">Intake Complete!</CardTitle>
            <CardDescription className="mt-2">
              Thank you for completing your intake assessment. Your information has been saved securely.
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
            Intake Assessment
          </h1>
          <p className="text-muted-foreground">
            Please provide the following information to begin your journey
          </p>
        </div>

        <ProgressStepper steps={steps} currentStep={currentStep} />

        <Card className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-heading">{steps[currentStep].label}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {currentStep === 0 && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormDescription>
                          This helps us personalize your experience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {currentStep === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-birth-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Time (Optional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} data-testid="input-birth-time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Place (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="City, State/Country" {...field} data-testid="input-birth-place" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 2 && (
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-consent"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I consent to participate in this therapeutic journey
                          </FormLabel>
                          <FormDescription>
                            By checking this box, you acknowledge that this is a self-guided therapeutic tool 
                            and does not replace professional mental health care.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {currentStep === 3 && (
                  <FormField
                    control={form.control}
                    name="conditionsOfLife"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Conditions of Life</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your current life situation, challenges, and what brings you here..."
                            className="min-h-[200px] resize-none"
                            {...field}
                            data-testid="textarea-conditions"
                          />
                        </FormControl>
                        <FormDescription>
                          Share as much or as little as feels comfortable
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {currentStep === 4 && (
                  <FormField
                    control={form.control}
                    name="loopToBreak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loop You Want to Break</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any patterns, cycles, or loops you'd like to break free from..."
                            className="min-h-[200px] resize-none"
                            {...field}
                            data-testid="textarea-loop"
                          />
                        </FormControl>
                        <FormDescription>
                          This could be a thought pattern, behavior, or emotional cycle
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>

              <div className="flex justify-between p-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  data-testid="button-previous"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSaving}
                  data-testid="button-next"
                >
                  {isSaving ? "Saving..." : currentStep === steps.length - 1 ? "Complete" : "Next"}
                  {currentStep !== steps.length - 1 && !isSaving && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
