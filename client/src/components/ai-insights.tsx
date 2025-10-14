import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useSession } from "@/lib/session-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AIResponse } from "@shared/schema";

export function AIInsights() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const { currentSession } = useSession();
  const { toast } = useToast();

  const aiMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const res = await apiRequest("POST", "/api/respond", {
        context: currentSession,
        question: userPrompt,
      });
      return await res.json();
    },
    onSuccess: (data: AIResponse) => {
      setAiResponse(data);
      setPrompt("");
    },
    onError: () => {
      toast({
        title: "AI Request Failed",
        description: "There was an error getting AI insights.",
        variant: "destructive",
      });
    },
  });

  const handleAskAI = () => {
    if (prompt.trim()) {
      aiMutation.mutate(prompt);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
          size="icon"
          data-testid="button-ai-insights"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Abundance Insights
          </DialogTitle>
          <DialogDescription>
            Ask for wealth consciousness guidance, prosperity insights, or abundance reflections based on your session data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Ask me about your patterns, get suggestions, or request insights..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-ai-prompt"
            />
            <Button
              onClick={handleAskAI}
              disabled={!prompt.trim() || aiMutation.isPending}
              className="w-full"
              data-testid="button-submit-prompt"
            >
              {aiMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Insights
                </>
              )}
            </Button>
          </div>

          {aiResponse && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <p className="text-sm leading-relaxed">{aiResponse.response}</p>
                </div>

                {aiResponse.insights && (
                  <div>
                    <h4 className="font-semibold mb-2">Key Insights</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {aiResponse.insights}
                    </p>
                  </div>
                )}

                {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Suggestions</h4>
                    <ul className="space-y-2">
                      {aiResponse.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
