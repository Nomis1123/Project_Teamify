import './App.css'
import Navbar from "./components/Navbar.jsx"
import { Routes, Route} from "react-router-dom"
import Login from "./routes/Login"
import Profile from "./routes/Profile"
import ProfileEdit from './routes/ProfileEdit.jsx'

// npm run dev http://localhost:5173/ 

function App() {

  return (
    <>
      <div className="body">
          <Navbar/>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile_editing" element={<ProfileEdit/>} />
          </Routes>
      </div>
    </>
  )
}

export default App
