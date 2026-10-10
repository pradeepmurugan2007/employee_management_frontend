import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Camera, User, Briefcase, Phone, FileText, 
  Calendar, Save
} from 'lucide-react';
import { createEmployee, updateEmployee } from '../../api/employeeApi';

function AddEmployee({ onBack, editData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    phone: '',
    departmentName: '',
    designation: '',
    joiningDate: '',
    employmentType: 'Full Time',
    status: 'ACTIVE',
    address: ''
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        firstName: editData.firstName || '',
        lastName: editData.lastName || '',
        dateOfBirth: editData.dateOfBirth || '',
        gender: editData.gender || 'Male',
        email: editData.email || '',
        phone: editData.phone || '',
        departmentName: editData.departmentName || '',
        designation: editData.designation || '',
        joiningDate: editData.joiningDate || '',
        employmentType: editData.employmentType || 'Full Time',
        status: editData.status || 'ACTIVE',
        address: editData.address || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.email || !formData.departmentName || !formData.designation) {
      setError('Please fill in all required fields marked with *');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (editData?.id) {
        await updateEmployee(editData.id, formData);
        alert('Employee updated successfully!');
      } else {
        await createEmployee(formData);
        alert('Employee created successfully!');
      }
      onBack();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to save employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Area */}
      <div style={{ marginBottom: '24px' }}>
        <div 
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: '500', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}
        >
          <ArrowLeft size={16} /> Back to Employees
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>
              {editData ? 'Edit Employee' : 'Add Employee'}
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Enter the employee details below</p>
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
              {loading ? 'Saving...' : 'Save'}
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
          {/* Photo Upload */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', marginBottom: '16px' }}>
              <Camera size={32} />
            </div>
            <button style={{ backgroundColor: 'white', color: '#0d9488', border: '1px solid #0d9488', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '8px', width: '100%' }}>
              Upload Photo
            </button>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>JPG, PNG (Max 2MB)</p>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#eaf6f6', color: '#0d9488', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', borderLeft: '4px solid #0d9488' }}>
              <User size={18} /> Personal Information
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#64748b', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
              <Briefcase size={18} /> Job Information
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#64748b', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
              <Phone size={18} /> Contact Information
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
          
          {/* Personal Information */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>First Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Enter first name" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Enter last name" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Date of Birth</label>
                <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '12px' }}>Gender</label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', cursor: 'pointer' }}>
                    <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} style={{ accentColor: '#0d9488', width: '16px', height: '16px' }} /> Male
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', cursor: 'pointer' }}>
                    <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} style={{ accentColor: '#0d9488', width: '16px', height: '16px' }} /> Female
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', cursor: 'pointer' }}>
                    <input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} style={{ accentColor: '#0d9488', width: '16px', height: '16px' }} /> Other
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Job Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Employee ID</label>
                <input type="text" value={editData?.employeeCode || 'Auto-generated'} disabled style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', backgroundColor: '#f8fafc', color: '#94a3b8', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Department <span style={{ color: '#ef4444' }}>*</span></label>
                <select name="departmentName" value={formData.departmentName} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#64748b', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Designation <span style={{ color: '#ef4444' }}>*</span></label>
                <select name="designation" value={formData.designation} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#64748b', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  <option value="">Select designation</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Operations Executive">Operations Executive</option>
                  <option value="Marketing Executive">Marketing Executive</option>
                  <option value="HR Executive">HR Executive</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Joining Date</label>
                <input name="joiningDate" value={formData.joiningDate} onChange={handleChange} type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Employment Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#64748b', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Enter email address" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Enter phone number" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter full address..." rows={2} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddEmployee;

