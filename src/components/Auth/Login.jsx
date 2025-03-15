"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, CheckCircle } from "lucide-react"
import "./Login.css"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
    // Clear login error when user types
    if (loginError) {
      setLoginError("")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // Send a POST request to the backend login endpoint
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Login successful
          setIsSubmitted(true)
          setLoginError("")
          setTimeout(() => {
            // Redirect to the dashboard or another page
            window.location.href = "/dashboard"
          }, 1000)
        } else {
          // Login failed
          setLoginError(data.error || "Invalid email or password. Please try again.")
        }
      } catch (error) {
        console.error("Error submitting form:", error)
        setLoginError("An error occurred. Please try again later.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="login-page">
      <motion.section className="login-section" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="login-container">
          <motion.div className="login-content" variants={slideUp} transition={{ duration: 0.6 }}>
            <h1>Login to Your Account</h1>
            <p>Access your legal services dashboard and manage your cases.</p>

            {isSubmitted ? (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="success-icon" />
                <h2>Login Successful!</h2>
                <p>You have successfully logged in to your account.</p>
                <a href="/dashboard" className="dashboard-button">
                  Go to Dashboard
                </a>
              </motion.div>
            ) : (
              <motion.form onSubmit={handleSubmit} className="login-form" variants={slideUp}>
                {loginError && <div className="login-error">{loginError}</div>}

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail className="form-icon" size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <Lock className="form-icon" size={18} />
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="forgot-password">
                  <a href="/forgot-password">Forgot your password?</a>
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="submitting">Processing...</span>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="button-icon" size={18} />
                    </>
                  )}
                </button>

                <div className="register-link-container">
                  <p>
                    Don't have an account?{" "}
                    <a href="/register" className="register-link">
                      Click here to register
                    </a>
                  </p>
                </div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}