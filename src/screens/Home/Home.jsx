import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import logo from "../../assets/logo.svg";
import { 
  ChevronDown, HeadphonesIcon, User as UserIcon, Settings as SettingsIcon, LogOut as LogOutIcon
} from "lucide-react";
import { getNotifications, markAllNotificationsAsRead } from "../../api/notificationApi";

import Dashboard from "../Dashboard/Dashboard";
import Employees from "../Employees/Employees";
import Attendance from "../Attendance/Attendance";
import LeaveRequests from "../LeaveRequests/LeaveRequests";
import Departments from "../Departments/Departments";
import Reports from "../Reports/Reports";
import SettingsPage from "../Settings/Settings";

function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const saved = localStorage.getItem('appSettings');
      if (saved) setAppSettings(JSON.parse(saved));
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    // Fetch notifications
    fetchNotifications();

    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Close sidebar on mobile when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
    setIsProfileDropdownOpen(false);
    setIsNotificationOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/api/Todo/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderContent = () => {
    // We use a unique key based on the formats so that when settings change,
    // the active tab component completely remounts and re-evaluates formatUtils.
    const settingsKey = `${appSettings?.dateFormat}-${appSettings?.timeFormat}`;
    
    switch (activeTab) {
      case "dashboard": return <Dashboard key={settingsKey} />;
      case "employees": return <Employees key={settingsKey} />;
      case "attendance": return <Attendance key={settingsKey} />;
      case "leave_requests": return <LeaveRequests key={settingsKey} />;
      case "departments": return <Departments key={settingsKey} />;
      case "reports": return <Reports key={settingsKey} />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard key={settingsKey} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${!isSidebarOpen ? 'closed' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <a href="#" className="sidebar-logo" style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <img src={appSettings?.companyLogo || logo} alt="EmpLy Logo" style={{ width: '48px', height: '48px', marginRight: '12px', objectFit: 'contain' }} />
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0d9488', letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appSettings?.companyName || 'EmpLy'}</span>
          </a>
          <div className="sidebar-nav">
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>home</span> Dashboard
            </div>
            <div className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => handleTabChange('employees')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>group</span> Employees
            </div>
            <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => handleTabChange('attendance')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>event</span> Attendance
            </div>
            <div className={`nav-item ${activeTab === 'leave_requests' ? 'active' : ''}`} onClick={() => handleTabChange('leave_requests')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>edit_calendar</span> Leave Requests
            </div>
            <div className={`nav-item ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => handleTabChange('departments')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>account_tree</span> Departments
            </div>
            <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => handleTabChange('reports')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>leaderboard</span> Reports
            </div>
            <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => handleTabChange('settings')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>settings</span> Settings
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div style={{ backgroundColor: '#eaf6f6', borderRadius: '12px', padding: '20px', textAlign: 'center', margin: '20px 20px 0 20px' }}>
          <div style={{ backgroundColor: '#0d9488', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'white' }}>
            <HeadphonesIcon size={20} />
          </div>
          <h4 style={{ color: '#093c44', margin: '0 0 5px 0', fontSize: '14px' }}>Need Help?</h4>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 15px 0' }}>Contact administrator for support</p>
          <button style={{ backgroundColor: 'white', color: '#0d9488', border: '1px solid #0d9488', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>Contact Support</button>
        </div>
      </aside>

      <div className={`mobile-overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      
      {/* Main Content Area */}
      <main className={`main-wrapper ${!isSidebarOpen ? 'sidebar-closed' : ''}`} style={{ backgroundColor: '#f8fafc' }}>
        <header className="topbar" style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>menu</span>
            </div>
            <div className="search-box" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', width: '400px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px', color: '#64748b' }}>search</span>
              <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px', color: '#0f172a' }} />
            </div>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <div 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', padding: '8px', borderRadius: '50%', backgroundColor: isNotificationOpen ? '#f1f5f9' : 'transparent' }}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>notifications</span>
                {appSettings?.enableEmailNotifications !== false && notifications.some(n => !n.read) && (
                  <span style={{ position: 'absolute', top: '6px', right: '8px', backgroundColor: '#ef4444', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid white' }}></span>
                )}
              </div>
              
              {isNotificationOpen && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', width: '320px', zIndex: 1000, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>Notifications</div>
                    <div onClick={handleMarkAllRead} style={{ fontSize: '12px', color: '#0d9488', cursor: 'pointer', fontWeight: '500' }}>Mark all as read</div>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {appSettings?.enableEmailNotifications === false ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                        Notifications are disabled in settings.
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                        No notifications.
                      </div>
                    ) : (
                      notifications.map((notif, index) => (
                        <div key={notif.id || index} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', cursor: 'pointer', backgroundColor: notif.read ? 'transparent' : '#f0fdfa' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : '#f0fdfa'}>
                          <div style={{ backgroundColor: notif.type === 'SUCCESS' ? '#dcfce7' : notif.type === 'WARNING' ? '#fef3c7' : '#e0f2fe', color: notif.type === 'SUCCESS' ? '#16a34a' : notif.type === 'WARNING' ? '#d97706' : '#0284c7', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>{notif.type === 'SUCCESS' ? 'check_circle' : notif.type === 'WARNING' ? 'warning' : 'info'}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>{notif.message}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(notif.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '13px', color: '#0d9488', fontWeight: '500', cursor: 'pointer' }}>
                    View all notifications
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <div 
                className="user-profile" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', border: isProfileDropdownOpen ? '1px solid #e2e8f0' : '1px solid transparent', backgroundColor: isProfileDropdownOpen ? '#f8fafc' : 'transparent' }}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <img src="https://ui-avatars.com/api/?name=Iniyan+M&background=e2e8f0&color=0f172a" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div className="user-info-text" style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Iniyan M</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Admin</div>
                </div>
                <ChevronDown size={16} color="#64748b" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </div>

              {isProfileDropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', width: '220px', zIndex: 1000, border: '1px solid #e2e8f0', padding: '8px 0' }}>
                  <div style={{ padding: '8px 16px 12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                    <img src="https://ui-avatars.com/api/?name=Iniyan+M&background=e2e8f0&color=0f172a" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Iniyan M</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Admin</div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#475569', fontSize: '14px', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <UserIcon size={16} /> My Profile
                  </div>
                  <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#475569', fontSize: '14px', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => handleTabChange('settings')}>
                    <SettingsIcon size={16} /> Settings
                  </div>
                  
                  <div style={{ padding: '8px 16px', marginTop: '4px' }}>
                    <div 
                      onClick={handleLogout} 
                      style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fecaca'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    >
                      <LogOutIcon size={18} /> Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content" style={{ padding: '32px' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Home;