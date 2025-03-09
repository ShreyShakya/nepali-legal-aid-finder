"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Scale, User, Phone, Mail, MapPin, ArrowRight, CheckCircle, Lock } from "lucide-react"
import "./Registration.css"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    city: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsSubmitted(true)
        // Reset form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          password: "",
          city: "",
        })
      } catch (error) {
        console.error("Error submitting form:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="registration-page">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Scale className="logo-icon" />
            <span>LegalEdge</span>
          </div>
          <nav className="main-nav">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#attorneys">Attorneys</a>
              </li>
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <motion.section className="registration-section" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="registration-container">
          <motion.div className="registration-content" variants={slideUp} transition={{ duration: 0.6 }}>
            <h1>Register for Legal Services</h1>
            <p>Complete the form below to register for our legal services. Our team will contact you shortly.</p>

            {isSubmitted ? (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="success-icon" />
                <h2>Registration Successful!</h2>
                <p>Thank you for registering with LegalEdge. One of our representatives will contact you soon.</p>
                <button className="return-button" onClick={() => setIsSubmitted(false)}>
                  Register Another Client
                </button>
              </motion.div>
            ) : (
              <motion.form onSubmit={handleSubmit} className="registration-form" variants={slideUp}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      <User className="form-icon" size={18} />
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "error" : ""}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">
                      <User className="form-icon" size={18} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "error" : ""}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <Phone className="form-icon" size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={errors.phoneNumber ? "error" : ""}
                  />
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>

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

                <div className="form-group">
                  <label htmlFor="city">
                    <MapPin className="form-icon" size={18} />
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="submitting">Processing...</span>
                  ) : (
                    <>
                      Register Now
                      <ArrowRight className="button-icon" size={18} />
                    </>
                  )}
                </button>

                <div className="login-link-container">
                  <p>
                    Already have an account?{" "}
                    <a href="/login" className="login-link">
                      Click here to login
                    </a>
                  </p>
                </div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </motion.section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} LegalEdge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

