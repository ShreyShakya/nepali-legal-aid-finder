"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import axios from "axios"
import styles from "./LawyerRegistration.module.css" // Import new CSS module

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register-lawyer', formData)
      setMessage(response.data.message)
      setFormData({ name: "", specialization: "", location: "", availability: "", bio: "", email: "", password: "" })
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed")
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
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization (e.g., Corporate Law)"
                value={formData.specialization}
                onChange={handleChange}
                className={styles.formInput}
              />
              <input
                type="text"
                name="location"
                placeholder="Location (e.g., Kathmandu)"
                value={formData.location}
                onChange={handleChange}
                className={styles.formInput}
              />
              <input
                type="text"
                name="availability"
                placeholder="Availability (e.g., Mon-Fri 9:00-17:00)"
                value={formData.availability}
                onChange={handleChange}
                className={styles.formInput}
              />
              <textarea
                name="bio"
                placeholder="Bio (Tell us about yourself)"
                value={formData.bio}
                onChange={handleChange}
                className={styles.formTextarea}
              />
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
                Register
              </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}