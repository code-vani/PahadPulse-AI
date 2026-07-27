"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
          <h2 className="text-2xl font-display font-semibold text-brand mb-2">
            Something went wrong.
          </h2>
          <p className="text-muted mb-4">Please refresh the page, or try again shortly.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand text-background px-5 py-2 rounded-full font-semibold"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}