"use client"

import { useState, useEffect } from "react"
import { Scale, Menu, Sun, Moon } from "lucide-react"
import axios from "axios"
import { useNavigate, NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import styles from "./LawyerDashboard.module.css"

export default function LawyerDashboard() {
  const [lawyer, setLawyer] = useState(null)
  const [cases, setCases] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({ new_password: "" })
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const navigate = useNavigate()

  // Theme toggle
  useEffect(() => {
    document.body.className = theme === 'dark' ? styles.darkTheme : ''
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // Notification helper
  const addNotification = (message, type = 'success') => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  // Fetch profile and cases
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        addNotification("Please log in to access the dashboard", "error")
        navigate('/lawyer-login')
        return
      }

      setIsLoading(true)
      try {
        const [profileResponse, casesResponse] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/lawyer-profile', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])
        setLawyer(profileResponse.data.lawyer)
        setFormData(profileResponse.data.lawyer)
        setCases(casesResponse.data.cases)
      } catch (err) {
        addNotification(err.response?.data?.error || "Failed to load data", "error")
        localStorage.removeItem('token')
        localStorage.removeItem('lawyer')
        navigate('/lawyer-login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('lawyer')
    addNotification("Logged out successfully", "success")
    navigate('/lawyer-login')
  }

  // Profile editing
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.put('http://127.0.0.1:5000/api/lawyer-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLawyer(response.data.lawyer)
      localStorage.setItem('lawyer', JSON.stringify(response.data.lawyer))
      setIsEditingProfile(false)
      addNotification(response.data.message || "Profile updated successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Password editing
  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPasswordData({ ...passwordData, [e.target.name]: value })
    setPasswordError(value.length < 8 ? "Password must be at least 8 characters" : "")
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (passwordError) return
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.put('http://127.0.0.1:5000/api/lawyer-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPasswordData({ new_password: "" })
      setIsEditingPassword(false)
      addNotification(response.data.message || "Password updated successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update password", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Case actions
  const handleAcceptCase = async (caseId) => {
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/lawyer-case/${caseId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const casesResponse = await axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCases(casesResponse.data.cases)
      addNotification(response.data.message || "Case accepted successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to accept case", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectCase = async (caseId) => {
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/lawyer-case/${caseId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const casesResponse = await axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCases(casesResponse.data.cases)
      addNotification(response.data.message || "Case rejected successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to reject case", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (!lawyer) {
    return (
      <div className={`${styles.dashboardPage} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <div className={styles.loader}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={`${styles.dashboardPage} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            <Menu className={styles.menuIcon} />
          </button>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} />
            <span>NepaliLegalAidFinder</span>
          </div>
          <div className={styles.headerActions}>
            <button onClick={toggleTheme} className={styles.themeButton}>
              {theme === 'light' ? <Moon /> : <Sun />}
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.notificationContainer}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`${styles.notification} ${notification.type === 'error' ? styles.errorNotification : styles.successNotification}`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isLoading && <div className={styles.loaderOverlay}><div className={styles.loader}></div></div>}

      <div className={styles.layout}>
        <nav className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.sidebarHidden}`}>
          <h2>Dashboard</h2>
          <ul>
            <li><NavLink to="#profile" onClick={toggleSidebar}>Profile</NavLink></li>
            <li><NavLink to="#cases" onClick={toggleSidebar}>Cases</NavLink></li>
            <li><NavLink to="#settings" onClick={toggleSidebar}>Settings</NavLink></li>
          </ul>
        </nav>

        <main className={styles.main}>
          <div className={styles.dashboardContent}>
            <h1 className={styles.title}>Welcome, {lawyer.name}</h1>

            {/* Profile Section */}
            <div className={styles.profileCard} id="profile">
              <h2 className={styles.sectionTitle}>Your Profile</h2>
              {isEditingProfile ? (
                <form onSubmit={handleProfileSave} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} className={styles.formInput} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Specialization:</label>
                    <input type="text" name="specialization" value={formData.specialization || ""} onChange={handleProfileChange} className={styles.formInput} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location || ""} onChange={handleProfileChange} className={styles.formInput} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Availability Description:</label>
                    <input type="text" name="availability" value={formData.availability || ""} onChange={handleProfileChange} className={styles.formInput} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Bio:</label>
                    <textarea name="bio" value={formData.bio || ""} onChange={handleProfileChange} className={styles.formTextarea} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      <input
                        type="checkbox"
                        name="email_notifications"
                        checked={formData.email_notifications}
                        onChange={handleProfileChange}
                      />
                      Receive Email Notifications
                    </label>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Availability Status:</label>
                    <select
                      name="availability_status"
                      value={formData.availability_status}
                      onChange={handleProfileChange}
                      className={styles.formInput}
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Working Hours Start:</label>
                    <input
                      type="time"
                      name="working_hours_start"
                      value={formData.working_hours_start || "09:00"}
                      onChange={handleProfileChange}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Working Hours End:</label>
                    <input
                      type="time"
                      name="working_hours_end"
                      value={formData.working_hours_end || "17:00"}
                      onChange={handleProfileChange}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Preferred Contact Method:</label>
                    <select
                      name="preferred_contact"
                      value={formData.preferred_contact}
                      onChange={handleProfileChange}
                      className={styles.formInput}
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                    </select>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.actionButton} disabled={isLoading}>Save</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className={styles.cancelButton} disabled={isLoading}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <p className={styles.profileItem}><strong>Email:</strong> {lawyer.email}</p>
                  <p className={styles.profileItem}><strong>Specialization:</strong> {lawyer.specialization || "N/A"}</p>
                  <p className={styles.profileItem}><strong>Location:</strong> {lawyer.location || "N/A"}</p>
                  <p className={styles.profileItem}><strong>Availability:</strong> {lawyer.availability || "N/A"}</p>
                  <p className={styles.profileItem}><strong>Bio:</strong> {lawyer.bio || "N/A"}</p>
                  <p className={styles.profileItem}><strong>Email Notifications:</strong> {lawyer.email_notifications ? "Enabled" : "Disabled"}</p>
                  <p className={styles.profileItem}><strong>Status:</strong> {lawyer.availability_status}</p>
                  <p className={styles.profileItem}><strong>Working Hours:</strong> {lawyer.working_hours_start} - {lawyer.working_hours_end}</p>
                  <p className={styles.profileItem}><strong>Preferred Contact:</strong> {lawyer.preferred_contact}</p>
                  <button onClick={() => setIsEditingProfile(true)} className={styles.actionButton}>Edit Profile</button>
                </>
              )}
            </div>

            {/* Cases Section */}
            <div className={styles.card} id="cases">
              <h2 className={styles.sectionTitle}>Your Cases</h2>
              {cases.length > 0 ? (
                <ul className={styles.caseList}>
                  {cases.map((caseItem) => (
                    <li key={caseItem.id} className={styles.caseItem}>
                      <div>
                        <strong>{caseItem.title}</strong> - {caseItem.description || "No description"} 
                        <span className={styles.caseStatus}> ({caseItem.status})</span>
                      </div>
                      {caseItem.status === 'pending' && (
                        <div className={styles.caseActions}>
                          <button onClick={() => handleAcceptCase(caseItem.id)} className={styles.actionButton} disabled={isLoading}>Accept</button>
                          <button onClick={() => handleRejectCase(caseItem.id)} className={styles.cancelButton} disabled={isLoading}>Reject</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.profileItem}>No cases assigned yet.</p>
              )}
            </div>

            {/* Settings Section */}
            <div className={styles.card} id="settings">
              <h2 className={styles.sectionTitle}>Settings</h2>
              {isEditingPassword ? (
                <form onSubmit={handlePasswordSave} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label>New Password:</label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      className={`${styles.formInput} ${passwordError ? styles.inputError : ''}`}
                      required
                    />
                    {passwordError && <span className={styles.errorText}>{passwordError}</span>}
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.actionButton} disabled={isLoading || passwordError}>Save</button>
                    <button type="button" onClick={() => setIsEditingPassword(false)} className={styles.cancelButton} disabled={isLoading}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setIsEditingPassword(true)} className={styles.actionButton}>Change Password</button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}