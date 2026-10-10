import Login from "./screens/Login/Login"
import ResetPassword from "./screens/Login/ResetPassword"
import Home from "./screens/Home/Home"

import {
  Routes,
  Route
} from "react-router-dom"

function App() {

  return (

    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route
        path="/home"
        element={<Home />}
      />
    </Routes>
  )
}

export default App