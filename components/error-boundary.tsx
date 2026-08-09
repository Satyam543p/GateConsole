"use client"

/**
 * components/error-boundary.tsx
 *
 * React error boundary for storage quota / corrupt JSON errors.
 * Shows a recoverable error UI instead of a white screen.
 * Never hides the "Export what you can" escape hatch.
 */

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class StorageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[StorageErrorBoundary]", error, info)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    const isStorage =
      this.state.error?.message?.includes("quota") ||
      this.state.error?.message?.includes("JSON") ||
      this.state.error?.message?.includes("localStorage")

    return (
      <div
        role="alert"
        className="mx-auto max-w-xl mt-16 p-6 border border-destructive bg-card"
      >
        <p className="font-mono text-[11px] tracking-[0.2em] text-destructive uppercase">
          storage error
        </p>
        <h2 className="mt-3 text-lg font-semibold">
          {isStorage
            ? "Your browser storage has an issue"
            : "Something went wrong"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isStorage
            ? "This is usually a quota overflow or corrupt data. Export what you can, then clear browser storage and re-import your backup."
            : this.state.error?.message ?? "An unexpected error occurred."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/settings"
            className="border border-primary bg-primary/10 px-3 py-1.5 font-mono text-[11px] tracking-wide text-primary hover:bg-primary/20 transition-colors"
          >
            Go to Settings / Export
          </a>
          <button
            type="button"
            onClick={this.handleReset}
            className="border border-border px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          >
            Try again
          </button>
        </div>
        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-4 text-[10px] text-muted-foreground overflow-auto max-h-40 p-2 bg-muted">
            {this.state.error?.stack}
          </pre>
        )}
      </div>
    )
  }
}
