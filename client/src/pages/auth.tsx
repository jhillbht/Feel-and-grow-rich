import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logoImage from "@assets/SoA Icon@4x_1760406141314.png";
import { Github, Mail, Apple } from "lucide-react";
import { SiGoogle } from "react-icons/si";

export default function AuthPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={logoImage} 
              alt="Science of Abundance" 
              className="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="font-heading text-3xl font-semibold mb-2 text-foreground">
            Feel and Grow Rich
          </h1>
          <p className="text-muted-foreground text-lg">
            Your journey to wealth, worthiness & abundance
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-heading">Welcome Back</CardTitle>
            <CardDescription>
              Please sign in to continue your transformation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full"
              size="lg"
              data-testid="button-login"
            >
              Sign In with Replit
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Supports Google, GitHub, Apple & more
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center justify-center p-3 rounded-md border bg-muted/50">
                <SiGoogle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-center p-3 rounded-md border bg-muted/50">
                <Github className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-center p-3 rounded-md border bg-muted/50">
                <Apple className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-center p-3 rounded-md border bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
