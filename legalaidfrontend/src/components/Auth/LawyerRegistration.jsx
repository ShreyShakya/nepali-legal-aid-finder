"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom" // Added Link and useNavigate
import styles from "./LawyerRegistration.module.css"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function LawyerRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    location: "",
    availability: "",
    bio: "",
    email: "",
    password: ""
  })
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false) // Added to distinguish success/error
  const [isLoading, setIsLoading] = useState(false) // Added for loading state
  const navigate = useNavigate() // Added for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setIsError(false)

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register-lawyer', formData)
      setMessage(response.data.message)
      setIsError(false)
      setFormData({ name: "", specialization: "", location: "", availability: "", bio: "", email: "", password: "" })
      setTimeout(() => navigate('/lawyer-login'), 2000) // Redirect to login after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed")
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className={styles.landingPage}
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

      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <motion.div className={styles.heroContent}>
            <h1>Register as a Lawyer</h1>
            <p>Join our platform to offer your legal expertise.</p>

            <form onSubmit={handleSubmit} className={styles.registrationForm}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.formInput}
                disabled={isLoading}
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization (e.g., Corporate Law)"
                value={formData.specialization}
                onChange={handleChange}
                className={styles.formInput}
                disabled={isLoading}
              />
              <input
                type="text"
                name="location"
                placeholder="Location (e.g., Kathmandu)"
                value={formData.location}
                onChange={handleChange}
                className={styles.formInput}
                disabled={isLoading}
              />
              <input
                type="text"
                name="availability"
                placeholder="Availability (e.g., Mon-Fri 9:00-17:00)"
                value={formData.availability}
                onChange={handleChange}
                className={styles.formInput}
                disabled={isLoading}
              />
              <textarea
                name="bio"
                placeholder="Bio (Tell us about yourself)"
                value={formData.bio}
                onChange={handleChange}
                className={styles.formTextarea}
                disabled={isLoading}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.formInput}
                disabled={isLoading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={styles.formInput}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
            {message && (
              <p className={`${styles.message} ${isError ? styles.error : ''}`}>
                {message}
              </p>
            )}
            <p className={styles.authLink}>
              Already have an account? <Link to="/lawyer-login">Login here</Link>
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}