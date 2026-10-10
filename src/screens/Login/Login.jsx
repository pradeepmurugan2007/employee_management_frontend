import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.svg";

function Login() {
  const navigate = useNavigate();

  const [view, setView] = useState("login"); // 'login', 'signup', 'forgot'

  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup states
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  // Keep backend URL consistent with Home.jsx
  const API_URL = "https://employee-management-backend-rj6x.onrender.com/api/Todo";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password
      });
      if (response.data === "Login Success") {
        localStorage.setItem("authToken", "emply-token-12345");
        localStorage.setItem("user", JSON.stringify({ username }));
        navigate("/home");
      } else {
        alert("Invalid Username or Password");
      }
    } catch (error) {
      console.error(error);
      alert("Backend Error: " + (error.response?.data?.message || error.message || "Could not connect to server"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== verifyPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/signup`, {
        username: signupUsername,
        password: signupPassword
      });
      alert("Account Created Successfully! Please login.");
      setView("login");
    } catch (error) {
      console.error(error);
      alert("Signup Failed - Make sure your Spring Boot server is running");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        username: resetEmail
      });
      alert(response.data);
      if (response.data === "Recovery email sent") {
        setView("login");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send email. Check backend logs.");
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
          
          {view === "login" && (
            <>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your account</p>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <div 
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-group">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <span className="forgot-link" onClick={() => setView("forgot")}>Forgot password?</span>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="auth-footer">
                Don't have an account? <span className="auth-link" onClick={() => setView("signup")}>Sign Up</span>
              </div>
            </>
          )}

          {view === "signup" && (
            <>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Sign up to get started</p>

              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <div 
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Verify Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showVerifyPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="Confirm your password"
                      value={verifyPassword}
                      onChange={(e) => setVerifyPassword(e.target.value)}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <div 
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}
                      onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    >
                      {showVerifyPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '15px' }}>
                  {loading ? "Creating..." : "Sign Up"}
                </button>
              </form>

              <div className="auth-footer">
                Already have an account? <span className="auth-link" onClick={() => setView("login")}>Login</span>
              </div>
            </>
          )}

          {view === "forgot" && (
            <>
              <h1 className="auth-title">Recover Password</h1>
              <p className="auth-subtitle">Enter your email to receive a recovery link.</p>

              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your registered email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
                  {loading ? "Sending..." : "Send Recovery Link"}
                </button>
              </form>

              <div className="auth-footer">
                Remember your password? <span className="auth-link" onClick={() => setView("login")}>Login</span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;