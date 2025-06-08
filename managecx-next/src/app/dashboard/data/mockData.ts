import { RosterEntry, Employee } from '../types/roster';

export const mockRosterData: RosterEntry[] = [
  {
    id: '1',
    empId: 'EMP001',
    empName: 'John Smith',
    date: '2024-01-15',
    day: 'Monday',
    loginTime: '09:00',
    logoutTime: '18:00',
    status: 'Present'
  },
  {
    id: '2',
    empId: 'EMP001',
    empName: 'John Smith',
    date: '2024-01-16',
    day: 'Tuesday',
    status: 'Leave',
    leaveType: 'Sick Leave'
  },
  {
    id: '3',
    empId: 'EMP002',
    empName: 'Sarah Johnson',
    date: '2024-01-15',
    day: 'Monday',
    loginTime: '08:30',
    logoutTime: '17:30',
    status: 'Present'
  },
  {
    id: '4',
    empId: 'EMP003',
    empName: 'Mike Wilson',
    date: '2024-01-15',
    day: 'Monday',
    status: 'WO'
  },
  {
    id: '5',
    empId: 'EMP004',
    empName: 'Emily Davis',
    date: '2024-01-15',
    day: 'Monday',
    loginTime: '09:15',
    logoutTime: '18:15',
    status: 'Present'
  },
  {
    id: '6',
    empId: 'EMP002',
    empName: 'Sarah Johnson',
    date: '2024-01-16',
    day: 'Tuesday',
    loginTime: '08:45',
    logoutTime: '17:45',
    status: 'Present'
  },
  {
    id: '7',
    empId: 'EMP005',
    empName: 'David Brown',
    date: '2024-01-15',
    day: 'Monday',
    status: 'Leave',
    leaveType: 'Casual Leave'
  },
  {
    id: '8',
    empId: 'EMP006',
    empName: 'Lisa Garcia',
    date: '2024-01-16',
    day: 'Tuesday',
    loginTime: '09:00',
    logoutTime: '18:30',
    status: 'Present'
  }
];

export const mockEmployees: Employee[] = [
  {
    empId: 'EMP002',
    name: 'Sarah Johnson',
    department: 'Engineering',
    designation: 'Senior Developer',
    isImmediate: true
  },
  {
    empId: 'EMP003',
    name: 'Mike Wilson',
    department: 'Engineering',
    designation: 'Frontend Developer',
    isImmediate: true
  },
  {
    empId: 'EMP004',
    name: 'Emily Davis',
    department: 'Design',
    designation: 'UI/UX Designer',
    isImmediate: true
  },
  {
    empId: 'EMP005',
    name: 'David Brown',
    department: 'Engineering',
    designation: 'Backend Developer',
    isImmediate: false
  },
  {
    empId: 'EMP006',
    name: 'Lisa Garcia',
    department: 'QA',
    designation: 'QA Engineer',
    isImmediate: false
  }
];

export const currentUser = {
  empId: 'EMP001',
  name: 'John Smith',
  designation: 'Team Lead'
};