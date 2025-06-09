'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Calendar, Search, UserCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import RosterCard from '@/components/RosterCard';
import DateRangePicker from '@/components/DateRangePicker';
import SearchBar from '@/components/SearchBar';
import ViewToggle from '@/components/ViewToggle';
import { DateRange } from './types/roster';

interface RosterEntry {
  date: string;
  day: string;
  login_time: string | null;
  logout_time: string | null;
  status: 'Present' | 'Leave' | 'WO';
}

interface EmployeeRosterAPIResponse {
  employee_number: number;
  full_name: string;
  email: string;
  roster: (RosterEntry | Record<string, never>)[];
}

interface FlattenedRoster {
  empId: string;
  empName: string;
  email: string;
  date: string;
  day: string;
  login_time: string | null;
  logout_time: string | null;
  status: 'Present' | 'Leave' | 'WO';
}

interface Subordinate {
  employee_number: number;
  full_name: string;
  relationship: string;
}

function App() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAuthenticated = !!session;

  const getDefaultDateRange = (): DateRange => {
    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);

    const formatDate = (date: Date): string =>
      date.toISOString().split('T')[0];

    return {
      startDate: formatDate(today),
      endDate: formatDate(oneMonthLater),
    };
  };

  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('rosters');
  const [rosterData, setRosterData] = useState<FlattenedRoster[]>([]);
  const [directReports, setDirectReports] = useState<Subordinate[]>([]);

  // Fetch roster data
  useEffect(() => {
    const fetchRosterData = async () => {
      try {
        const response = await fetch('/api/subtree');
        const data: EmployeeRosterAPIResponse[] = await response.json();

        const flattened: FlattenedRoster[] = data.flatMap((employee) =>
          employee.roster
  .filter((entry): entry is RosterEntry => !!entry.date)
  .map((entry): FlattenedRoster => {
    const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"

    return {
      empId: String(employee.employee_number),
      empName: employee.full_name,
      email: employee.email,
      date: entry.date,
      day: day,
      login_time: entry.login_time,
      logout_time: entry.logout_time,
      status: entry.status,
    };
  })

        );
        console.log(flattened)
        setRosterData(flattened);
      } catch (err) {
        console.error('Failed to fetch roster data', err);
      }
    };

    fetchRosterData();
  }, []);

  // Fetch immediate subordinates
  useEffect(() => {
    const fetchDirectReports = async () => {
      try {
        const response = await fetch('/api/immediate-subordinates');
        const data: Subordinate[] = await response.json();
        setDirectReports(data);
      } catch (err) {
        console.error('Failed to fetch direct reports', err);
      }
    };

    fetchDirectReports();
  }, []);

  const viewOptions = [
    { value: 'rosters', label: 'All Rosters' },
    { value: 'my-roster', label: 'My Roster' },
    { value: 'immediate-reports', label: 'Immediate Reports' },
  ];

  const filteredRosterData = useMemo(() => {
    let filtered = [...rosterData];

    // Filter by date range
    filtered = filtered.filter((roster) => {
      const rosterDate = new Date(roster.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return rosterDate >= startDate && rosterDate <= endDate;
    });

    // My Roster
    if (activeView === 'my-roster') {
      filtered = filtered.filter((roster) => roster.empId === user?.id);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (roster) =>
          roster.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          roster.empId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [rosterData, dateRange, searchTerm, activeView, user?.id]);

  const renderContent = () => {
    switch (activeView) {
      case 'immediate-reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <UserCheck className="w-6 h-6" style={{ color: '#2563eb' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'black' }}>
                Immediate Reports
              </h2>
            </div>

            {directReports.length > 0 ? (
              <ul className="space-y-4">
                {directReports.map((emp) => (
                  <li
                    key={emp.employee_number}
                    className="p-4 bg-white rounded shadow"
                  >
                    <p className="text-lg font-medium text-gray-800">
                      {emp.full_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {emp.relationship}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <Search
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--gray-400)' }}
                />
                <p
                  className="text-lg font-medium mb-2"
                  style={{ color: 'var(--gray-600)' }}
                >
                  No direct reports found
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pl-2">
              <Calendar className="w-6 h-6" style={{ color: '#2563eb' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>
                {activeView === 'my-roster' ? 'My Roster' : 'Team Rosters'}
              </h2>
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
                <RosterCard key={`${roster.empId}-${roster.date}`} roster={roster} />
              ))}
            </div>

            {filteredRosterData.length === 0 && (
              <div className="text-center py-12">
                <Search
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--gray-400)' }}
                />
                <p
                  className="text-lg font-medium mb-2"
                  style={{ color: 'var(--gray-600)' }}
                >
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
      <Navbar />

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
