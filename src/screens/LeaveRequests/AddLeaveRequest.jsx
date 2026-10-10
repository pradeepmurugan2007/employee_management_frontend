import React, { useState, useEffect } from 'react';
import { ArrowLeft, CalendarDays, CloudUpload } from 'lucide-react';
import { createLeaveRequest } from '../../api/leaveApi';
import { getEmployees } from '../../api/employeeApi';
import CustomSelect from '../../components/CustomSelect';

function AddLeaveRequest({ onBack, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'employeeId') {
      const emp = employees.find(emp => emp.id.toString() === value);
      setFormData(prev => ({ 
        ...prev, 
        employeeId: value, 
        employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '' 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.reason) {
      setError('Please fill in all required fields marked with *');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createLeaveRequest({
        employeeId: parseInt(formData.employeeId),
        employeeName: formData.employeeName,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: 'PENDING'
      });
      alert('Leave request submitted successfully!');
      onSaveSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    return Math.max(0, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1);
  };

  return (
    <div>
      {/* Header Area */}
      <div style={{ marginBottom: '24px' }}>
        <div 
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: '500', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}
        >
          <ArrowLeft size={16} /> Back to Leave Requests
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>New Leave Request</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Submit a request for leave</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onBack}
              disabled={loading}
              style={{ backgroundColor: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 24px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left Sidebar */}
        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', borderLeft: '4px solid #10b981' }}>
              <CalendarDays size={18} /> Request Details
            </div>
          </div>

          <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>i</div>
            <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: '1.4' }}>
              Your leave request will be reviewed by your reporting manager or administrator. You will be notified once a decision is made.
            </p>
          </div>
        </div>

        {/* Form Sections */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Request Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Employee <span style={{ color: '#ef4444' }}>*</span></label>
                <CustomSelect 
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Select Employee"
                  options={employees.map(emp => ({ label: `${emp.firstName} ${emp.lastName} (${emp.employeeCode})`, value: emp.id.toString() }))}
                  width="100%"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Leave Type <span style={{ color: '#ef4444' }}>*</span></label>
                <CustomSelect 
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  placeholder="Select Leave Type"
                  options={[
                    { label: 'Casual Leave', value: 'Casual Leave' },
                    { label: 'Sick Leave', value: 'Sick Leave' },
                    { label: 'Annual Leave', value: 'Annual Leave' }
                  ]}
                  width="100%"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Start Date <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>End Date <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#f0fdfa', borderRadius: '8px', padding: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderRight: '1px solid #ccfbf1', paddingRight: '20px' }}>
                  <div style={{ backgroundColor: '#ccfbf1', padding: '10px', borderRadius: '8px', color: '#0d9488' }}>
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Leave Days</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                      {calculateDays()} Days
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Leave Balance ({formData.leaveType})</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0d9488' }}>12 Days Available</div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Reason for Leave <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea 
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide the reason for your leave request..."
                rows={4}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Supporting Document (Optional)</label>
              <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                <CloudUpload size={24} color="#0d9488" />
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  <span style={{ color: '#0d9488', fontWeight: '600' }}>Click to upload</span> or drag and drop
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>PDF, JPG, PNG (Max 5MB)</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLeaveRequest;
