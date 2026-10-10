import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Filter, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import AddEmployee from './AddEmployee';
import { getEmployees, deleteEmployee, updateEmployeeStatus } from '../../api/employeeApi';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees(statusFilter ? { status: statusFilter } : {});
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to load employees. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [statusFilter]);

  const getStatusColor = (status) => {
    if (!status) return '#f1f5f9';
    switch(status.toUpperCase()) {
      case 'ACTIVE': return '#dcfce7';
      case 'ON LEAVE': return '#fef3c7';
      case 'INACTIVE': return '#fee2e2';
      default: return '#f1f5f9';
    }
  };

  const getStatusTextColor = (status) => {
    if (!status) return '#64748b';
    switch(status.toUpperCase()) {
      case 'ACTIVE': return '#16a34a';
      case 'ON LEAVE': return '#d97706';
      case 'INACTIVE': return '#dc2626';
      default: return '#64748b';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch {
      alert('Failed to delete employee.');
    }
  };

  const handleToggleStatus = async (emp) => {
    const newStatus = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateEmployeeStatus(emp.id, newStatus);
      fetchEmployees();
    } catch {
      alert('Failed to update status.');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      fullName.includes(term) ||
      (emp.email || '').toLowerCase().includes(term) ||
      (emp.employeeCode || '').toLowerCase().includes(term)
    );
  });


  if (isAddingEmployee) {
    return <AddEmployee onBack={() => { setIsAddingEmployee(false); fetchEmployees(); }} editData={editingEmployee} />;
  }

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Employees</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Manage your employee information</p>
        </div>
        <button 
          onClick={() => { setEditingEmployee(null); setIsAddingEmployee(true); }}
          style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        
        {/* Filters and Search */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, email or employee ID..." 
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
            onClick={fetchEmployees}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '16px' }}>Loading employees...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
            <div style={{ fontSize: '16px', marginBottom: '12px' }}>{error}</div>
            <button onClick={fetchEmployees} style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: '#0f172a', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '16px 8px' }}>#</th>
                  <th style={{ padding: '16px 8px' }}>Photo</th>
                  <th style={{ padding: '16px 8px' }}>Name</th>
                  <th style={{ padding: '16px 8px' }}>Employee ID</th>
                  <th style={{ padding: '16px 8px' }}>Department</th>
                  <th style={{ padding: '16px 8px' }}>Designation</th>
                  <th style={{ padding: '16px 8px' }}>Email</th>
                  <th style={{ padding: '16px 8px' }}>Joining Date</th>
                  <th style={{ padding: '16px 8px' }}>Status</th>
                  <th style={{ padding: '16px 8px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                      No employees found. Click "Add Employee" to create the first one.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, idx) => {
                    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.employeeName || 'Unknown';
                    return (
                      <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500' }}>{idx + 1}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <img src={emp.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=e2e8f0&color=0f172a`} alt={fullName} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        </td>
                        <td style={{ padding: '16px 8px', color: '#0f172a', fontWeight: '500' }}>{fullName}</td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{emp.employeeCode || '-'}</td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{emp.departmentName || '-'}</td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{emp.designation || '-'}</td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{emp.email || '-'}</td>
                        <td style={{ padding: '16px 8px', color: '#64748b' }}>{emp.joiningDate || '-'}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{ backgroundColor: getStatusColor(emp.status), color: getStatusTextColor(emp.status), padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', display: 'inline-block' }}>
                            {emp.status === 'ACTIVE' ? 'Active' : emp.status === 'INACTIVE' ? 'Inactive' : emp.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', color: '#64748b' }}>
                            <div title="Edit" style={{ cursor: 'pointer' }} onClick={() => { setEditingEmployee(emp); setIsAddingEmployee(true); }}>
                              <Edit2 size={18} />
                            </div>
                            <div title={emp.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} style={{ cursor: 'pointer', color: emp.status === 'ACTIVE' ? '#d97706' : '#16a34a' }} onClick={() => handleToggleStatus(emp)}>
                              <Eye size={18} />
                            </div>
                            <div title="Delete" style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => handleDelete(emp.id)}>
                              <Trash2 size={18} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                Showing {filteredEmployees.length} of {employees.length} employees
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Employees;
