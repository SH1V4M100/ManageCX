import React from 'react';
import { Users } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Users className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">ManageCX</span>
          </div>
          
          <div>
            <p className="text-gray-400">© {new Date().getFullYear()} Concentrix. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;