import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  
  return (
    <aside 
      className={`bg-primary-700 text-white fixed inset-y-0 left-0 z-40 transition-all duration-300 transform ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0 md:w-20'
      } md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-primary-600">
        <div className="flex items-center">
          {isOpen ? (
            <h1 className="text-xl font-bold">ManageCX</h1>
          ) : (
            <h1 className="text-xl font-bold">MCX</h1>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md md:block hidden hover:bg-primary-600"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          <SidebarItem icon={<Home size={20} />} label="Dashboard" isOpen={isOpen} />
          
          <SidebarItem icon={<Upload size={20} />} label="Upload Data" isOpen={isOpen} isActive={true} />
          
          <SidebarItem icon={<Calendar size={20} />} label="Roster" isOpen={isOpen} />
          
          <SidebarItem icon={<Users size={20} />} label="Employees" isOpen={isOpen} />
          
          <SidebarItem icon={<FileText size={20} />} label="Reports" isOpen={isOpen} />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <SidebarItem icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
        </div>
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  isOpen,
  isActive = false
}) => {
  return (
    <div 
      className={`flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors ${
        isActive 
          ? 'bg-primary-800 text-white' 
          : 'text-primary-100 hover:bg-primary-600 hover:text-white'
      }`}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      {isOpen && (
        <span className="ml-3 text-sm font-medium">{label}</span>
      )}
    </div>
  );
};

export default Sidebar;