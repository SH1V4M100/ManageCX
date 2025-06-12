import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const AdminCard: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          {icon && (
            <div className="mr-2 text-[#0033a0]">
              {icon}
            </div>
          )}
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        </div>
      </div>
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
