import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./theme-toggle";
import { 
  Brain, 
  Triangle, 
  Heart, 
  Smile, 
  Mountain, 
  ClipboardList, 
  Download,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/intake", label: "Intake", icon: ClipboardList },
  { path: "/belief-mapper", label: "Belief Mapper", icon: Brain },
  { path: "/triangle-shift", label: "Triangle Shift", icon: Triangle },
  { path: "/six-fears", label: "Six Fears", icon: Heart },
  { path: "/feelings-dial", label: "Feelings Dial", icon: Smile },
  { path: "/hill-overlay", label: "Hill Overlay", icon: Mountain },
  { path: "/daily-10", label: "Daily 10", icon: ClipboardList },
  { path: "/export", label: "Export", icon: Download },
];

export function AppNav() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 font-heading font-semibold text-xl cursor-pointer" data-testid="link-home">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="hidden sm:inline">Inner Journey</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.slice(1, -1).map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                      data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/export">
              <Button variant="outline" size="sm" data-testid="link-export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
