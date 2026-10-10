import React from 'react';
import { 
  Settings as SettingsIcon, CalendarDays, Clock, ShieldCheck, 
  Bell, Database, Upload, Info
} from 'lucide-react';
import logo from "../../assets/logo.svg";

function Settings() {
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
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
                  <input type="text" defaultValue="EmpLy" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="email" defaultValue="info@emply.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Phone Number</label>
                  <input type="tel" defaultValue="9876543210" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Address</label>
                  <textarea defaultValue="123, Business Park,&#10;Coimbatore, Tamil&#10;Nadu - 641001" rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Website</label>
                <input type="url" defaultValue="https://www.emply.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Date Format <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                <option>dd/mm/yyyy</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Time Format <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                <option>12 Hour (AM/PM)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Default Language <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                <option>English</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' }}>Items Per Page</label>
              <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                <option>10</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Toggle Off */}
                <div style={{ width: '40px', height: '22px', backgroundColor: '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>Enable Dark Mode</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Allow users to switch to dark theme</div>
                </div>
              </div>
              <Info size={16} color="#94a3b8" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Toggle On */}
              <div style={{ width: '40px', height: '22px', backgroundColor: '#0d9488', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>Enable Email Notifications</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Send system notifications via email</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button style={{ backgroundColor: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Reset
            </button>
            <button style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}>
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
            <input type="number" defaultValue="8" style={{ width: '60px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', textAlign: 'center', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Uppercase Letter</div>
              <div style={{ width: '40px', height: '22px', backgroundColor: '#0d9488', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Lowercase Letter</div>
              <div style={{ width: '40px', height: '22px', backgroundColor: '#0d9488', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Number</div>
              <div style={{ width: '40px', height: '22px', backgroundColor: '#0d9488', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#0f172a' }}>Require Special Character</div>
              <div style={{ width: '40px', height: '22px', backgroundColor: '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Session Settings</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>Manage user session and security settings</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', columnGap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Session Timeout (minutes)</div>
                <input type="number" defaultValue="30" style={{ width: '60px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', textAlign: 'center', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Auto Logout on Inactivity</div>
                <div style={{ width: '40px', height: '22px', backgroundColor: '#0d9488', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Allow Multiple Login Sessions</div>
                <div style={{ width: '40px', height: '22px', backgroundColor: '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Remember Me Duration (days)</div>
                <input type="number" defaultValue="7" style={{ width: '60px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', textAlign: 'center', outline: 'none' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;
