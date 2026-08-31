import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null
  };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
  }
  handleReload = () => {
    window.location.reload();
  };
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-600">
                An unexpected interface error occurred. Don't worry, your data and donations are secure.
              </p>
              {this.state.error && <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-700 text-left overflow-auto max-h-32">
                  {this.state.error.message}
                </div>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
        onClick={this.handleReset}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-900 text-white font-semibold rounded-xl text-sm hover:bg-purple-800 transition-colors shadow-sm"
      >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
        onClick={this.handleReload}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 transition-colors"
      >
                <Home className="w-4 h-4" />
                Reload App
              </button>
            </div>
          </div>
        </div>;
    }
    return this.props.children;
  }
}
export {
  ErrorBoundary
};