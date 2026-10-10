import React, { useState, useEffect } from 'react';
import {
  Plus, Search, ChevronDown, Filter, Paperclip, Clock,
  ChevronLeft, ChevronRight, UserCheck, UserX, Clock4, CalendarX2,
  TrendingUp, TrendingDown, CalendarDays, X, MapPin,
  LogOut, Briefcase, Home as HomeIcon, CheckCircle2, Crosshair, Map, RefreshCw
} from 'lucide-react';
import { getAttendance, getAttendanceSummary, markAttendance } from '../../api/attendanceApi';
import { getDepartments } from '../../api/departmentApi';

const CustomSelect = ({ value, onChange, options, placeholder, width }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div style={{ position: 'relative', width: width || 'auto' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={16} color="#94a3b8" />
      </div>
      {isOpen && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} onClick={() => setIsOpen(false)} />
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 11, maxHeight: '250px', overflowY: 'auto' }}>
            <div 
              onClick={() => { onChange(''); setIsOpen(false); }}
              style={{ padding: '10px 16px', fontSize: '14px', color: value === '' ? '#0d9488' : '#475569', cursor: 'pointer', backgroundColor: value === '' ? '#f0fdfa' : 'transparent', fontWeight: value === '' ? '500' : '400' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = value === '' ? '#f0fdfa' : '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = value === '' ? '#f0fdfa' : 'transparent'}
            >
              {placeholder}
            </div>
            {options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                style={{ padding: '10px 16px', fontSize: '14px', color: value === opt.value ? '#0d9488' : '#475569', cursor: 'pointer', backgroundColor: value === opt.value ? '#f0fdfa' : 'transparent', fontWeight: value === opt.value ? '500' : '400' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? '#f0fdfa' : '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? '#f0fdfa' : 'transparent'}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function Attendance() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [departments, setDepartments] = useState([]);

  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateView, setDateView] = useState('month'); // 'month' or 'date'
  const [selectedMonth, setSelectedMonth] = useState('Oct');
  const [selectedDate, setSelectedDate] = useState(10);

  const getISTDate = () => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 5.5));
  };

  const [attendanceType, setAttendanceType] = useState('CHECK_IN');
  
  const [timeHour, setTimeHour] = useState(() => {
    let h = getISTDate().getHours();
    return h % 12 === 0 ? '12' : String(h % 12).padStart(2, '0');
  });
  const [timeMinute, setTimeMinute] = useState(() => String(getISTDate().getMinutes()).padStart(2, '0'));
  const [timeAmPm, setTimeAmPm] = useState(() => getISTDate().getHours() >= 12 ? 'PM' : 'AM');

  const [listMonth, setListMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate first and last day of selected month
      const [year, month] = listMonth.split('-');
      const firstDay = `${year}-${month}-01`;
      const lastDayDate = new Date(year, month, 0);
      const lastDay = `${year}-${month}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

      const params = { from: firstDay, to: lastDay };

      const [attRes, sumRes] = await Promise.all([
        getAttendance(params),
        getAttendanceSummary(today)
      ]);
      setRecords(attRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const today = getISTDate();
      let hours = parseInt(timeHour, 10);
      if (timeAmPm === 'PM' && hours < 12) hours += 12;
      if (timeAmPm === 'AM' && hours === 12) hours = 0;
      
      today.setHours(hours, parseInt(timeMinute, 10), 0, 0);

      const payload = {
        employeeId: 1, // hardcoded for now until auth context is added
        employeeName: "Iniyan",
        attendanceType: attendanceType,
        checkInAt: attendanceType === 'CHECK_IN' ? today.toISOString() : null,
        checkOutAt: attendanceType === 'CHECK_OUT' ? today.toISOString() : null,
        status: "PRESENT",
        remarks: "Marked from Dashboard"
      };
      await markAttendance(payload);
      setIsMarkingAttendance(false);
      fetchAttendanceData();
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance: " + (err.response?.data || err.message));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendanceData();
    }, 300);
    return () => clearTimeout(timer);
  }, [listMonth]);

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data)).catch(console.error);
  }, []);

  const getStatusColor = (status) => {
    if (!status) return '#f1f5f9';
    switch (status.toUpperCase()) {
      case 'PRESENT': return '#dcfce7';
      case 'ABSENT': return '#fee2e2';
      case 'LATE': return '#fef3c7';
      case 'ON LEAVE': return '#e0f2fe';
      default: return '#f1f5f9';
    }
  };

  const getStatusTextColor = (status) => {
    if (!status) return '#64748b';
    switch (status.toUpperCase()) {
      case 'PRESENT': return '#16a34a';
      case 'ABSENT': return '#dc2626';
      case 'LATE': return '#d97706';
      case 'ON LEAVE': return '#0284c7';
      default: return '#64748b';
    }
  };

  const filteredRecords = records.filter(record => {
    let match = true;
    if (searchTerm) {
      match = match && (
        (record.employeeName && record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.employeeCode && record.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (statusFilter) {
      match = match && record.status === statusFilter;
    }
    if (departmentFilter) {
      match = match && record.departmentName === departmentFilter;
    }
    if (dateFilter) {
      match = match && record.workDate === dateFilter;
    }
    return match;
  });

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Attendance</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>View and manage employee attendance records</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <CalendarDays size={18} color="#64748b" />
            <span style={{ color: '#0f172a' }}>
              {new Date(listMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <ChevronDown size={16} color="#64748b" style={{ marginLeft: '4px' }} />
            <input 
              type="month" 
              className="hidden-month-input"
              value={listMonth}
              onChange={(e) => setListMonth(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsMarkingAttendance(true)}
            style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}>
            <Plus size={18} />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '12px', color: '#10b981' }}><UserCheck size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Present Today</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.present || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingUp size={12} style={{ marginRight: '2px' }} /> +5%</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '12px', color: '#ef4444' }}><UserX size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Absent Today</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.absent || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingUp size={12} style={{ marginRight: '2px' }} /> +2%</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '16px', borderRadius: '12px', color: '#f59e0b' }}><Clock4 size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Late Today</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.late || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingDown size={12} style={{ marginRight: '2px' }} /> -3%</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '12px', color: '#3b82f6' }}><CalendarX2 size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>On Leave Today</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{summary?.onLeave || 0}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><TrendingDown size={12} style={{ marginRight: '2px' }} /> -1%</span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>vs yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>

        {/* Filters and Search */}
        <div className="actions-bar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <CustomSelect
            value={departmentFilter}
            onChange={setDepartmentFilter}
            options={departments.map(d => ({ value: d.name, label: d.name }))}
            placeholder="All Departments"
            width="180px"
          />
          
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'PRESENT', label: 'Present' },
              { value: 'ABSENT', label: 'Absent' },
              { value: 'LATE', label: 'Late' },
              { value: 'ON_LEAVE', label: 'On Leave' }
            ]}
            placeholder="All Status"
            width="140px"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569', outline: 'none', backgroundColor: 'white', minWidth: '140px' }}
          />
          <button
            onClick={fetchAttendanceData}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '16px' }}>Loading attendance records...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
            <div style={{ fontSize: '16px', marginBottom: '12px' }}>{error}</div>
            <button onClick={fetchAttendanceData} style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
                <thead>
                  <tr style={{ color: '#0f172a', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: 'bold' }}>
                    <th style={{ padding: '16px 8px', width: '40px' }}>#</th>
                    <th style={{ padding: '16px 8px' }}>Employee</th>
                    <th style={{ padding: '16px 8px' }}>Department</th>
                    <th style={{ padding: '16px 8px' }}>Date</th>
                    <th style={{ padding: '16px 8px' }}>Check In</th>
                    <th style={{ padding: '16px 8px' }}>Check Out</th>
                    <th style={{ padding: '16px 8px' }}>Total Hours</th>
                    <th style={{ padding: '16px 8px' }}>Status</th>
                    <th style={{ padding: '16px 8px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record, idx) => (
                      <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500' }}>{idx + 1}</td>
                        <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(record.employeeName || 'User')}&background=e2e8f0&color=0f172a`} alt={record.employeeName} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>{record.employeeName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{record.departmentName || '-'}</td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{record.workDate}</td>
                        <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500' }}>{record.checkInAt ? new Date(record.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500' }}>{record.checkOutAt ? new Date(record.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{record.workingHours || '-'}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{ backgroundColor: getStatusColor(record.status), color: getStatusTextColor(record.status), padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                            {record.status || 'UNKNOWN'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', color: '#64748b' }}>
                            <div style={{ cursor: 'pointer', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                              <Paperclip size={16} />
                            </div>
                            <div style={{ cursor: 'pointer', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                              <Clock size={16} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                Showing {filteredRecords.length} of {records.length} records
              </div>
            </div>
          </>
        )}

      </div>

      {/* Mark Attendance Modal */}
      {isMarkingAttendance && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 4px 0' }}>Mark Attendance</h2>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Record your attendance for today</p>
              </div>
              <div onClick={() => setIsMarkingAttendance(false)} style={{ cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Attendance Type */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Attendance Type <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  
                  <div 
                    onClick={() => setAttendanceType('CHECK_IN')}
                    style={{ border: attendanceType === 'CHECK_IN' ? '2px solid #0d9488' : '1px solid #e2e8f0', backgroundColor: attendanceType === 'CHECK_IN' ? '#f0fdfa' : 'white', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <CheckCircle2 size={20} color={attendanceType === 'CHECK_IN' ? "#0d9488" : "#94a3b8"} fill={attendanceType === 'CHECK_IN' ? "white" : "transparent"} />
                    <span style={{ fontSize: '13px', fontWeight: attendanceType === 'CHECK_IN' ? '600' : '500', color: attendanceType === 'CHECK_IN' ? '#0d9488' : '#334155' }}>Check In</span>
                  </div>

                  <div 
                    onClick={() => setAttendanceType('CHECK_OUT')}
                    style={{ border: attendanceType === 'CHECK_OUT' ? '2px solid #ef4444' : '1px solid #e2e8f0', backgroundColor: attendanceType === 'CHECK_OUT' ? '#fef2f2' : 'white', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <LogOut size={20} color={attendanceType === 'CHECK_OUT' ? "#ef4444" : "#94a3b8"} />
                    <span style={{ fontSize: '13px', fontWeight: attendanceType === 'CHECK_OUT' ? '600' : '500', color: attendanceType === 'CHECK_OUT' ? '#ef4444' : '#334155' }}>Check Out</span>
                  </div>

                  <div 
                    onClick={() => setAttendanceType('ON_DUTY')}
                    style={{ border: attendanceType === 'ON_DUTY' ? '2px solid #3b82f6' : '1px solid #e2e8f0', backgroundColor: attendanceType === 'ON_DUTY' ? '#eff6ff' : 'white', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <Briefcase size={20} color={attendanceType === 'ON_DUTY' ? "#3b82f6" : "#94a3b8"} />
                    <span style={{ fontSize: '13px', fontWeight: attendanceType === 'ON_DUTY' ? '600' : '500', color: attendanceType === 'ON_DUTY' ? '#3b82f6' : '#334155' }}>On Duty</span>
                  </div>

                  <div 
                    onClick={() => setAttendanceType('WORK_FROM_HOME')}
                    style={{ border: attendanceType === 'WORK_FROM_HOME' ? '2px solid #6366f1' : '1px solid #e2e8f0', backgroundColor: attendanceType === 'WORK_FROM_HOME' ? '#eef2ff' : 'white', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <HomeIcon size={20} color={attendanceType === 'WORK_FROM_HOME' ? "#6366f1" : "#94a3b8"} />
                    <span style={{ fontSize: '13px', fontWeight: attendanceType === 'WORK_FROM_HOME' ? '600' : '500', color: attendanceType === 'WORK_FROM_HOME' ? '#6366f1' : '#334155' }}>Work From Home</span>
                  </div>

                </div>
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <CalendarDays size={18} color="#94a3b8" style={{ position: 'absolute', top: '10px', left: '12px', pointerEvents: 'none' }} />
                    <div
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      style={{ width: '100%', padding: '10px 36px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#334155', backgroundColor: '#f8fafc', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {selectedDate} {selectedMonth} 2026
                    </div>
                    <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', right: '12px', pointerEvents: 'none' }} />

                    {/* DatePicker Popup */}
                    {showDatePicker && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 10, width: '280px' }}>
                        {dateView === 'month' ? (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <ChevronLeft size={18} style={{ cursor: 'pointer', color: '#64748b' }} />
                              <div style={{ fontWeight: '600', fontSize: '15px', color: '#0f172a' }}>2026</div>
                              <ChevronRight size={18} style={{ cursor: 'pointer', color: '#64748b' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                <div
                                  key={m}
                                  onClick={() => { setSelectedMonth(m); setDateView('date'); }}
                                  style={{ padding: '8px 0', textAlign: 'center', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', border: m === selectedMonth ? '1px solid #0d9488' : '1px solid #e2e8f0', color: m === selectedMonth ? '#0d9488' : '#475569', backgroundColor: m === selectedMonth ? '#f0fdfa' : 'white', fontWeight: m === selectedMonth ? '600' : '400' }}>
                                  {m}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <ChevronLeft size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setDateView('month')} />
                              <div style={{ fontWeight: '600', fontSize: '15px', color: '#0f172a' }}>{selectedMonth} 2026</div>
                              <ChevronRight size={18} style={{ cursor: 'pointer', color: '#64748b' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{d}</div>)}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                              {[27, 28, 29, 30].map(d => <div key={'prev' + d} style={{ textAlign: 'center', padding: '6px 0', fontSize: '13px', color: '#cbd5e1' }}>{d}</div>)}
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <div
                                  key={d}
                                  onClick={() => { setSelectedDate(d); setShowDatePicker(false); }}
                                  style={{ textAlign: 'center', padding: '6px 0', fontSize: '13px', cursor: 'pointer', borderRadius: '50%', backgroundColor: d === selectedDate ? '#0d9488' : 'transparent', color: d === selectedDate ? 'white' : '#334155', fontWeight: d === selectedDate ? '600' : '400' }}>
                                  {d}
                                </div>
                              ))}
                              {[1, 2, 3].map(d => <div key={'next' + d} style={{ textAlign: 'center', padding: '6px 0', fontSize: '13px', color: '#cbd5e1' }}>{d}</div>)}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Time (IST) <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <CustomSelect 
                      value={timeHour} 
                      onChange={setTimeHour}
                      options={Array.from({ length: 12 }, (_, i) => {
                        const h = String(i === 0 ? 12 : i).padStart(2, '0');
                        return { value: h, label: h };
                      })}
                      width="100%"
                    />
                    <span style={{ fontWeight: 'bold', color: '#64748b' }}>:</span>
                    <CustomSelect 
                      value={timeMinute} 
                      onChange={setTimeMinute}
                      options={Array.from({ length: 60 }, (_, i) => {
                        const m = String(i).padStart(2, '0');
                        return { value: m, label: m };
                      })}
                      width="100%"
                    />
                    <CustomSelect 
                      value={timeAmPm} 
                      onChange={setTimeAmPm}
                      options={[
                        { value: 'AM', label: 'AM' },
                        { value: 'PM', label: 'PM' }
                      ]}
                      width="100%"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Location</label>
                <div style={{ display: 'flex', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', gap: '12px' }}>
                    <MapPin size={20} color="#0d9488" fill="currentColor" style={{ color: 'white', marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Current Location</div>
                      <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>123, Business Park, Avinashi Road,<br />Coimbatore, Tamil Nadu - 641001</div>
                    </div>
                  </div>
                  <div style={{ width: '200px', backgroundColor: '#e2e8f0', position: 'relative', overflow: 'hidden', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Simulated Map Marker */}
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(13, 148, 136, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0d9488', border: '2px solid white' }}></div>
                    </div>
                    {/* Update Location Button */}
                    <button style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <Crosshair size={14} color="#0d9488" /> Update Location
                    </button>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Remarks (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <textarea placeholder="Add any remarks (e.g., working from client site, late arrival reason, etc.)" rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '12px', color: '#94a3b8' }}>0/200</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <button onClick={() => setIsMarkingAttendance(false)} style={{ backgroundColor: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSaveAttendance} style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
