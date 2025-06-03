import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ResponsiveProvider } from "@/contexts/ResponsiveContext";
import { AnimationControllerProvider } from "@/components/AdvancedAnimationController";
import { SmoothScrollIndicator } from "@/components/AdvancedUIEnhancements";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  // Memoize QueryClient to prevent re-creation on every render
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ResponsiveProvider>
            <AnimationControllerProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <SmoothScrollIndicator />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </AnimationControllerProvider>
          </ResponsiveProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
