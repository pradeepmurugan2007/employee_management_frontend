import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.svg";
import { 
  ChevronDown, HeadphonesIcon, User as UserIcon, Settings as SettingsIcon, LogOut as LogOutIcon
} from "lucide-react";

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
  const navigate = useNavigate();

  // Close sidebar on mobile when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://employee-management-backend-rj6x.onrender.com/api/Todo/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "employees": return <Employees />;
      case "attendance": return <Attendance />;
      case "leave_requests": return <LeaveRequests />;
      case "departments": return <Departments />;
      case "reports": return <Reports />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${!isSidebarOpen ? 'closed' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <a href="#" className="sidebar-logo" style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <img src={logo} alt="EmpLy Logo" style={{ width: '64px', height: '64px', marginRight: '8px' }} />
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0d9488', letterSpacing: '-0.5px' }}>EmpLy</span>
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
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>notifications</span>
              <span style={{ position: 'absolute', top: '1px', right: '2px', backgroundColor: '#ef4444', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid white' }}></span>
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