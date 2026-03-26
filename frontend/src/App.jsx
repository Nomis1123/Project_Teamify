import './App.css'
import Navbar from "./components/Navbar.jsx"
import { Routes, Route} from "react-router-dom"
import Login from "./routes/Login"
import Profile from "./routes/Profile"
import ProfileEdit from './routes/ProfileEdit.jsx'
import { useState, useEffect } from "react"
import Register from './routes/Register.jsx'
import Matchmaking from './routes/Matchmaking.jsx'
import Chat from './routes/Chat.jsx'
import Friends from './routes/Friends.jsx'
import AdminPage from './routes/AdminPage.jsx'

// npm run dev http://localhost:5173/ 

function App() {  

  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // restores the user login state if they have not logged out yet
  useEffect(() => {
    const restoreUser = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    try {
      const res = await fetch("/api/user/me", { // fetch user data from backend
      headers: {
        Authorization: `Bearer ${token}`,
      },})

      if (!res.ok) throw new Error("Invalid token"); // if invalid token, throw error

      const data = await res.json()
      setUser(data.user.username)
      setIsAdmin(data.user.is_admin);
    } catch (err) { // remove the user from their login state if user does not exist in backend
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      setUser(null)
    }
    }
    restoreUser()
  }, [])


  return (
    <>
      <div className="body">
          <Navbar user={user} isAdmin={isAdmin} setUser={setUser} setIsAdmin={setIsAdmin}/>
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin}/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile_editing" element={<ProfileEdit/>} />
            <Route path="/chat" element={<Chat/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/matchmaking" element={<Matchmaking/>} />
            <Route path="/friends" element={<Friends/>} />
            <Route path="/adminPage" element={<AdminPage/>} />
          </Routes>
      </div>
    </>
  )
}

export default App
