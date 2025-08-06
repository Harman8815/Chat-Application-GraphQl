"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql/client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RootLayout({ children }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body>
        {isInitialLoading ? (
          <LoadingSpinner />
        ) : (
          <ApolloProvider client={client}>
            <ThemeProvider defaultTheme="system" storageKey="chatlink-ui-theme">
              <AuthProvider>
                <TooltipProvider>
                  <Toaster />
                  {children}
                </TooltipProvider>
              </AuthProvider>
            </ThemeProvider>
          </ApolloProvider>
        )}
      </body>
    </html>
  );
}
