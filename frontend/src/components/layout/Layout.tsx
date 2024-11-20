import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Clean Cooking Smart Library</h1>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Tabs defaultValue={location.pathname === '/' ? 'search' : 'explore'} className="w-full">
          <TabsList>
            <TabsTrigger 
              value="search" 
              onClick={() => navigate('/')}
            >
              Focus Mode
            </TabsTrigger>
            <TabsTrigger 
              value="explore" 
              onClick={() => navigate('/explore')}
            >
              Explore Mode
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500">
            Clean Cooking Smart Library © 2024
          </p>
        </div>
      </footer>
    </div>
  );
};