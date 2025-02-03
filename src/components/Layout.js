import React from 'react';
import { Link } from 'gatsby';
import { useCategories } from '../hooks/useCategories';

export const Layout = ({ children }) => {
  const categories = useCategories();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <nav className="p-4 bg-white shadow">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            NeuroExplorer
          </Link>
          <div className="space-x-4">
            {categories.map(cat => (
              <Link 
                key={cat.id}
                to={`/category/${cat.id}`}
                className="px-3 py-2 rounded hover:bg-purple-100"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}; 