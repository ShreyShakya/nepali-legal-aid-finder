"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
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
    password: "",
  })
  const [profilePicture, setProfilePicture] = useState(null) // Added for file upload
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]) // Store the selected file
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setIsError(false)

    // Create a FormData object to send the data as multipart/form-data
    const data = new FormData()
    for (const key in formData) {
      data.append(key, formData[key])
    }
    if (profilePicture) {
      data.append("profile_picture", profilePicture) // Add the profile picture file if selected
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register-lawyer', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type
        },
      })
      setMessage(response.data.message)
      setIsError(false)
      setFormData({ name: "", specialization: "", location: "", availability: "", bio: "", email: "", password: "" })
      setProfilePicture(null) // Reset the file input
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
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <motion.div className={styles.heroContent}>
            <h1>Register as a Lawyer</h1>
            <p>Join our platform to offer your legal expertise.</p>

            <form onSubmit={handleSubmit} className={styles.registrationForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="specialization">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  placeholder="Specialization (e.g., Corporate Law)"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={styles.formInput}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Location (e.g., Kathmandu)"
                  value={formData.location}
                  onChange={handleChange}
                  className={styles.formInput}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="availability">Availability</label>
                <input
                  type="text"
                  id="availability"
                  name="availability"
                  placeholder="Availability (e.g., Mon-Fri 9:00-17:00)"
                  value={formData.availability}
                  onChange={handleChange}
                  className={styles.formInput}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Bio (Tell us about yourself)"
                  value={formData.bio}
                  onChange={handleChange}
                  className={styles.formTextarea}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="profilePicture">Profile Picture (optional)</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.formInput}
                  disabled={isLoading}
                />
              </div>
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