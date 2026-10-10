import Login from "./screens/Login/Login"
import ResetPassword from "./screens/Login/ResetPassword"
import Home from "./screens/Home/Home"

import {
  Routes,
  Route,
  Navigate
} from "react-router-dom"

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/" />;
};

function App() {

  return (

    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route
        path="/home"
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        }
      />
    </Routes>
  )
}

export default App