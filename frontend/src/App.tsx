// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchPage } from './pages/SearchPage';
import { ExplorePage } from './pages/ExplorePage';
import { FrameworkExplorer } from './components/explore/FrameworkExplorer';
import { Layout } from './components/layout/Layout';
import { ProfilePage } from './pages/ProfilePage';

const queryClient = new QueryClient();

function App() {
  const resetSearch = () => {
    queryClient.invalidateQueries('search');
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout resetSearch={resetSearch}>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/explore/:framework" element={<FrameworkExplorer />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;