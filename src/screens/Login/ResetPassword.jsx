import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.svg';
import '../../index.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract email from query params
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/Todo";

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("No email provided in the link.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        username: email,
        password: newPassword
      });
      alert(response.data);
      if (response.data === "Password Reset Successful") {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to reset password. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <img src={logo} alt="EmpLy Logo" className="logo-icon-large" />
          <div className="auth-logo-text">
            <span style={{ color: '#093c44' }}>Emp</span>
            <span style={{ color: '#0d9488' }}>Ly</span>
          </div>
          <div className="auth-logo-sub">Employee Management</div>
          <div className="auth-slogan">
            Manage People<br />Build a Better Team
          </div>
        </div>
        <div className="auth-waves"></div>
        <div className="auth-plant"></div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          
          <h1 className="auth-title">Set New Password</h1>
          <p className="auth-subtitle">Create a new password for {email || "your account"}</p>

          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>

          <div className="auth-footer">
            Remembered it? <span className="auth-link" onClick={() => navigate("/")}>Login instead</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
