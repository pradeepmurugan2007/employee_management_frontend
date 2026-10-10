import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Camera, User, Briefcase, Phone, FileText, 
  Calendar, Save, ChevronDown
} from 'lucide-react';
import { createEmployee, updateEmployee } from '../../api/employeeApi';
import { getDepartments } from '../../api/departmentApi';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';

function AddEmployee({ onBack, editData }) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const fileInputRef = React.useRef(null);
  const personalRef = React.useRef(null);
  const jobRef = React.useRef(null);
  const contactRef = React.useRef(null);

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
    address: '',
    photoUrl: null
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
        address: editData.address || '',
        photoUrl: editData.photoUrl || null
      });
      if (editData.photoUrl) {
        setPhotoUrl(editData.photoUrl);
      }
    }
  }, [editData]);

  useEffect(() => {
    // Fetch departments for the dropdown
    getDepartments().then(res => setDepartments(res.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Photo size must be less than 2MB');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
      let errMsg = 'Failed to save employee. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else if (err.response.data.message) {
          errMsg = err.response.data.message;
        } else if (err.response.data.error) {
          errMsg = err.response.data.error;
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId, ref) => {
    setActiveSection(sectionId);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getNavStyle = (isActive) => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '12px 16px', 
    backgroundColor: isActive ? '#eaf6f6' : 'transparent', 
    color: isActive ? '#0d9488' : '#64748b', 
    borderRadius: '8px', 
    fontWeight: '500', 
    fontSize: '14px', 
    cursor: 'pointer', 
    borderLeft: isActive ? '4px solid #0d9488' : '4px solid transparent'
  });

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
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', marginBottom: '16px', overflow: 'hidden' }}>
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Camera size={32} />
              )}
            </div>
            <input 
              type="file" 
              accept="image/png, image/jpeg" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handlePhotoChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{ backgroundColor: 'white', color: '#0d9488', border: '1px solid #0d9488', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '8px', width: '100%' }}
            >
              Upload Photo
            </button>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>JPG, PNG (Max 2MB)</p>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              style={getNavStyle(activeSection === 'personal')} 
              onClick={() => scrollToSection('personal', personalRef)}
            >
              <User size={18} /> Personal Information
            </div>
            <div 
              style={getNavStyle(activeSection === 'job')} 
              onClick={() => scrollToSection('job', jobRef)}
            >
              <Briefcase size={18} /> Job Information
            </div>
            <div 
              style={getNavStyle(activeSection === 'contact')} 
              onClick={() => scrollToSection('contact', contactRef)}
            >
              <Phone size={18} /> Contact Information
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
          
          {/* Personal Information */}
          <div ref={personalRef} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px', marginBottom: '20px' }}>
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
                <CustomDatePicker
                  selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={(date) => {
                    if (date) {
                      const y = date.getFullYear();
                      const m = String(date.getMonth() + 1).padStart(2, '0');
                      const d = String(date.getDate()).padStart(2, '0');
                      setFormData({...formData, dateOfBirth: `${y}-${m}-${d}`});
                    }
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
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
          <div ref={jobRef} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Job Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Employee ID</label>
                <input type="text" value={editData?.employeeCode || 'Auto-generated'} disabled style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', backgroundColor: '#f8fafc', color: '#94a3b8', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Department <span style={{ color: '#ef4444' }}>*</span></label>
                <CustomSelect
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  placeholder="Select department"
                  options={departments.filter(d => d.status === 'ACTIVE').map(dept => ({ label: dept.name, value: dept.name }))}
                  width="100%"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Designation <span style={{ color: '#ef4444' }}>*</span></label>
                <CustomSelect
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Select designation"
                  options={[
                    { label: 'Software Developer', value: 'Software Developer' },
                    { label: 'Senior Developer', value: 'Senior Developer' },
                    { label: 'UI/UX Designer', value: 'UI/UX Designer' },
                    { label: 'Operations Executive', value: 'Operations Executive' },
                    { label: 'Marketing Executive', value: 'Marketing Executive' },
                    { label: 'HR Executive', value: 'HR Executive' },
                    { label: 'Accountant', value: 'Accountant' }
                  ]}
                  width="100%"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Joining Date</label>
                <CustomDatePicker
                  selected={formData.joiningDate ? new Date(formData.joiningDate) : null}
                  onChange={(date) => {
                    if (date) {
                      const y = date.getFullYear();
                      const m = String(date.getMonth() + 1).padStart(2, '0');
                      const d = String(date.getDate()).padStart(2, '0');
                      setFormData({...formData, joiningDate: `${y}-${m}-${d}`});
                    }
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Employment Type</label>
                <CustomSelect
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  placeholder="Select employment type"
                  options={[
                    { label: 'Full Time', value: 'Full Time' },
                    { label: 'Part Time', value: 'Part Time' },
                    { label: 'Contract', value: 'Contract' }
                  ]}
                  width="100%"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Status</label>
                <CustomSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Select status"
                  options={[
                    { label: 'Active', value: 'ACTIVE' },
                    { label: 'Inactive', value: 'INACTIVE' },
                    { label: 'On Leave', value: 'ON_LEAVE' }
                  ]}
                  width="100%"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div ref={contactRef} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px', marginBottom: '20px' }}>
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

