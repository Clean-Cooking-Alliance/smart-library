import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

interface LayoutProps {
  resetSearch: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, resetSearch }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-6 flex items-center justify-between">
          <a className="text-3xl font-bold text-gray-900" href="/" onClick={resetSearch}>
            Clean Cooking Smart Library
          </a>
          <div className="flex space-x-4 items-center">
            <User className="w-6 h-6 text-#042449 fill-current cursor-pointer" onClick={() => navigate('/profile')} />
            <button onClick={() => navigate('/admin')} className="text-#042449">Admin</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500">
            Clean Cooking Smart Library © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};