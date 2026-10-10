import { useState } from "react";
import logo from "../../assets/logo.svg";
import { 
  ChevronDown, HeadphonesIcon
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>home</span> Dashboard
            </div>
            <div className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>group</span> Employees
            </div>
            <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>event</span> Attendance
            </div>
            <div className={`nav-item ${activeTab === 'leave_requests' ? 'active' : ''}`} onClick={() => setActiveTab('leave_requests')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>edit_calendar</span> Leave Requests
            </div>
            <div className={`nav-item ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>account_tree</span> Departments
            </div>
            <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
              <span className="material-symbols-rounded" style={{ marginRight: '12px', fontSize: '20px' }}>leaderboard</span> Reports
            </div>
            <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
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

      {/* Main Content Area */}
      <main className={`main-wrapper ${!isSidebarOpen ? 'sidebar-closed' : ''}`} style={{ backgroundColor: '#f8fafc' }}>
        <header className="topbar" style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>menu</span>
            </div>
            <div className="search-box" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', width: '400px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px', color: '#64748b' }}>search</span>
              <input type="text" placeholder="Search employees, departments, or anything..." style={{ border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px', color: '#0f172a' }} />
            </div>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>notifications</span>
              <span style={{ position: 'absolute', top: '1px', right: '2px', backgroundColor: '#ef4444', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid white' }}></span>
            </div>
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <img src="https://ui-avatars.com/api/?name=Iniyan+M&background=e2e8f0&color=0f172a" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Iniyan M</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Admin</div>
              </div>
              <ChevronDown size={16} color="#64748b" />
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