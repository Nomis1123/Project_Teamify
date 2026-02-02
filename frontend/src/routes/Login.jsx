import React from 'react'
import './Login.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [pwdError, setPwdError] = useState("")
    const [loginMsg, setloginMsg] = useState("")
    const navigate = useNavigate()

    // If user modifies email or password, empty error msg
    useEffect(() => {
        setEmailError('')
        setPwdError('')
    }, [email, password])

    // validates the form components and output error msg if needed. 
    const validateForm = async (e) => {
        e.preventDefault() //Prevents default behaviour from reloading the page 

        console.log(email, password)
        let valid = true

        setEmailError("")
        setPwdError("")

        // This regex for a valid email is found online
        // output error for email if email does not fit the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (email === "" || !emailRegex.test(email)) {
            setEmailError("Email empty or incorrect format")
            valid = false
        }
        
        // This regex for a valid password is found online
        // output error if the password does not have at least one letter, at least one number, and 8 or more length
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
        if (password == "" || !passRegex.test(password)) {
            setPwdError("Password need at least one letter, one number, and 8 letters")
            valid = false
        }

        if (!valid) return

        // if login format is valid, call backend api to check if user exists
        let success = await checkCredentials(email, password)

        if (success) {
            console.log("login success!")
            navigate("/profile") // redirect to profile page for now, until matchmaking gets implemented
        }else {
            console.log("login failed!")
        }
    }

    // function used to fetch and get response from database to check if user exists
    // Return true if user exists, and false otherwise
    const checkCredentials = async (email, password) => {
        // TODO: to be implemented
        return true
    } 

    return (
        <div className="Login-layout"> {/* For login box layout */}
            <section className="Login-box"> {/* For login box rendering */}
                    <h2 className="title">Welcome Back</h2>
                    <p className="top-text">Sign in to continue your journey</p>

                {/* form calls validateForm on submit, and sets email, password variables with user entered value
                * Outputs error msg upon form submission if any field is invalid */}
                <form onSubmit={validateForm} className="login-form"> 
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