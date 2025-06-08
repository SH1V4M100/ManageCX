import React from 'react';
import { User, Building2, Briefcase } from 'lucide-react';
import { Employee } from '@/app/dashboard/types/roster';

interface EmployeeListProps {
  employees: Employee[];
  showOnlyImmediate?: boolean;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, showOnlyImmediate = false }) => {
  const filteredEmployees = showOnlyImmediate 
    ? employees.filter(emp => emp.isImmediate)
    : employees;

  return (
  <div className="space-y-3">
    {filteredEmployees.map((employee) => (
      <div
        key={employee.empId}
        className="bg-white p-4 rounded-lg card-shadow hover:card-shadow-hover transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100"
            >
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-black">
                {employee.name}
              </h3>
              <p className="text-sm text-gray-500">
                {employee.empId}
              </p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

};

export default EmployeeList;