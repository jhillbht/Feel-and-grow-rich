import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./theme-toggle";
import { 
  Triangle, 
  Heart, 
  Smile, 
  Mountain, 
  ClipboardList, 
  Download,
  Home,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/SoA Icon@4x_1760406141314.png";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/intake", label: "Intake", icon: ClipboardList },
  { path: "/belief-mapper", label: "Belief Mapper", icon: TrendingUp },
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
              <div className="flex items-center cursor-pointer" data-testid="link-home">
                <img 
                  src={logoImage} 
                  alt="Science of Abundance" 
                  className="h-10 w-10 object-contain"
                />
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
