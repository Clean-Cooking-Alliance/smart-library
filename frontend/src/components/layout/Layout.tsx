import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookmarkIcon, PersonIcon } from '@radix-ui/react-icons';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-6 flex items-center justify-around">
          <h1 className="text-3xl font-bold text-gray-900">Clean Cooking Smart Library</h1>
          {/* Navigation */}
          <Tabs defaultValue={location.pathname === '/' ? 'search' : 'explore'} className="w-half max-w-md">
            <TabsList className="flex space-x-4">
              <TabsTrigger
                value="search"
                onClick={() => navigate('/')}
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="explore"
                onClick={() => navigate('/explore')}
              >
                Explore
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex space-x-4 items-center">
            <BookmarkIcon className="w-6 h-6 text-blue-600" />
            <PersonIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </header>


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