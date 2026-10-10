import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const API_URL = "https://employee-management-backend-rj6x.onrender.com/api/todo";
  // use localhost for testing if needed
  // const API_URL = "http://localhost:8080/api/todo";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password
      });
      if (response.data === "Login Success") {
        navigate("/home");
      } else {
        alert("Invalid Username or Password");
      }
    } catch (error) {
      console.error(error);
      alert("Backend Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== verifyPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/signup`, {
        username: signupUsername,
        password: signupPassword
      });
      alert("Account Created Successfully!");
      setIsLoginView(true);
    } catch (error) {
      console.error(error);
      alert("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        username: forgotPasswordEmail
      });
      alert(response.data);
      if (response.data === "Password sent to email") {
        setIsForgotPasswordView(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send password reset");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', sans-serif",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginTop: "10px",
  };

  const linkStyle = {
    color: "#764ba2",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "5px"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {isForgotPasswordView ? (
          <form onSubmit={handleForgotPassword}>
            <h2 style={{ marginBottom: "10px", color: "#333", fontSize: "28px" }}>Recover Password</h2>
            <p style={{ color: "#666", marginBottom: "30px" }}>Enter your email to receive your password.</p>
            <input
              type="email"
              placeholder="Email (Username)"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Sending..." : "Send Password"}
            </button>
            <p style={{ marginTop: "20px", color: "#666" }}>
              Remember your password? 
              <span onClick={() => setIsForgotPasswordView(false)} style={linkStyle}>Login</span>
            </p>
          </form>
        ) : isLoginView ? (
          <form onSubmit={handleLogin}>
            <h2 style={{ marginBottom: "10px", color: "#333", fontSize: "28px" }}>Welcome Back</h2>
            <p style={{ color: "#666", marginBottom: "30px" }}>Please login to your account</p>
            <input
              type="text"
              placeholder="Username (Email)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <span onClick={() => setIsForgotPasswordView(true)} style={{...linkStyle, fontSize: "14px"}}>Forgot Password?</span>
            </div>
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p style={{ marginTop: "20px", color: "#666" }}>
              Don't have an account? 
              <span onClick={() => setIsLoginView(false)} style={linkStyle}>Sign Up</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <h2 style={{ marginBottom: "10px", color: "#333", fontSize: "28px" }}>Create Account</h2>
            <p style={{ color: "#666", marginBottom: "30px" }}>Sign up to get started</p>
            <input
              type="text"
              placeholder="Username (Email)"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Verify Password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
            <p style={{ marginTop: "20px", color: "#666" }}>
              Already have an account? 
              <span onClick={() => setIsLoginView(true)} style={linkStyle}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;