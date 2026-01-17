import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-white/5 bg-card shadow-lg">
        <CardContent className="pt-8 pb-6 flex flex-col items-center text-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />

          <h1 className="text-2xl font-display font-extrabold text-foreground">
            Page not found
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you’re looking for doesn’t exist or was moved.
          </p>

          <Link href="/">
            <Button className="mt-4 gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
