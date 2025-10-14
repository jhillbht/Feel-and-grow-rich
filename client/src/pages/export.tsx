import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      toast({
        title: "Export Started",
        description: "Your JSON export is being prepared...",
      });
      
      const response = await fetch("/api/export/json");
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feel-and-grow-rich-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Complete",
        description: "Your JSON file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      toast({
        title: "Export Started",
        description: "Your Excel export is being prepared...",
      });
      
      const response = await fetch("/api/export/excel");
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feel-and-grow-rich-export-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Complete",
        description: "Your Excel file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Export Your Data
          </h1>
          <p className="text-muted-foreground">
            Download your session data in your preferred format
          </p>
        </div>

        <Card className="mb-6 bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your data includes all completed assessments, reflections, and insights from your 
              wealth and worthiness journey. Export formats preserve all your information for personal records 
              and tracking your prosperity transformation.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover-elevate active-elevate-2 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileJson className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-heading">JSON Export</CardTitle>
              <CardDescription>
                Raw data format for maximum flexibility and programmatic access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Format</span>
                  <span className="font-medium">.json</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Use case</span>
                  <span className="font-medium">Data backup</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Size</span>
                  <span className="font-medium">~5-10 KB</span>
                </div>
              </div>
              <Button 
                onClick={handleExportJSON} 
                disabled={isExporting} 
                className="w-full"
                data-testid="button-export-json"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate active-elevate-2 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6 text-chart-2" />
              </div>
              <CardTitle className="font-heading">Excel Export</CardTitle>
              <CardDescription>
                Spreadsheet format for easy viewing and analysis in Excel or Google Sheets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Format</span>
                  <span className="font-medium">.xlsx</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Use case</span>
                  <span className="font-medium">Data analysis</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Size</span>
                  <span className="font-medium">~10-20 KB</span>
                </div>
              </div>
              <Button 
                onClick={handleExportExcel} 
                disabled={isExporting} 
                className="w-full"
                data-testid="button-export-excel"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              ✓ Your data is exported directly to your device
            </p>
            <p>
              ✓ No data is sent to external servers during export
            </p>
            <p>
              ✓ Files are not encrypted - store them securely
            </p>
            <p>
              ✓ You can delete exported files anytime from your device
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
