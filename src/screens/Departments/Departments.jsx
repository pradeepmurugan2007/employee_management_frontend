import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, ChevronDown, Building2, Users, CheckCircle2,
  XCircle, Trash2, Edit2, ChevronLeft, ChevronRight, RefreshCw, Eye
} from 'lucide-react';
import { getDepartments, deleteDepartment, updateDepartmentStatus } from '../../api/departmentApi';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) {
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return '#f1f5f9';
    switch(status.toUpperCase()) {
      case 'ACTIVE': return '#dcfce7';
      case 'INACTIVE': return '#fee2e2';
      default: return '#f1f5f9';
    }
  };

  const getStatusTextColor = (status) => {
    if (!status) return '#64748b';
    switch(status.toUpperCase()) {
      case 'ACTIVE': return '#16a34a';
      case 'INACTIVE': return '#dc2626';
      default: return '#64748b';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch {
      alert('Failed to delete department.');
    }
  };

  const handleToggleStatus = async (dept) => {
    const newStatus = dept.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateDepartmentStatus(dept.id, newStatus);
      fetchDepartments();
    } catch {
      alert('Failed to update status.');
    }
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = (dept.departmentName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? dept.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const activeCount = departments.filter(d => d.status === 'ACTIVE').length;
  const inactiveCount = departments.filter(d => d.status === 'INACTIVE').length;
  // TODO: calculate real employee count when backend supports it
  const totalEmployees = 128;

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Departments</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Manage departments in your organization</p>
        </div>
        <button style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}>
          <Plus size={18} />
          Add Department
        </button>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#eaf6f6', padding: '16px', borderRadius: '12px', color: '#0d9488' }}><Building2 size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Total Departments</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{departments.length}</h2>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '12px', color: '#3b82f6' }}><Users size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Total Employees</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{totalEmployees}</h2>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '12px', color: '#10b981' }}><CheckCircle2 size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Active Departments</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{activeCount}</h2>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '12px', color: '#ef4444' }}><XCircle size={32} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px 0' }}>Inactive Departments</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h2 style={{ fontSize: '28px', margin: 0, color: '#0f172a' }}>{inactiveCount}</h2>
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
              placeholder="Search department name..." 
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
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button
            onClick={fetchDepartments}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '16px' }}>Loading departments...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
            <div style={{ fontSize: '16px', marginBottom: '12px' }}>{error}</div>
            <button onClick={fetchDepartments} style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer' }}>
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
                <th style={{ padding: '16px 8px' }}>Department Name</th>
                <th style={{ padding: '16px 8px' }}>Description</th>
                <th style={{ padding: '16px 8px', textAlign: 'center' }}>Employee Count</th>
                <th style={{ padding: '16px 8px' }}>Status</th>
                <th style={{ padding: '16px 8px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                    No departments found.
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept, idx) => (
                  <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500' }}>{idx + 1}</td>
                    <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '600' }}>{dept.departmentName}</td>
                    <td style={{ padding: '16px 8px', color: '#64748b' }}>{dept.description || '-'}</td>
                    <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500', textAlign: 'center' }}>-</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ backgroundColor: getStatusColor(dept.status), color: getStatusTextColor(dept.status), padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', display: 'inline-block' }}>
                        {dept.status === 'ACTIVE' ? 'Active' : dept.status === 'INACTIVE' ? 'Inactive' : dept.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', color: '#64748b' }}>
                        <div title={dept.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} onClick={() => handleToggleStatus(dept)} style={{ cursor: 'pointer', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px', color: dept.status === 'ACTIVE' ? '#d97706' : '#16a34a' }}>
                          <Eye size={16} />
                        </div>
                        <div title="Delete" onClick={() => handleDelete(dept.id)} style={{ cursor: 'pointer', padding: '4px', border: '1px solid #fee2e2', borderRadius: '4px', color: '#ef4444' }}>
                          <Trash2 size={16} />
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
            Showing {filteredDepartments.length} of {departments.length} departments
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}

export default Departments;
