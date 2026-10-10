import React, { useState, useEffect } from 'react';
import { Users, CalendarCheck, LayoutDashboard, ChevronDown, TrendingUp, TrendingDown, Check, X, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getDashboardSummary, getRecentEmployees, getPendingLeaves, getDepartmentStats } from '../../api/dashboardApi';
import { getAttendanceSummary } from '../../api/attendanceApi';
import { makeLeaveDecision } from '../../api/leaveApi';
import CustomSelect from '../../components/CustomSelect';
import { formatDate } from '../../utils/formatUtils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
          <h3>Dashboard Crashed!</h3>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{ fontSize: '12px', overflowX: 'auto' }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const getStatusColor = (status) => {
  if (!status) return '#f1f5f9';
  const s = status.toUpperCase();
  if (s.includes('ACTIVE') || s.includes('APPROVED')) return '#dcfce7';
  if (s.includes('LEAVE') || s.includes('PENDING')) return '#fef3c7';
  if (s.includes('REJECTED') || s.includes('INACTIVE')) return '#fee2e2';
  return '#f1f5f9';
};

const getStatusTextColor = (status) => {
  if (!status) return '#64748b';
  const s = status.toUpperCase();
  if (s.includes('ACTIVE') || s.includes('APPROVED')) return '#16a34a';
  if (s.includes('LEAVE') || s.includes('PENDING')) return '#d97706';
  if (s.includes('REJECTED') || s.includes('INACTIVE')) return '#dc2626';
  return '#64748b';
};

