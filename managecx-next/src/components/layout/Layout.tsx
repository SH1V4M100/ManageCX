'use client'
import React, { ReactNode } from 'react';
import Navbar from '../Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;