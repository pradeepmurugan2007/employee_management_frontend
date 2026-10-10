import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder, width, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  const handleChange = (val) => {
    if (name) {
      onChange({ target: { name, value: val } });
    } else {
      onChange(val);
    }
    setIsOpen(false);
  };

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
              onClick={() => handleChange('')}
              style={{ padding: '10px 16px', fontSize: '14px', color: value === '' ? '#0d9488' : '#475569', cursor: 'pointer', backgroundColor: value === '' ? '#f0fdfa' : 'transparent', fontWeight: value === '' ? '500' : '400' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = value === '' ? '#f0fdfa' : '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = value === '' ? '#f0fdfa' : 'transparent'}
            >
              {placeholder}
            </div>
            {options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => handleChange(opt.value)}
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

export default CustomSelect;
