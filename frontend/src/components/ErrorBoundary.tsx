import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-gray-100 p-4" 
          role="alert" 
          aria-live="assertive"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full border-l-4 border-teal-700">
            <h2 
              id="error-boundary-title" 
              className="text-2xl font-bold text-teal-800 mb-4"
            >
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We're sorry, but an error occurred while rendering the application. 
              Please try reloading the page or contact support if the issue persists.
            </p>
            
            <details className="mb-6">
              <summary className="cursor-pointer text-teal-700 hover:text-teal-800 font-medium">
                Error details
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </details>
            
            <div className="flex justify-center">
              <button
                onClick={this.handleReload}
                className="bg-teal-700 hover:bg-teal-800 text-white font-medium py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                aria-label="Reload the page"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}