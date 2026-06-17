import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login() {

  const navigate = useNavigate()

  // =====================================================
  // LOGIN STATES
  // =====================================================

  const [username, setUsername] = useState("")

  const [password, setPassword] = useState("")

  // =====================================================
  // SIGNUP STATES
  // =====================================================

  const [showSignup, setShowSignup] = useState(false)

  const [signupUsername, setSignupUsername] = useState("")

  const [signupPassword, setSignupPassword] = useState("")

  const [verifyPassword, setVerifyPassword] = useState("")

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "https://employee-management-backend-rj6x.onrender.com/api/todo/login",
        {
          username: username,
          password: password
        }
      )

      if (response.data === "Login Success") {

        alert("Login Success")

        navigate("/home")

      } else {

        alert("Invalid Username or Password")
      }

    } catch (error) {

      console.log(error)

      alert("Backend Error")
    }
  }

  // =====================================================
  // SIGNUP
  // =====================================================

  const handleSignup = async () => {

    if (signupPassword !== verifyPassword) {

      alert("Password Not Match")

      return
    }

    try {

      await axios.post(
        "https://employee-management-backend-rj6x.onrender.com/api/todo/signup",
        {
          username: signupUsername,
          password: signupPassword
        }
      )

      alert("Account Created")

      setShowSignup(false)

    } catch (error) {

      console.log(error)

      alert("Signup Failed")
    }
  }

  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2"
      }}
    >

      <div
        style={{
          width: "320px",
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.2)"
        }}
      >

        {
          showSignup ? (

            // =====================================================
            // SIGNUP PAGE
            // =====================================================

            <div>

              <h2
                style={{
                  textAlign: "center",
                  marginBottom: "20px"
                }}
              >
                Sign Up
              </h2>

              <input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={(e) =>
                  setSignupUsername(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px"
                }}
              />

              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) =>
                  setSignupPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px"
                }}
              />

              <input
                type="password"
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) =>
                  setVerifyPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px"
                }}
              />

              <button
                onClick={handleSignup}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Create Account
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "15px"
                }}
              >
                Already have account?

                <span
                  onClick={() =>
                    setShowSignup(false)
                  }
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    marginLeft: "5px"
                  }}
                >
                  Login
                </span>

              </p>

            </div>

          ) : (

            // =====================================================
            // LOGIN PAGE
            // =====================================================

            <div>

              <h2
                style={{
                  textAlign: "center",
                  marginBottom: "20px"
                }}
              >
                Sign In
              </h2>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px"
                }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px"
                }}
              />

              <button
                onClick={handleLogin}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Login
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "15px"
                }}
              >
                Don't have account?

                <span
                  onClick={() =>
                    setShowSignup(true)
                  }
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    marginLeft: "5px"
                  }}
                >
                  Sign Up
                </span>

              </p>

            </div>
          )
        }

      </div>

    </div>
  )
}

export default Login