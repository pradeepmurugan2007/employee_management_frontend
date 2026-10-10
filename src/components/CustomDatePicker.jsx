import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Reusable DatePicker component that reads the appSettings format automatically
const CustomDatePicker = ({ 
  selected, 
  onChange, 
  placeholderText = "Select date", 
  isMonthPicker = false,
  showYearDropdown = true,
  className,
  style
}) => {
  const getFormat = () => {
    const saved = localStorage.getItem('appSettings');
    const format = saved ? JSON.parse(saved)?.dateFormat : 'dd/mm/yyyy';
    
    if (isMonthPicker) return 'MMMM yyyy';

    switch(format) {
      case 'yyyy-mm-dd': return 'yyyy-MM-dd';
      case 'mm/dd/yyyy': return 'MM/dd/yyyy';
      case 'dd/mm/yyyy':
      default: return 'dd/MM/yyyy';
    }
  };

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={getFormat()}
      placeholderText={placeholderText}
      showMonthYearPicker={isMonthPicker}
      showYearDropdown={showYearDropdown}
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      className={className}
      wrapperClassName="custom-datepicker-wrapper"
      customInput={
        <input 
          style={{ 
            width: '100%', 
            padding: '10px 12px', 
            border: '1px solid #e2e8f0', 
            borderRadius: '6px', 
            fontSize: '14px', 
            outline: 'none', 
            boxSizing: 'border-box',
            backgroundColor: 'white',
            color: '#0f172a',
            ...style
          }} 
        />
      }
    />
  );
};

export default CustomDatePicker;
