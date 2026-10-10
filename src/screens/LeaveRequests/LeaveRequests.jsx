import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, ChevronDown, Filter, CalendarDays,
  ChevronLeft, ChevronRight, Check, X, Eye, 
  FileText, Clock, CheckCircle2, XCircle, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { getLeaveRequests, makeLeaveDecision, createLeaveRequest } from '../../api/leaveApi';
import { getEmployees } from '../../api/employeeApi';
import { CloudUpload } from 'lucide-react';

function LeaveRequests() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [employees, setEmployees] = useState([]);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employeeId: '',
    employeeName: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getLeaveRequests();
      setRecords(res.data);
    } catch (err) {
      setError('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees for modal');
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return '#f1f5f9';
    switch(status.toUpperCase()) {
      case 'APPROVED': return '#dcfce7';
      case 'REJECTED': return '#fee2e2';
      case 'PENDING': return '#fef3c7';
      default: return '#f1f5f9';
    }
  };

  const getStatusTextColor = (status) => {
    if (!status) return '#64748b';
    switch(status.toUpperCase()) {
      case 'APPROVED': return '#16a34a';
      case 'REJECTED': return '#dc2626';
      case 'PENDING': return '#d97706';
      default: return '#64748b';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Casual Leave': return '#e0f2fe';
      case 'Sick Leave': return '#fee2e2';
      case 'Annual Leave': return '#f3e8ff';
      default: return '#f1f5f9';
    }
  };

  const getTypeTextColor = (type) => {
    switch(type) {
      case 'Casual Leave': return '#0284c7';
      case 'Sick Leave': return '#ef4444';
      case 'Annual Leave': return '#9333ea';
      default: return '#64748b';
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      await makeLeaveDecision(id, decision, '');
      fetchLeaves();
    } catch {
      alert('Failed to update leave request');
    }
  };

  const filteredRecords = records.filter(record => {
    const nameMatch = (record.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter ? record.status === statusFilter : true;
    return nameMatch && statusMatch;
  });

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    if (!newLeave.employeeId || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      alert('Please fill all required fields');
      return;
    }
    
    // Auto calculate requestedDays on frontend for UI, backend also handles it
    try {
      await createLeaveRequest({
        employeeId: parseInt(newLeave.employeeId),
        employeeName: newLeave.employeeName,
        leaveType: newLeave.leaveType,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        reason: newLeave.reason,
        status: 'PENDING'
      });
      setShowAddModal(false);
      setNewLeave({ employeeId: '', employeeName: '', leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      alert('Failed to submit leave request');
    }
  };

  const pendingCount = records.filter(r => r.status === 'PENDING').length;
  const approvedCount = records.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = records.filter(r => r.status === 'REJECTED').length;

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Leave Requests</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Manage and review employee leave requests</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}
        >
          <Plus size={18} />
          New Leave Request
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '16px', borderRadius: '12px', color: '#f59e0b' }}><FileText size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Total Requests</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{records.length}</h2>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '16px', borderRadius: '12px', color: '#f59e0b' }}><Clock size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Pending</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{pendingCount}</h2>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '12px', color: '#10b981' }}><CheckCircle2 size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Approved</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{approvedCount}</h2>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '12px', color: '#ef4444' }}><XCircle size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Rejected</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{rejectedCount}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        
        {/* Filters and Search */}
        <div className="actions-bar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search by employee name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer', outline: 'none', backgroundColor: 'white' }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            onClick={fetchLeaves}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '16px' }}>Loading requests...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
            <div style={{ fontSize: '16px', marginBottom: '12px' }}>{error}</div>
            <button onClick={fetchLeaves} style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
        <>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '1000px' }}>
            <thead>
              <tr style={{ color: '#0f172a', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: 'bold' }}>
                <th style={{ padding: '16px 8px', width: '40px' }}>#</th>
                <th style={{ padding: '16px 8px' }}>Employee</th>
                <th style={{ padding: '16px 8px' }}>Leave Type</th>
                <th style={{ padding: '16px 8px' }}>From Date</th>
                <th style={{ padding: '16px 8px' }}>To Date</th>
                <th style={{ padding: '16px 8px' }}>Days</th>
                <th style={{ padding: '16px 8px', width: '180px' }}>Reason</th>
                <th style={{ padding: '16px 8px' }}>Status</th>
                <th style={{ padding: '16px 8px' }}>Applied On</th>
                <th style={{ padding: '16px 8px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                    No leave requests found.
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
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ backgroundColor: getTypeColor(record.leaveType), color: getTypeTextColor(record.leaveType), padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', display: 'inline-block' }}>{record.leaveType}</span>
                    </td>
                    <td style={{ padding: '16px 8px', color: '#64748b' }}>{record.startDate}</td>
                    <td style={{ padding: '16px 8px', color: '#64748b' }}>{record.endDate}</td>
                    <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500' }}>-</td>
                    <td style={{ padding: '16px 8px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{record.reason}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ backgroundColor: getStatusColor(record.status), color: getStatusTextColor(record.status), padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', display: 'inline-block' }}>{record.status}</span>
                    </td>
                    <td style={{ padding: '16px 8px', color: '#64748b' }}>-</td>
                    <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {record.status === 'PENDING' ? (
                          <>
                            <div title="Approve" onClick={() => handleDecision(record.id, 'APPROVED')} style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#16a34a' }}>
                              <Check size={14} />
                            </div>
                            <div title="Reject" onClick={() => handleDecision(record.id, 'REJECTED')} style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}>
                              <X size={14} />
                            </div>
                          </>
                        ) : null}
                        <div style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                          <Eye size={14} />
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
            Showing {filteredRecords.length} of {records.length} requests
          </div>
        </div>
        </>
        )}

      </div>

      {/* New Leave Request Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <CalendarDays size={24} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>New Leave Request</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Submit a request for leave</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>i</div>
                <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: '1.4' }}>
                  Your leave request will be reviewed by your reporting manager or administrator. You will be notified once a decision is made.
                </p>
              </div>

              <form id="add-leave-form" onSubmit={handleCreateLeave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Employee <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        required
                        value={newLeave.employeeId}
                        onChange={(e) => {
                          const emp = employees.find(emp => emp.id.toString() === e.target.value);
                          setNewLeave({ 
                            ...newLeave, 
                            employeeId: e.target.value, 
                            employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '' 
                          });
                        }}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none', backgroundColor: 'white', boxSizing: 'border-box', color: '#0f172a' }}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.employeeCode})</option>
                        ))}
                      </select>
                      <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Leave Type <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        required
                        value={newLeave.leaveType}
                        onChange={(e) => setNewLeave({...newLeave, leaveType: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none', backgroundColor: 'white', boxSizing: 'border-box', color: '#0f172a' }}
                      >
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Annual Leave">Annual Leave</option>
                      </select>
                      <CalendarDays size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Start Date <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="date"
                        required
                        value={newLeave.startDate}
                        onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>End Date <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="date"
                        required
                        value={newLeave.endDate}
                        onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Calculate Days highlight */}
                {newLeave.startDate && newLeave.endDate && (
                  <div style={{ display: 'flex', gap: '20px', backgroundColor: '#f0fdfa', borderRadius: '8px', padding: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderRight: '1px solid #ccfbf1', paddingRight: '20px' }}>
                      <div style={{ backgroundColor: '#ccfbf1', padding: '10px', borderRadius: '8px', color: '#0d9488' }}>
                        <CalendarDays size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Leave Days</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                          {Math.max(0, Math.ceil((new Date(newLeave.endDate) - new Date(newLeave.startDate)) / (1000 * 60 * 60 * 24)) + 1)} Days
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Leave Balance ({newLeave.leaveType})</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0d9488' }}>12 Days Available</div>
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Reason for Leave <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <textarea 
                      required
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                      placeholder="Please provide the reason for your leave request..."
                      rows={4}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '11px', color: '#94a3b8' }}>
                      {newLeave.reason.length}/500
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Supporting Document (Optional)</label>
                  <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                    <CloudUpload size={24} color="#0d9488" />
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      <span style={{ color: '#0d9488', fontWeight: '600' }}>Click to upload</span> or drag and drop
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>PDF, JPG, PNG (Max 5MB)</div>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ backgroundColor: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
              <button form="add-leave-form" type="submit" style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Submit Request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default LeaveRequests;
