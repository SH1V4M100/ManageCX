import React from 'react';

interface ViewToggleProps {
  activeView: string;
  onViewChange: (view: string) => void;
  options: { value: string; label: string }[];
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onViewChange, options }) => {
  return (
    <div className="flex bg-white rounded-lg p-1 card-shadow">
      {options.map((option) => {
        const isActive = activeView === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onViewChange(option.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white'
              }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};


export default ViewToggle;