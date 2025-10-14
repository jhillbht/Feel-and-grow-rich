import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Heart, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/session-context";

const fears = [
  {
    id: "fear_of_failure",
    label: "Fear of Failure",
    description: "Anxiety about not meeting expectations or making mistakes",
  },
  {
    id: "fear_of_success",
    label: "Fear of Success",
    description: "Worry about the responsibilities and changes success brings",
  },
  {
    id: "fear_of_rejection",
    label: "Fear of Rejection",
    description: "Concern about being rejected or not accepted by others",
  },
  {
    id: "fear_of_abandonment",
    label: "Fear of Abandonment",
    description: "Anxiety about being left alone or losing important relationships",
  },
  {
    id: "fear_of_loss_of_control",
    label: "Fear of Loss of Control",
    description: "Worry about losing control over situations or outcomes",
  },
  {
    id: "fear_of_death",
    label: "Fear of Death",
    description: "Anxiety about mortality and the unknown",
  },
];

export default function SixFears() {
  const [selectedFears, setSelectedFears] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { updateSessionData, currentSession } = useSession();

  useEffect(() => {
    if (currentSession?.sixFears) {
      setSelectedFears(currentSession.sixFears.fears || []);
      setNotes(currentSession.sixFears.notes || {});
    }
  }, [currentSession]);

  const toggleFear = (fearId: string) => {
    setSelectedFears(prev =>
      prev.includes(fearId)
        ? prev.filter(id => id !== fearId)
        : [...prev, fearId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSessionData({
        sixFears: {
          fears: selectedFears as any,
          notes,
        },
      });
      setIsComplete(true);
      toast({
        title: "Assessment Complete",
        description: `You've identified ${selectedFears.length} fear(s) to work with.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your assessment.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const progress = (selectedFears.length / fears.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-heading text-2xl">Assessment Complete</CardTitle>
            <CardDescription className="mt-2">
              You've identified {selectedFears.length} fear(s). Awareness is the first step toward transformation.
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
            Six Fears Assessment
          </h1>
          <p className="text-muted-foreground">
            Identify and explore your core fears to begin the healing process
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Progress
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {selectedFears.length} of {fears.length} explored
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {fears.map((fear) => {
            const isSelected = selectedFears.includes(fear.id);
            
            return (
              <Card
                key={fear.id}
                className={`transition-all ${isSelected ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={fear.id}
                      checked={isSelected}
                      onCheckedChange={() => toggleFear(fear.id)}
                      className="mt-1"
                      data-testid={`checkbox-${fear.id}`}
                    />
                    <div className="flex-1">
                      <Label htmlFor={fear.id} className="text-base font-medium cursor-pointer">
                        {fear.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {fear.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {isSelected && (
                  <CardContent>
                    <Textarea
                      placeholder="Reflect on this fear... When does it arise? How does it affect you?"
                      value={notes[fear.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [fear.id]: e.target.value })}
                      className="min-h-[100px] resize-none"
                      data-testid={`textarea-${fear.id}`}
                    />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSave}
            size="lg"
            disabled={selectedFears.length === 0 || isSaving}
            data-testid="button-save-assessment"
          >
            {isSaving ? "Saving..." : "Save Assessment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
