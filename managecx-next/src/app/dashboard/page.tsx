'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import MyRoster from '@/components/MyRoster';
import TeamMembers from '@/components/TeamMembers';
import Navbar from '@/components/Navbar';
type ViewType = 'my-roster' | 'team-members';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('my-roster');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#003D5B] to-[#25E2CC] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Roster Manager</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                Welcome back, John Doe
              </div>
            </div>
          </div>
        </div>
      </header> */}
      <Navbar/>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveView('my-roster')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeView === 'my-roster'
                  ? 'border-[#25E2CC] text-[#003D5B]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>My Roster</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('team-members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeView === 'team-members'
                  ? 'border-[#25E2CC] text-[#003D5B]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team Members</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'my-roster' && <MyRoster />}
        {activeView === 'team-members' && <TeamMembers />}
      </main>
    </div>
  );
};

export default Dashboard;