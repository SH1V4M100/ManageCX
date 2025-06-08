export interface RosterEntry {
  id: string;
  empId: string;
  empName: string;
  date: string;
  day: string;
  loginTime?: string;
  logoutTime?: string;
  status: 'Present' | 'Leave' | 'WO';
  leaveType?: string;
}

export interface Employee {
  empId: string;
  name: string;
  department: string;
  designation: string;
  isImmediate: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}