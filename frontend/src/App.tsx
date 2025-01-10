import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchPage } from './pages/SearchPage';
import { Layout } from './components/layout/Layout';
import { ProfilePage } from './pages/ProfilePage';
import { AdminApp } from '../test-admin/src/App';

const queryClient = new QueryClient();

function App() {
  const resetSearch = () => {
    queryClient.invalidateQueries({ queryKey: ['search'] });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout resetSearch={resetSearch}>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;