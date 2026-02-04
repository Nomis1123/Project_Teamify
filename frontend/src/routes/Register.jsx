import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Register = ( ) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [pwdError, setPwdError] = useState("")
    const [registerMsg, setRegisterMsg] = useState("")
    const navigate = useNavigate()

    // If user modifies email or password, empty error msg
    useEffect(() => {
        setUsernameError('')
        setEmailError('')
        setPwdError('')
    }, [username, email, password])

    // validates the form components and output error msg if needed 
    const validateForm = async (e) => {
        e.preventDefault() //Prevents default behaviour from reloading the page 

        let valid = true

        setEmailError("")
        setPwdError("")

        // TODO: check if email already exists

        // This regex for a valid username is found online
        // output error if username is empty, includes spaces, special characters, <3 letters, or >20 letters
        const usernameRegex = /^[A-Za-z0-9]{3,20}$/
        if (username === "" || !usernameRegex.test(username)) {
            setUsernameError("Username cannot include spaces, special characters, and must be 3-20 letters")
            valid = false
        }

        // This regex for a valid email is found online
        // output error if email is empty, or does not fit the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (email === "" || !emailRegex.test(email)) {
            setEmailError("Email empty or incorrect format")
            valid = false
        }
        
        // This regex for a valid password is found online
        // output error if the password is empty, does not have at least one letter, at least one number, and min 8 letters
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
        if (password == "" || !passRegex.test(password)) {
            setPwdError("Password must include at least one letter, one number, and minimum 8 letters")
            valid = false
        }

        if (!valid) return

        // call backend api to check if registeration successful
        let success = await onRegisterSubmit(username, email, password)

        if (success) {
            console.log("Register success!")
            navigate("/login") //redirect to login page
        }else {
            setRegisterMsg("Register failed, please try again.")
            console.log("Registration failed!")
        }
    }

    // send registeration data and get response from db to check if registeration is successful
    // Return true if user registration succeeded, else false
    const onRegisterSubmit = async (username, email, password) => {
        // TODO: send username, email and password to database

        return true
    } 

    return (
        <div className="Login-layout"> {/* For login box layout */}
            {registerMsg && <div className="login-msg">{registerMsg}</div>}
            <section className="Login-box"> {/* For login box rendering*/}
                    <h2 className="title">Join the Family</h2>
                    <p className="top-text">Register to meet your gaming crew</p>

                {/* form calls validateForm on submit, and sets email, password variables with user entered value
                * Outputs error msg upon form submission if any field is invalid */}
                <form onSubmit={validateForm} className="login-form"> 
                    <label htmlFor="Username">Username</label><br/>
                    <input type="text" 
                        id="Username" 
                        placeholder="Enter an username"
                        onChange={ (e) => setUsername(e.target.value)}
                        value={username}
                        required
                    />
                    {usernameError && <div className="error-msg">{usernameError}</div>}
                    
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

                    <button type="submit" className="login-button">Join</button><br />
                    <Link to="/login" className="register"> {/* className kept as register for Login.css */}
                        Already have an account? Sign in {/* Links to login page on click */}
                    </Link>
                </form>
            </section>
        </div>
    )
}

export default Register