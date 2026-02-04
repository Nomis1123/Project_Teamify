import './App.css'
import Navbar from "./components/Navbar.jsx"
import { Routes, Route} from "react-router-dom"
import Login from "./routes/Login"
import Profile from "./routes/Profile"
import ProfileEdit from './routes/ProfileEdit.jsx'
import Register from './routes/Register.jsx'
import { useState } from "react"

// npm run dev http://localhost:5173/ 

function App() {

  const [user, setUser] = useState("")

  return (
    <>
      <div className="body">
          <Navbar user={user}/>
          <Routes>
            <Route path="/login" element={<Login setUser={setUser}/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile_editing" element={<ProfileEdit/>} />
            <Route path="/register" element={<Register/>} />
          </Routes>
      </div>
    </>
  )
}

export default App
