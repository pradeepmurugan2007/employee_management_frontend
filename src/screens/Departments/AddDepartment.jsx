import React, { useState } from 'react';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { createDepartment } from '../../api/departmentApi';
import CustomSelect from '../../components/CustomSelect';

const STANDARD_DEPARTMENTS = [
  { name: "Software Development", code: "DEV" },
  { name: "Human Resources", code: "HR" },
  { name: "Finance", code: "FIN" },
  { name: "Marketing", code: "MKT" },
  { name: "Sales", code: "SAL" },
  { name: "Customer Support", code: "CS" },
  { name: "Quality Assurance", code: "QA" },
  { name: "Operations", code: "OPS" },
  { name: "Design", code: "DES" },
  { name: "Product Management", code: "PM" },
  { name: "IT Support", code: "IT" },
  { name: "Legal", code: "LEG" }
];

function AddDepartment({ onBack, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'ACTIVE'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const selectedDept = STANDARD_DEPARTMENTS.find(d => d.name === value);
      setFormData(prev => ({ 
        ...prev, 
        name: value,
        code: selectedDept ? selectedDept.code : prev.code
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code || !formData.status) {
      setError('Please fill in all required fields marked with *');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createDepartment({
        name: formData.name, // Fixed: was departmentName but backend expects name
        code: formData.code,
        description: formData.description,
        status: formData.status
      });
      alert('Department created successfully!');
      onSaveSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to save department. Please try again.');
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
          <ArrowLeft size={16} /> Back to Departments
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Add Department</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Enter the department details below</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#eaf6f6', color: '#0d9488', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', borderLeft: '4px solid #0d9488' }}>
              <Building2 size={18} /> Department Information
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px 0' }}>Department Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Department Name <span style={{ color: '#ef4444' }}>*</span></label>
                <CustomSelect
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Select a Department"
                  options={STANDARD_DEPARTMENTS.map(dept => ({ label: dept.name, value: dept.name }))}
                  width="100%"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Department Code <span style={{ color: '#ef4444' }}>*</span></label>
                <input name="code" value={formData.code} readOnly type="text" placeholder="Auto-generated" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc', color: '#64748b' }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter a brief description..." rows={4} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>Status <span style={{ color: '#ef4444' }}>*</span></label>
                <CustomSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Select Status"
                  options={[
                    { label: 'Active', value: 'ACTIVE' },
                    { label: 'Inactive', value: 'INACTIVE' }
                  ]}
                  width="100%"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddDepartment;
