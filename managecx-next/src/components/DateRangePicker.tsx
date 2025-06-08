import React from 'react';
import { Calendar } from 'lucide-react';
import { DateRange } from '@/app/dashboard/types/roster';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateRangeChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateRangeChange({ ...dateRange, startDate: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateRangeChange({ ...dateRange, endDate: e.target.value });
  };

  return (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg card-shadow">
    <Calendar className="w-5 h-5 text-blue-400" />
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-black">
        From:
      </label>
      <input
        type="date"
        value={dateRange.startDate}
        onChange={handleStartDateChange}
        className="px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-black">
        To:
      </label>
      <input
        type="date"
        value={dateRange.endDate}
        onChange={handleEndDateChange}
        className="px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

};

export default DateRangePicker;