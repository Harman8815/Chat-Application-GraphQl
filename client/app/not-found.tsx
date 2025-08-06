"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground transition-colors duration-500">
      <Card className="w-full max-w-md mx-4 border-border">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm opacity-80">
            The page you are looking for doesn't exist or was moved.
          </p>

          <div className="mt-6">
            <Button onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
