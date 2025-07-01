import ErrorBoundary from './components/ErrorBoundary';
import Layout from './layout/Layout';
import Dashboard from './views/Dashboard';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Dashboard />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
