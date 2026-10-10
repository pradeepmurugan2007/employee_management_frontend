export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const settings = JSON.parse(localStorage.getItem('appSettings')) || {};
  const format = settings.dateFormat || 'dd/mm/yyyy';
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'mm/dd/yyyy': return `${month}/${day}/${year}`;
    case 'yyyy-mm-dd': return `${year}-${month}-${day}`;
    case 'dd/mm/yyyy':
    default: return `${day}/${month}/${year}`;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '-';
  const settings = JSON.parse(localStorage.getItem('appSettings')) || {};
  const format = settings.timeFormat || '12 Hour (AM/PM)';
  
  let date = new Date(timeString);
  if (isNaN(date.getTime())) {
    // Attempt to parse HH:mm or HH:mm:ss
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      date = new Date();
      date.setHours(parseInt(parts[0], 10));
      date.setMinutes(parseInt(parts[1], 10));
      if (parts[2]) date.setSeconds(parseInt(parts[2], 10));
    } else {
      return timeString;
    }
  }

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (format === '24 Hour') {
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  } else {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
  }
};
