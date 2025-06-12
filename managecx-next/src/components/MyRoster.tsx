'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Briefcase } from 'lucide-react';

interface RosterEntry {
  date: string;
  login_time: string | null;
  logout_time: string | null;
  status: string;
  transport_status: string;
  work_status: string;
}

type FilterType = 'this-week' | 'next-week' | 'custom';

const MyRoster: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('this-week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rosterData, setRosterData] = useState<RosterEntry[]>([]);
  const [filteredData, setFilteredData] = useState<RosterEntry[]>([]);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        setRosterData(data);
      } catch (error) {
        console.error('Failed to fetch roster data:', error);
      }
    };

    fetchRoster();
  }, []);

  useEffect(() => {
    if (rosterData.length === 0) return;

    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0

    const getStartOfWeek = (date: Date) => {
      const d = new Date(date);
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const getEndOfWeek = (start: Date) => {
      const d = new Date(start);
      d.setDate(d.getDate() + 6);
      d.setHours(23, 59, 59, 999);
      return d;
    };

    let from: Date;
    let to: Date;

    if (filter === 'this-week') {
      from = getStartOfWeek(today);
      to = getEndOfWeek(from);
    } else if (filter === 'next-week') {
      from = getStartOfWeek(new Date(today.setDate(today.getDate() + 7)));
      to = getEndOfWeek(from);
    } else if (filter === 'custom' && startDate && endDate) {
      from = new Date(startDate);
      from.setHours(0, 0, 0, 0);
      to = new Date(endDate);
      to.setHours(23, 59, 59, 999);
    } else {
      setFilteredData([]);
      return;
    }

    const filtered = rosterData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= from && entryDate <= to;
    });

    setFilteredData(filtered);
  }, [filter, startDate, endDate, rosterData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-[#25E2CC] text-[#003D5B]';
      case 'LEAVE':
        return 'bg-[#FF6325] text-white';
      case 'WO':
        return 'bg-[#C0D62E] text-[#003D5B]';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const firstEntry = filteredData[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Roster</h2>
          {firstEntry && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-[#00929F]" />
                <span className="text-gray-600">Transport:</span>
                <span className="font-medium text-[#003D5B]">{firstEntry.transport_status}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="w-4 h-4 text-[#00929F]" />
                <span className="text-gray-600">Work Mode:</span>
                <span className="font-medium text-[#003D5B]">{firstEntry.work_status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            {(['this-week', 'next-week', 'custom'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filter === type
                    ? 'bg-[#003D5B] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'this-week'
                  ? 'This Week'
                  : type === 'next-week'
                  ? 'Next Week'
                  : 'Custom Range'}
              </button>
            ))}
          </div>

          {filter === 'custom' && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25E2CC] focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25E2CC] focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Roster Cards */}
      <div className="grid gap-4">
        {filteredData.map((entry, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(entry.date)}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                  {entry.status}
                </span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {entry.login_time && entry.logout_time ? (
                  <>
                    <div className="flex items-center space-x-1">
                      <span>Login:</span>
                      <span className="font-medium text-[#003D5B]">{entry.login_time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Logout:</span>
                      <span className="font-medium text-[#003D5B]">{entry.logout_time}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400 italic">No scheduled times</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 italic">No roster entries for the selected range.</div>
        )}
      </div>
    </div>
  );
};

export default MyRoster;
