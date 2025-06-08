import React from 'react';
import { Clock, Calendar, User, Coffee } from 'lucide-react';
import { RosterEntry } from '@/app/dashboard/types/roster';

interface RosterCardProps {
  roster: RosterEntry;
}

const RosterCard: React.FC<RosterCardProps> = ({ roster }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'WO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <Clock className="w-4 h-4" />;
      case 'Leave':
        return <Coffee className="w-4 h-4" />;
      case 'WO':
        return <Calendar className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div 
  className="bg-white rounded-lg p-6 border card-shadow hover:card-shadow-hover transition-all duration-200 hover:-translate-y-1 border-gray-200"
>
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="font-semibold text-lg text-black">
        {roster.empName}
      </h3>
      <p className="text-sm text-gray-500">
        {roster.empId}
      </p>
    </div>
    <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(roster.status)}`}>
      {getStatusIcon(roster.status)}
      {roster.status}
    </div>
  </div>

  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-600">
        {roster.day}, {new Date(roster.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}
      </span>
    </div>

    {roster.status === 'Present' && roster.loginTime && roster.logoutTime && (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-600">
            In: {roster.loginTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-600">
            Out: {roster.logoutTime}
          </span>
        </div>
      </div>
    )}

    {roster.status === 'Leave' && roster.leaveType && (
      <div className="flex items-center gap-2">
        <Coffee className="w-4 h-4 text-yellow-500" />
        <span className="text-sm text-gray-600">
          {roster.leaveType}
        </span>
      </div>
    )}
  </div>
</div>
  );
};

export default RosterCard;