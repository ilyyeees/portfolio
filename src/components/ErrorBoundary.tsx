import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with error logging services here
      // e.g., Sentry, LogRocket, etc.
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-destructive/20 shadow-lg">
              <CardHeader className="text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="mx-auto mb-4"
                >
                  <AlertTriangle className="h-16 w-16 text-destructive" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-destructive">
                  Oops! Something went wrong
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  We encountered an unexpected error. Don't worry, it's not your fault!
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 p-3 bg-muted rounded-md text-sm">
                    <summary className="cursor-pointer font-medium mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="space-y-2">
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-xs">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    </div>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={this.handleRetry}
                    className="flex-1 flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  If this problem persists, please contact support.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
