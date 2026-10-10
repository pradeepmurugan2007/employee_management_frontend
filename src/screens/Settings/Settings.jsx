import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, CalendarDays, Clock, ShieldCheck, 
  Bell, Database, Upload, Info
} from 'lucide-react';
import logo from "../../assets/logo.svg";
import CustomSelect from '../../components/CustomSelect';

function Settings() {
  const defaultSettings = {
    companyName: 'EmpLy',
    emailAddress: 'info@emply.com',
    phoneNumber: '9876543210',
    address: '123, Business Park,\nCoimbatore, Tamil\nNadu - 641001',
    website: 'https://www.emply.com',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '12 Hour (AM/PM)',
    language: 'English',
    itemsPerPage: '10',
    enableDarkMode: false,
    enableEmailNotifications: true,
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false,
    sessionTimeout: 30,
    autoLogout: true,
    allowMultipleSessions: false,
    rememberMeDuration: 7
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(defaultSettings);
      localStorage.removeItem('appSettings');
    }
  };

  return (
    <div>
      {/* Header Area */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Settings</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Manage application settings and configurations</p>
      </div>

      {/* Horizontal Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#eaf6f6', color: '#0d9488', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: '1px solid #0d9488', whiteSpace: 'nowrap' }}>
          <SettingsIcon size={18} /> General
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#64748b', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
          <CalendarDays size={18} /> Leave Settings
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#64748b', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
          <Clock size={18} /> Attendance Settings
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#64748b', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
          <ShieldCheck size={18} /> User Roles & Permissions
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#64748b', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
          <Bell size={18} /> Notifications
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#64748b', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
          <Database size={18} /> System
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '24px' }}>
        
        {/* Company Information */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Company Information</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>Update your organization details</p>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Logo Box */}
            <div style={{ width: '160px', height: '180px', border: '1px dashed #cbd5e1', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
              <img src={logo} alt="Company Logo" style={{ width: '80px', height: '80px', marginBottom: '16px' }} />
              <button style={{ backgroundColor: 'white', color: '#0d9488', border: '1px solid #0d9488', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                <Upload size={14} /> Change Logo
              </button>
              <p style={{ color: '#94a3b8', fontSize: '11px', margin: '8px 0 0 0' }}>JPG, PNG (Max 2MB)</p>
            </div>

            {/* Inputs */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '250px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Company Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={settings.companyName} onChange={e => handleChange('companyName', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="email" value={settings.emailAddress} onChange={e => handleChange('emailAddress', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Phone Number</label>
                  <input type="tel" value={settings.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Address</label>
                  <textarea value={settings.address} onChange={e => handleChange('address', e.target.value)} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Website</label>
                <input type="url" value={settings.website} onChange={e => handleChange('website', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Application Preferences */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Application Preferences</h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>Configure basic application settings</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Date Format <span style={{ color: '#ef4444' }}>*</span></label>
              <CustomSelect
                value={settings.dateFormat}
                onChange={val => handleChange('dateFormat', val)}
                placeholder="Select Date Format"
                options={[
                  { label: 'dd/mm/yyyy', value: 'dd/mm/yyyy' },
                  { label: 'mm/dd/yyyy', value: 'mm/dd/yyyy' },
                  { label: 'yyyy-mm-dd', value: 'yyyy-mm-dd' }
                ]}
                width="100%"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Time Format <span style={{ color: '#ef4444' }}>*</span></label>
              <CustomSelect
                value={settings.timeFormat}
                onChange={val => handleChange('timeFormat', val)}
                placeholder="Select Time Format"
                options={[
                  { label: '12 Hour (AM/PM)', value: '12 Hour (AM/PM)' },
                  { label: '24 Hour', value: '24 Hour' }
                ]}
                width="100%"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Default Language <span style={{ color: '#ef4444' }}>*</span></label>
              <CustomSelect
                value={settings.language}
                onChange={val => handleChange('language', val)}
                placeholder="Select Language"
                options={[
                  { label: 'English', value: 'English' },
                  { label: 'Spanish', value: 'Spanish' },
                  { label: 'French', value: 'French' }
                ]}
                width="100%"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Items Per Page</label>
              <CustomSelect
                value={settings.itemsPerPage}
                onChange={val => handleChange('itemsPerPage', val)}
                placeholder="Items Per Page"
                options={[
                  { label: '10', value: '10' },
                  { label: '25', value: '25' },
                  { label: '50', value: '50' },
                  { label: '100', value: '100' }
                ]}
                width="100%"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div onClick={() => handleChange('enableDarkMode', !settings.enableDarkMode)} style={{ width: '40px', height: '22px', backgroundColor: settings.enableDarkMode ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.enableDarkMode ? 'auto' : '2px', right: settings.enableDarkMode ? '2px' : 'auto', transition: 'all 0.2s' }}></div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>Enable Dark Mode</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Allow users to switch to dark theme</div>
                </div>
              </div>
              <Info size={16} color="#94a3b8" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div onClick={() => handleChange('enableEmailNotifications', !settings.enableEmailNotifications)} style={{ width: '40px', height: '22px', backgroundColor: settings.enableEmailNotifications ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.enableEmailNotifications ? 'auto' : '2px', right: settings.enableEmailNotifications ? '2px' : 'auto', transition: 'all 0.2s' }}></div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>Enable Email Notifications</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Send system notifications via email</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button onClick={handleReset} style={{ backgroundColor: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Reset
            </button>
            <button onClick={handleSave} style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Policy */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Password Policy</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>Set password requirements for all users</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#0f172a' }}>Minimum Password Length</div>
            <input type="number" value={settings.minPasswordLength} onChange={e => handleChange('minPasswordLength', e.target.value)} style={{ width: '60px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', textAlign: 'center', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Uppercase Letter</div>
              <div onClick={() => handleChange('requireUppercase', !settings.requireUppercase)} style={{ width: '40px', height: '22px', backgroundColor: settings.requireUppercase ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.requireUppercase ? 'auto' : '2px', right: settings.requireUppercase ? '2px' : 'auto' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Lowercase Letter</div>
              <div onClick={() => handleChange('requireLowercase', !settings.requireLowercase)} style={{ width: '40px', height: '22px', backgroundColor: settings.requireLowercase ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.requireLowercase ? 'auto' : '2px', right: settings.requireLowercase ? '2px' : 'auto' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Number</div>
              <div onClick={() => handleChange('requireNumber', !settings.requireNumber)} style={{ width: '40px', height: '22px', backgroundColor: settings.requireNumber ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.requireNumber ? 'auto' : '2px', right: settings.requireNumber ? '2px' : 'auto' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Special Character</div>
              <div onClick={() => handleChange('requireSpecialChar', !settings.requireSpecialChar)} style={{ width: '40px', height: '22px', backgroundColor: settings.requireSpecialChar ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.requireSpecialChar ? 'auto' : '2px', right: settings.requireSpecialChar ? '2px' : 'auto' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Session Settings</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>Manage user session and security settings</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '24px', columnGap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Session Timeout (minutes)</div>
                <input type="number" value={settings.sessionTimeout} onChange={e => handleChange('sessionTimeout', e.target.value)} style={{ width: '60px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', textAlign: 'center', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Auto Logout on Inactivity</div>
                <div onClick={() => handleChange('autoLogout', !settings.autoLogout)} style={{ width: '40px', height: '22px', backgroundColor: settings.autoLogout ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.autoLogout ? 'auto' : '2px', right: settings.autoLogout ? '2px' : 'auto' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Allow Multiple Login Sessions</div>
                <div onClick={() => handleChange('allowMultipleSessions', !settings.allowMultipleSessions)} style={{ width: '40px', height: '22px', backgroundColor: settings.allowMultipleSessions ? '#0d9488' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.allowMultipleSessions ? 'auto' : '2px', right: settings.allowMultipleSessions ? '2px' : 'auto' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Remember Me Duration (days)</div>
                <input type="number" value={settings.rememberMeDuration} onChange={e => handleChange('rememberMeDuration', e.target.value)} style={{ width: '60px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', textAlign: 'center', outline: 'none' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;
