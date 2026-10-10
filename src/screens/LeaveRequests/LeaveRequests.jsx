import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, ChevronDown, Filter, CalendarDays,
  ChevronLeft, ChevronRight, Check, X, Eye, 
  FileText, Clock, CheckCircle2, XCircle, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { getLeaveRequests, makeLeaveDecision } from '../../api/leaveApi';

function LeaveRequests() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  useEffect(() => {
    fetchLeaves();
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
        <button style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}>
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
    </div>
  );
}

export default LeaveRequests;
