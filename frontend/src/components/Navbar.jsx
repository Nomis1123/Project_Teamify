import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { useNavigate } from "react-router-dom";

const Navbar = ( {user, setUser} ) => {

    const navigate = useNavigate();

    // set the website to an unlogged state and redirect to login
    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include", // includes cookies when sending request
            })
        }catch (err) {
            console.log(err)
        }
        // remove token and user from local storage 
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        navigate("/login") 
        setUser(null)
    }

    return (
        <nav className="navbar">
            <Link to="/"> 
            <div className="nav-left">
                {/* logo? */}
                Teamify
            </div>
            </Link>
            <div className="nav-center-right">
                <div className="nav-center">
                    <Link to="/profile" className="profile">
                        Profile
                    </Link>
                    <Link to="/matchmaking" className="matchmaking">
                        Matchmaking
                    </Link>
                    <Link to="/guides" className="guides">
                        Guides
                    </Link>
                    <Link to="/friends" className="friends">
                        Friends
                    </Link>
                </div>

                <div className="nav-right">
                    {/* if user is logged in, display logout button, else Login link */}
                    { user ? <a onClick={logout}> Logout </a> :
                    <Link to="/login" className="login">
                        Login
                    </Link>
                    }   
                </div>
            </div>
        </nav>
    )
}

export default Navbar