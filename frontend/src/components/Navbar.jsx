import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = ( {user} ) => {
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
                    <Link to="/login" className="login">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar