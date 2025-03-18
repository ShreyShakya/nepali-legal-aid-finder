"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import axios from "axios"
import styles from "./LawyerLogin.module.css"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function LawyerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login-lawyer', formData)
      setMessage(response.data.message)
      // Store lawyer data or redirect to dashboard (for now, just log it)
      console.log("Logged in lawyer:", response.data.lawyer)
      setFormData({ email: "", password: "" })
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed")
    }
  }

  return (
    <motion.div
      className={styles.loginPage}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} />
            <span>NepaliLegalAidFinder</span>
          </div>
        </div>
      </header>

      <section className={styles.loginSection}>
        <div className={styles.loginContainer}>
          <motion.div className={styles.loginContent}>
            <h1>Lawyer Login</h1>
            <p>Access your account to manage your legal services.</p>

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.formInput}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={styles.formInput}
              />
              <button type="submit" className={styles.submitButton}>
                Login
              </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}