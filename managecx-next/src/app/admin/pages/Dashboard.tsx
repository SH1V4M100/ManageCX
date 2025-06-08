import React from 'react';
import { useSession } from 'next-auth/react';
import UploadEmployeeData from '@/components/UploadEmployeeData';
import UploadRosterData from '@/components/UploadRosterData';

const AdminPanel: React.FC = () => {
  const { data: session, status } = useSession();

  const user = session?.user as { name?: string; email?: string; role?: string }; // typecast for role support

  if (status === 'loading') {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          ></path>
        </svg>
        <p className="text-gray-600 text-sm">Loading, please wait...</p>
      </div>
    </div>
  );
}

if (!user) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md text-center max-w-md">
        <strong className="block text-lg mb-2">Access Denied</strong>
        <p className="mb-4">You must be signed in to view this page.</p>
        
      </div>
    </div>
  );
}

  // Simple helper function to check roles
  const hasRole = (roles: string | string[]) => {
    if (!user.role) return false;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your employee data and roster schedules
        </p>
      </div>

      <div className="space-y-6">
        {hasRole('admin') && (
          <div className="fade-in">
            <UploadEmployeeData />
          </div>
        )}

        {hasRole(['admin', 'wfm']) && (
          <div className="fade-in">
            <UploadRosterData />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
