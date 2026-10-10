import React from 'react';
import axiosClient from '../../api/axiosClient'; from 'react';
import { 
  Download, ChevronDown, CalendarDays, Search, Users, 
  CheckCircle2, XCircle, Clock, Plane, TrendingUp, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';

import { useState, useEffect } from 'react';
import { getAttendance } from '../../api/attendanceApi';
import { getLeaveRequests } from '../../api/leaveApi';
import { getEmployees } from '../../api/employeeApi';
import { getDepartments } from '../../api/departmentApi';

function Reports() {
  const [loading, setLoading] = useState(true);
  const [rawRecords, setRawRecords] = useState([]);
  const [stats, setStats] = useState({ totalEmp: 0, present: 0, absent: 0, late: 0, leave: 0 });
  const [trendData, setTrendData] = useState([]);
  const [deptWiseData, setDeptWiseData] = useState([]);
  const [reportRecords, setReportRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Attendance Report');
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [departmentRecords, setDepartmentRecords] = useState([]);
  const [backendStats, setBackendStats] = useState(null);

  // Filter state
  const [listMonth, setListMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  
  useEffect(() => {
    fetchReportData();
  }, [listMonth]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [year, month] = listMonth.split('-');
      const firstDay = `${year}-${month}-01`;
      const lastDayDate = new Date(year, month, 0);
      const lastDay = `${year}-${month}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

      const response = await getAttendance({ from: firstDay, to: lastDay });
      const records = response.data || [];
      setRawRecords(records);
      
      aggregateData(records, lastDayDate.getDate());

      const [empRes, leaveRes, deptRes, statsRes] = await Promise.all([
        getEmployees(),
        getLeaveRequests(),
        getDepartments(),
        axiosClient.get('/api/reports/stats')
      ]);
      setEmployeeRecords(empRes.data || []);
      setLeaveRecords(leaveRes.data || []);
      setDepartmentRecords(deptRes.data || []);
      setBackendStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch report data', error);
    } finally {
      setLoading(false);
    }
  };

  const aggregateData = (records, totalDaysInMonth) => {
    let present = 0, absent = 0, late = 0, leave = 0;
    const employees = new Map();
    const trendMap = new Map();
    const deptMap = new Map();

    records.forEach(r => {
      // Counters
      const st = (r.status || 'ABSENT').toUpperCase();
      if (st === 'PRESENT') present++;
      else if (st === 'ABSENT') absent++;
      else if (st === 'LATE') late++;
      else if (st === 'ON_LEAVE' || st === 'LEAVE') leave++;
      else absent++; // default unmapped

      // Employee Aggregation
      if (!employees.has(r.employeeId)) {
        employees.set(r.employeeId, {
          id: r.employeeId,
          name: r.employeeName || 'Unknown',
          empId: `EMP${String(r.employeeId).padStart(3, '0')}`,
          dept: r.departmentName || 'General',
          total: totalDaysInMonth,
          present: 0, absent: 0, late: 0, leave: 0,
        });
      }
      const emp = employees.get(r.employeeId);
      if (st === 'PRESENT') emp.present++;
      if (st === 'ABSENT') emp.absent++;
      if (st === 'LATE') emp.late++;
      if (st === 'ON_LEAVE' || st === 'LEAVE') emp.leave++;

      // Trend Data (Group by date)
      const dDate = r.workDate; 
      if (!trendMap.has(dDate)) trendMap.set(dDate, { name: dDate.substring(8, 10) + ' ' + listMonth.substring(5, 7), present: 0, absent: 0, late: 0, leave: 0 });
      const tr = trendMap.get(dDate);
      if (st === 'PRESENT') tr.present++;
      if (st === 'ABSENT') tr.absent++;
      if (st === 'LATE') tr.late++;
      if (st === 'ON_LEAVE' || st === 'LEAVE') tr.leave++;

      // Dept Data
      const dept = r.departmentName || 'General';
      if (!deptMap.has(dept)) deptMap.set(dept, { name: dept, present: 0, absent: 0, late: 0, leave: 0 });
      const dp = deptMap.get(dept);
      if (st === 'PRESENT') dp.present++;
      if (st === 'ABSENT') dp.absent++;
      if (st === 'LATE') dp.late++;
      if (st === 'ON_LEAVE' || st === 'LEAVE') dp.leave++;
    });

    setStats({ totalEmp: employees.size, present, absent, late, leave });

    // Format Trend
    const sortedTrend = Array.from(trendMap.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(e => e[1]);
    setTrendData(sortedTrend.length > 0 ? sortedTrend : [{name: 'No Data', present:0, absent:0, late:0, leave:0}]);

    // Format Dept
    const sortedDept = Array.from(deptMap.values()).sort((a,b) => b.present - a.present);
    setDeptWiseData(sortedDept.length > 0 ? sortedDept : [{name: 'No Data', present:0, absent:0, late:0, leave:0}]);

    // Format Table
    const tableData = Array.from(employees.values()).map(emp => {
      const percentage = Math.round((emp.present / emp.total) * 100) || 0;
      return { ...emp, percentage };
    });
    setReportRecords(tableData);
  };

  const filteredReportRecords = reportRecords.filter(record => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return record.name.toLowerCase().includes(lowerSearch) || 
           record.empId.toLowerCase().includes(lowerSearch);
  });

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Reports</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>View and generate employee reports</p>
        </div>
        <button style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}>
          <Download size={16} />
          Export Report
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Horizontal Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['Attendance Report', 'Leave Report', 'Employee Report', 'Department Report'].map(tab => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: activeTab === tab ? '#eaf6f6' : 'white', 
              color: activeTab === tab ? '#0d9488' : '#64748b', 
              borderRadius: '8px', 
              fontWeight: '500', 
              fontSize: '14px', 
              cursor: 'pointer', 
              border: activeTab === tab ? '1px solid #0d9488' : '1px solid #e2e8f0', 
              whiteSpace: 'nowrap' 
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Report Month</label>
          <div style={{ position: 'relative' }}>
            <CalendarDays size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
            <input 
              type="month" 
              value={listMonth}
              onChange={(e) => setListMonth(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', outline: 'none', color: '#0f172a', fontWeight: '500', boxSizing: 'border-box' }} 
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Department</label>
          <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#0f172a', fontWeight: '500', outline: 'none', appearance: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
            <option>All Departments</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Status</label>
          <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#0f172a', fontWeight: '500', outline: 'none', appearance: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
            <option>All Status</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Employee</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <select style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#0f172a', fontWeight: '500', outline: 'none', appearance: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
              <option>All Employees</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
            Generate
          </button>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {activeTab === 'Attendance Report' && (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', color: '#3b82f6' }}><Users size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Total Employees</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{loading ? '-' : stats.totalEmp}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '10px', color: '#10b981' }}><CheckCircle2 size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Present Days</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{loading ? '-' : stats.present}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '10px', color: '#ef4444' }}><XCircle size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Absent Days</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{loading ? '-' : stats.absent}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#fff7ed', padding: '12px', borderRadius: '10px', color: '#f59e0b' }}><Clock size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Late Days</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{loading ? '-' : stats.late}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', color: '#3b82f6' }}><Plane size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Leave Days</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{loading ? '-' : stats.leave}</h2></div>
            </div>
          </>
        )}

        {activeTab === 'Leave Report' && backendStats && (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', color: '#3b82f6' }}><Plane size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Total Leaves</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.leave.total}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '10px', color: '#10b981' }}><CheckCircle2 size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Approved</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.leave.approved}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#fff7ed', padding: '12px', borderRadius: '10px', color: '#f59e0b' }}><Clock size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Pending</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.leave.pending}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '10px', color: '#ef4444' }}><XCircle size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Rejected</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.leave.rejected}</h2></div>
            </div>
          </>
        )}

        {activeTab === 'Employee Report' && backendStats && (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', color: '#3b82f6' }}><Users size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Total Employees</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.employee.total}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '10px', color: '#10b981' }}><CheckCircle2 size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Active</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.employee.active}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '10px', color: '#ef4444' }}><XCircle size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Inactive</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.employee.inactive}</h2></div>
            </div>
          </>
        )}

        {activeTab === 'Department Report' && backendStats && (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', color: '#3b82f6' }}><TrendingUp size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Total Departments</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.department.total}</h2></div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '10px', color: '#10b981' }}><Users size={24} /></div>
              <div><p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>Total Employees</p><h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>{backendStats.department.totalEmployees}</h2></div>
            </div>
          </>
        )}
      </div>

      {/* Charts Row */}
      {activeTab === 'Attendance Report' && (
{/* Charts Row */}
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Attendance Trend Chart */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Attendance Trend</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '500' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0d9488' }}></div> Present</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Absent</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div> Late</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div> On Leave</div>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} barSize={6}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="present" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leave" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Wise Attendance Chart */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Department Wise Attendance</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '500' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0d9488' }}></div> Present</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Absent</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div> Late</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div> On Leave</div>
            </div>
          </div>
          <div style={{ height: '300px', display: 'flex' }}>
            <ResponsiveContainer width="75%" height="100%">
              <BarChart data={deptWiseData} layout="vertical" barSize={12}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} width={90} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="present" stackId="a" fill="#0d9488" radius={[4, 0, 0, 4]} />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" />
                <Bar dataKey="late" stackId="a" fill="#f59e0b" />
                <Bar dataKey="leave" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Custom Right Labels for the stacked bars to mimic mockup */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingBottom: '30px', paddingTop: '10px' }}>
              {deptWiseData.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: '600' }}>
                  <span style={{ color: '#0f172a', width: '20px', textAlign: 'center' }}>{d.present}</span>
                  <span style={{ color: '#ef4444', width: '20px', textAlign: 'center' }}>{d.absent}</span>
                  <span style={{ color: '#f59e0b', width: '20px', textAlign: 'center' }}>{d.late}</span>
                  <span style={{ color: '#3b82f6', width: '20px', textAlign: 'center' }}>{d.leave}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      )}

      {/* Main Table Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{activeTab} Details</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search by name or employee ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button style={{ backgroundColor: 'white', color: '#0d9488', border: '1px solid #0d9488', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
            <thead>
              <tr style={{ color: '#0f172a', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', width: '40px', borderTopLeftRadius: '8px' }}>#</th>
                <th style={{ padding: '12px 16px' }}>Employee</th>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Total Days</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Present</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Absent</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Late</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>On Leave</th>
                <th style={{ padding: '12px 16px' }}>Attendance %</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', borderTopRightRadius: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReportRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                    No data available for the selected period.
                  </td>
                </tr>
              ) : (
                filteredReportRecords.map((record) => (
                <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', color: '#0f172a', fontWeight: '500' }}>{record.id}</td>
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={`https://ui-avatars.com/api/?name=${record.name.replace(' ', '+')}&background=e2e8f0&color=0f172a`} alt={record.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '13px' }}>{record.name}</span>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>{record.empId}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{record.dept}</td>
                  <td style={{ padding: '16px', color: '#0f172a', fontWeight: '600', textAlign: 'center' }}>{record.total}</td>
                  <td style={{ padding: '16px', color: '#0f172a', fontWeight: '600', textAlign: 'center' }}>{record.present}</td>
                  <td style={{ padding: '16px', color: '#0f172a', fontWeight: '600', textAlign: 'center' }}>{record.absent}</td>
                  <td style={{ padding: '16px', color: '#0f172a', fontWeight: '600', textAlign: 'center' }}>{record.late}</td>
                  <td style={{ padding: '16px', color: '#0f172a', fontWeight: '600', textAlign: 'center' }}>{record.leave}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: '600', color: '#0f172a', width: '30px' }}>{record.percentage}%</span>
                      <div style={{ width: '100px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${record.percentage}%`, height: '100%', backgroundColor: '#0d9488', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', color: '#64748b' }}>
                      <div style={{ cursor: 'pointer', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                        <Eye size={16} />
                      </div>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

export default Reports;
