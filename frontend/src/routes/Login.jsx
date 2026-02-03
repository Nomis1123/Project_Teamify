import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ( { setUser }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [pwdError, setPwdError] = useState("")
    const [loginMsg, setloginMsg] = useState("")
    const navigate = useNavigate()

    return (
        <div className="Login-layout"> {/* For login box layout */}
            {loginMsg && <div className="login-msg">{loginMsg}</div>}
            <section className="Login-box"> {/* For login box rendering */}
                    <h2 className="title">Welcome Back</h2>
                    <p className="top-text">Sign in to continue your journey</p>

                {/* form calls validateForm on submit, and sets email, password variables with user entered value
                * Outputs error msg upon form submission if any field is invalid */}
                <form className="login-form"> 
                    <label htmlFor="Email">Email</label><br/>
                    <input type="email" 
                        id="Email" 
                        placeholder="Enter your email"
                        onChange={ (e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                    {emailError && <div className="error-msg">{emailError}</div>}

                    <label htmlFor="Password">Password</label><br/>
                    <input type="password" 
                        id="password" 
                        placeholder="Enter your password"
                        onChange={ (e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    {pwdError && <div className="error-msg">{pwdError}</div>}
                    <br />

                    <button type="submit" className="login-button">Login</button><br />
                    <Link to="/register" className="register"> 
                        Don't have an account? Sign up {/* Links to register page on click*/}
                    </Link>
                </form>
            </section>
        </div>
    )
}

export default Login