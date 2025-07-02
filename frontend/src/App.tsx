import { useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './layout/Layout';
import Dashboard from './views/Dashboard';

function App() {
  // Set page title and description for better accessibility
  useEffect(() => {
    document.title = 'EV Charging Simulation';
    
    // Add meta description if it doesn't exist
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'EV Charging Simulation tool for analyzing electric vehicle charging patterns and power distribution');
  }, []);

  return (
    <ErrorBoundary>
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-teal-700 focus:text-white focus:outline-none"
      >
        Skip to content
      </a>
      <Layout>
        <Dashboard />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
