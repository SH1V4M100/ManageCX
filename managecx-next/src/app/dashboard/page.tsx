'use client'
import React, { useState, useMemo } from 'react';
import { Users, Calendar, Search, UserCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import RosterCard from '@/components/RosterCard';
import DateRangePicker from '@/components/DateRangePicker';
import SearchBar from '@/components/SearchBar';
import EmployeeList from '@/components/EmployeeList';
import ViewToggle from '@/components/ViewToggle';
import { DateRange } from './types/roster';
import { mockRosterData, mockEmployees, currentUser } from './data/mockData';

function App() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2024-01-15',
    endDate: '2024-01-16'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('rosters');

  const viewOptions = [
    { value: 'rosters', label: 'All Rosters' },
    { value: 'my-roster', label: 'My Roster' },
    { value: 'employees', label: 'All Employees' },
    { value: 'immediate-reports', label: 'Immediate Reports' }
  ];

  // Filter roster data based on current filters
  const filteredRosterData = useMemo(() => {
    let filtered = [...mockRosterData];

    // Filter by date range
    filtered = filtered.filter(roster => {
      const rosterDate = new Date(roster.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return rosterDate >= startDate && rosterDate <= endDate;
    });

    // Filter by view type
    if (activeView === 'my-roster') {
      filtered = filtered.filter(roster => roster.empId === currentUser.empId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(roster => 
        roster.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roster.empId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [dateRange, searchTerm, activeView]);

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return mockEmployees;
    return mockEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.empId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const renderContent = () => {
    switch (activeView) {
      case 'employees':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6\" style={{ color: '#2563eb' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'black' }}>
                All Employees
              </h2>
            </div>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search employees by name or ID..."
            />
            <EmployeeList employees={filteredEmployees} />
          </div>
        );

      case 'immediate-reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <UserCheck className="w-6 h-6" style={{ color: '#2563eb' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'black' }}>
                Immediate Reports
              </h2>
            </div>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search immediate reports..."
            />
            <EmployeeList 
              employees={filteredEmployees} 
              showOnlyImmediate={true} 
            />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
            <div className="flex items-center gap-2 pl-2">
              <Calendar 
                className="w-6 h-6 " 
                style={{ color: '#2563eb' }} // explicit blue (primary-600)
              />
              <h2 
                className="text-xl font-semibold" 
                style={{ color: '#000000' }} // explicit black
              >
                {activeView === 'my-roster' ? 'My Roster' : 'Team Rosters'}
              </h2>
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRosterData.map((roster) => (
                <RosterCard key={roster.id} roster={roster} />
              ))}
            </div>

            {filteredRosterData.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--gray-400)' }} />
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--gray-600)' }}>
                  No rosters found
                </p>
                <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
                  Try adjusting your search criteria or date range
                </p>
              </div>
            )}
          </div>
        );
    }
  };

return (
  <div className="min-h-screen bg-gray-100">
    {/* Navbar */}
    <Navbar />

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-10 py-2">
      <div className="rounded-lg p-6 card-shadow">
        <div className="mb-6">
          <ViewToggle
            activeView={activeView}
            onViewChange={setActiveView}
            options={viewOptions}
          />
        </div>

        {renderContent()}
      </div>
    </main>
  </div>
);

}
export default App;