import React, { useEffect, useState } from 'react';
import { Search, Users, MapPin, Briefcase, Mail, User } from 'lucide-react';

interface RosterEntry {
  date: string;
  login_time: string | null;
  logout_time: string | null;
  status: string;
  transport_status: string;
  work_status: string;
}

interface Employee {
  employee_number: number;
  full_name: string;
  email: string;
  roster: RosterEntry[];
}

type FilterType = 'this-week' | 'next-week' | 'custom';

const TeamMembers: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('this-week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [teamData, setTeamData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/subtree');
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        const data = await response.json();
        setTeamData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDateRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1); // Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    const nextWeekStart = new Date(endOfWeek);
    nextWeekStart.setDate(endOfWeek.getDate() + 1); // Next Monday

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6); // Next Sunday

    switch (filter) {
      case 'this-week':
        return { start: startOfWeek, end: endOfWeek };
      case 'next-week':
        return { start: nextWeekStart, end: nextWeekEnd };
      case 'custom':
        return {
          start: new Date(startDate),
          end: new Date(endDate),
        };
      default:
        return { start: startOfWeek, end: endOfWeek };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
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

  const dateInRange = (date: string, start: Date, end: Date) => {
    const d = new Date(date);
    return d >= start && d <= end;
  };

  const { start, end } = getDateRange();

  const filteredTeamData = teamData
    .map(employee => {
      const filteredRoster = employee.roster.filter(entry => dateInRange(entry.date, start, end));

      return {
        ...employee,
        roster: filteredRoster,
      };
    })
    .filter(
      employee =>
        (employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employee_number.toString().includes(searchTerm)) &&
        employee.roster.length > 0
    );

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading team members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Team Members</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{filteredTeamData.length} team members</span>
          </div>
        </div>

        {/* Controls */}
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
                {type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25E2CC] focus:border-transparent"
            />
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

      {/* Roster Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roster
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeamData.map((employee) => (
                <tr key={employee.employee_number} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#003D5B] to-[#25E2CC] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {employee.employee_number}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{employee.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <MapPin className="w-3 h-3 text-[#00929F]" />
                        <span className="text-gray-600">Transport:</span>
                        <span className="font-medium text-[#003D5B]">
                          {employee.roster[0]?.transport_status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Briefcase className="w-3 h-3 text-[#00929F]" />
                        <span className="text-gray-600">Work Mode:</span>
                        <span className="font-medium text-[#003D5B]">
                          {employee.roster[0]?.work_status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-3">
                      {employee.roster.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(entry.date)}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                              {entry.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            {entry.login_time && entry.logout_time ? (
                              <>
                                <span>{entry.login_time} - {entry.logout_time}</span>
                              </>
                            ) : (
                              <span className="text-gray-400 italic">No schedule</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTeamData.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500">Try adjusting your search or date filters</p>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