const CHART_COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#94a3b8'];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [pendingLeavesList, setPendingLeavesList] = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [attendanceChart, setAttendanceChart] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState('This Week');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [listMonth, setListMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate last 7 days for the chart
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });
      
      const attendancePromises = last7Days.map(date => getAttendanceSummary(date));
      
      const [sumRes, empRes, leaveRes, deptRes, ...attResults] = await Promise.all([
        getDashboardSummary(today),
        getRecentEmployees(5),
        getPendingLeaves(5),
        getDepartmentStats(),
        ...attendancePromises
      ]);
      setSummary(sumRes.data);
      setRecentEmployees(empRes.data);
      setPendingLeavesList(leaveRes.data);
      
      let depts = [];
      if (Array.isArray(deptRes.data)) {
        // Fallback if backend still returns an array of Department objects
        depts = deptRes.data.map((d, idx) => ({
          name: d.name || d.departmentName || 'Unknown',
          value: d.employeeCount || 1, // Fallback to 1 so it renders
          color: CHART_COLORS[idx % CHART_COLORS.length]
        }));
      } else if (deptRes.data && typeof deptRes.data === 'object') {
        depts = Object.entries(deptRes.data).map(([name, value], idx) => ({
          name,
          value: typeof value === 'number' ? value : 1,
          color: CHART_COLORS[idx % CHART_COLORS.length]
        }));
      }

      if (depts.length === 0) {
        depts = [{ name: 'No Data', value: 1, color: '#e2e8f0' }];
      }
      setDeptStats(depts);

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const chartData = last7Days.map((dateStr, idx) => {
        const d = new Date(dateStr);
        const dayName = daysOfWeek[d.getDay()];
        const attData = attResults[idx].data;
        return {
          name: dayName,
          present: attData.present || 0,
          absent: attData.absent || 0
        };
      });
      if (chartData.length === 0) {
        chartData.push({ name: 'No Data', present: 0, absent: 0 });
      }
      setAttendanceChart(chartData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLeaveDecision = async (id, decision) => {
    try {
      await makeLeaveDecision(id, decision, '');
      fetchData(); // Refresh list
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message;
      alert(`Failed to update leave request: ${msg}`);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading dashboard...</div>;
  }

  return (
    <>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Dashboard</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Welcome back, Iniyan! Here's what's happening today.</p>
        </div>
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
          <CalendarCheck size={18} color="#64748b" />
          <span style={{ color: '#0f172a' }}>
            {formatDate(new Date(listMonth + '-01'))}
          </span>
          <ChevronDown size={16} color="#64748b" style={{ marginLeft: '4px' }} />
          <input 
            type="month" 
            className="hidden-month-input"
            value={listMonth}
            onChange={(e) => setListMonth(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#eaf6f6', padding: '16px', borderRadius: '12px', color: '#0d9488' }}><Users size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Total Employees</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.totalEmployees || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingUp size={12} style={{marginRight: '2px'}}/> +12%</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '12px', color: '#10b981' }}><CalendarCheck size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Present Today</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.presentToday || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingUp size={12} style={{marginRight: '2px'}}/> +5%</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '16px', borderRadius: '12px', color: '#f59e0b' }}><LayoutDashboard size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>On Leave</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.onLeave || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingDown size={12} style={{marginRight: '2px'}}/> -2</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '12px', color: '#3b82f6' }}><Users size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>New Employees</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.newEmployees || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingUp size={12} style={{marginRight: '2px'}}/> +3</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>this month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Attendance Overview</h3>
            <CustomSelect 
              value={attendanceFilter} 
              onChange={setAttendanceFilter}
              options={[
                { value: 'Today', label: 'Today' },
                { value: 'This Week', label: 'This Week' },
                { value: 'This Month', label: 'This Month' }
              ]}
              placeholder="Select Period"
              width="140px"
            />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChart} barSize={20}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="present" name="Present" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Department Overview</h3>
            <CustomSelect 
              value={departmentFilter} 
              onChange={setDepartmentFilter}
              options={deptStats.map(d => ({ label: d.name, value: d.name }))}
              placeholder="All Departments"
              width="180px"
            />
          </div>
          <div className="department-overview-content" style={{ height: '250px' }}>
            <div style={{ flex: '1', height: '100%', position: 'relative', minHeight: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {deptStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{summary?.totalEmployees || 0}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Employees</div>
              </div>
            </div>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {deptStats.map((dept, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dept.color }}></div>
                    {dept.name}
                  </div>
                  <div style={{ fontWeight: '600' }}>{dept.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tables-grid">
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Recent Employees</h3>
            <a href="#" style={{ color: '#0d9488', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>View All</a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px' }}>#</th>
                  <th style={{ padding: '12px 8px' }}>Name</th>
                  <th style={{ padding: '12px 8px' }}>Employee ID</th>
                  <th style={{ padding: '12px 8px' }}>Department</th>
                  <th style={{ padding: '12px 8px' }}>Joining Date</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No recent employees</td>
                  </tr>
                ) : (
                  recentEmployees.map((emp, idx) => {
                    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.employeeName || 'Unknown';
                    return (
                      <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 8px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=e2e8f0`} alt={fullName} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                          {fullName}
                        </td>
                        <td style={{ padding: '12px 8px', color: '#64748b' }}>{emp.employeeCode || '-'}</td>
                        <td style={{ padding: '12px 8px', color: '#64748b' }}>{emp.departmentName || '-'}</td>
                        <td style={{ padding: '12px 8px', color: '#64748b' }}>{formatDate(emp.joiningDate)}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ backgroundColor: getStatusColor(emp.status), color: getStatusTextColor(emp.status), padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                            {emp.status === 'ACTIVE' ? 'Active' : emp.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Pending Leave Requests</h3>
            <a href="#" style={{ color: '#0d9488', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>View All</a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px' }}>#</th>
                  <th style={{ padding: '12px 8px' }}>Employee</th>
                  <th style={{ padding: '12px 8px' }}>Leave Type</th>
                  <th style={{ padding: '12px 8px' }}>From Date</th>
                  <th style={{ padding: '12px 8px' }}>To Date</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeavesList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No pending leaves</td>
                  </tr>
                ) : (
                  pendingLeavesList.map((leave, idx) => (
                    <tr key={leave.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leave.employeeName || 'User')}&background=e2e8f0`} alt={leave.employeeName} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        {leave.employeeName}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#64748b' }}>{leave.leaveType}</td>
                      <td style={{ padding: '12px 8px', color: '#64748b' }}>{formatDate(leave.startDate)}</td>
                      <td style={{ padding: '12px 8px', color: '#64748b' }}>{formatDate(leave.endDate)}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ backgroundColor: getStatusColor(leave.status), color: getStatusTextColor(leave.status), padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{leave.status}</span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {leave.status === 'PENDING' ? (
                           <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                             <div onClick={() => handleLeaveDecision(leave.id, 'APPROVED')} title="Approve" style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#16a34a' }}><Check size={14} /></div>
                             <div onClick={() => handleLeaveDecision(leave.id, 'REJECTED')} title="Reject" style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}><X size={14} /></div>
                           </div>
                        ) : (
                           <div style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', margin: '0 auto' }}><Eye size={14} /></div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardWrapper() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
