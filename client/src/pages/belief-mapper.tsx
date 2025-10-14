import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/session-context";
import type { BeliefMapItem } from "@shared/schema";

type ItemType = "event" | "belief" | "loop" | "disconnection";

export default function BeliefMapper() {
  const [items, setItems] = useState<BeliefMapItem[]>([]);
  const [newItemContent, setNewItemContent] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType>("event");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { updateSessionData, currentSession } = useSession();

  useEffect(() => {
    if (currentSession?.beliefMap?.items) {
      setItems(currentSession.beliefMap.items);
    }
  }, [currentSession]);

  const typeColors = {
    event: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    belief: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    loop: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    disconnection: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  };

  const addItem = () => {
    if (newItemContent.trim()) {
      const newItem: BeliefMapItem = {
        id: Date.now().toString(),
        type: selectedType,
        content: newItemContent,
        connectedTo: [],
      };
      setItems([...items, newItem]);
      setNewItemContent("");
      toast({
        title: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Added`,
        description: "Item added to your belief map",
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const saveMap = async () => {
    setIsSaving(true);
    try {
      await updateSessionData({ beliefMap: { items } });
      toast({
        title: "Belief Map Saved",
        description: "Your belief map has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your belief map.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Belief Mapper
          </h1>
          <p className="text-muted-foreground">
            Map events to beliefs, identify loops, and explore disconnections
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Add New Item</CardTitle>
              <CardDescription>
                Build your belief map step by step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["event", "belief", "loop", "disconnection"] as ItemType[]).map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className="capitalize"
                      data-testid={`button-type-${type}`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-content">Content</Label>
                <Input
                  id="item-content"
                  placeholder={`Describe the ${selectedType}...`}
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  data-testid="input-belief-content"
                />
              </div>

              <Button onClick={addItem} className="w-full" data-testid="button-add-item">
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedType}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-xl">Your Belief Map</CardTitle>
                  <CardDescription className="mt-1">
                    {items.length} items mapped
                  </CardDescription>
                </div>
                <Button onClick={saveMap} disabled={items.length === 0 || isSaving} data-testid="button-save-map">
                  {isSaving ? "Saving..." : "Save Map"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <LinkIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    No items yet. Start adding events, beliefs, loops, and disconnections.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border ${typeColors[item.type]} transition-all hover-elevate`}
                      data-testid={`item-${item.type}-${item.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="capitalize text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed">{item.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="hover-elevate"
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
