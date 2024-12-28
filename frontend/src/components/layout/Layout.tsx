import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bookmark, User } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode;
  resetSearch: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, resetSearch }) => {
  // const navigate = useNavigate();
  // const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-6 flex items-center justify-between">
        <a className="text-3xl font-bold text-gray-900" href="/" onClick={resetSearch}>
          Clean Cooking Smart Library
        </a>          
    {/* Navigation */}
          {/* <Tabs defaultValue={location.pathname === '/' ? 'search' : 'explore'} className="w-half max-w-md">
            <TabsList className="flex">
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
          </Tabs> */}
          <div className="flex space-x-4 items-center">
            <Bookmark className="w-6 h-6 text-blue-600 fill-current"/>
            <User className="w-6 h-6 text-blue-600 fill-current" />
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