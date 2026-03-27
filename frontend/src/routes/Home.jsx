import "./Home.css";
import controllerImg from "../assets/controller.png"
import teamify_title from "../assets/Teamify.png"
import { useNavigate } from "react-router-dom"
import { motion, useAnimate } from "framer-motion"
import { useState } from 'react'

export default function Home() {

  const navigate = useNavigate()

  const [isAnimating, setIsAnimating] = useState(false);
  const isLoggedIn = !!localStorage.getItem("access_token");

  // if user is logged, get started redirects them to matchmaking and if not, redirect to login
  const handleGetStarted = () => {
    setIsAnimating(true);

    setTimeout(() => {
      if (isLoggedIn) {
        navigate("/matchmaking");
      } else {
        navigate("/login");
      }
    }, 900); // animation duration when leaving page
  };

  return (
    <section className="home-layout">
      <div className="home-content">
         <motion.img 
          src={teamify_title} 
          className="home-title"
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        <motion.p
          className="home-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          Match, Chat, and jump into your<br />next game together
        </motion.p>

         <motion.button
            className="home-cta"
            onClick={handleGetStarted}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          >
            Get Started
          </motion.button>
        
      </div>
      <div className="home-visual">

        <div className="controller-glow" />
          <motion.img
            src={controllerImg}
            alt="Game Controller"
            className="controller-img"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          />
      </div>

    {isAnimating && (
      <motion.div
        className="reveal-slide"
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    )}
    </section>
  );
}
