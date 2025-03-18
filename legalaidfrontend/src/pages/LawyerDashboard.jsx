"use client"

import { useState, useEffect } from "react"
import { Scale, Menu } from "lucide-react"
import axios from "axios"
import { useNavigate, NavLink } from "react-router-dom"
import styles from "./LawyerDashboard.module.css"

export default function LawyerDashboard() {
  const [lawyer, setLawyer] = useState(null)
  const [cases, setCases] = useState([])
  const [error, setError] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({ new_password: "" })
  const navigate = useNavigate()

  // Fetch profile and cases on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError("Please log in to access the dashboard")
        navigate('/lawyer-login')
        return
      }

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
        setError(err.response?.data?.error || "Failed to load data")
        localStorage.removeItem('token')
        localStorage.removeItem('lawyer')
        navigate('/lawyer-login')
      }
    }

    fetchData()
  }, [navigate])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('lawyer')
    navigate('/lawyer-login')
  }

  // Profile editing
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const response = await axios.put('http://127.0.0.1:5000/api/lawyer-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLawyer(response.data.lawyer)
      localStorage.setItem('lawyer', JSON.stringify(response.data.lawyer))
      setIsEditingProfile(false)
      setError("") // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile")
    }
  }

  // Password editing
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.put('http://127.0.0.1:5000/api/lawyer-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPasswordData({ new_password: "" })
      setIsEditingPassword(false)
      setError("") // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password")
    }
  }

  // Case actions
  const handleAcceptCase = async (caseId) => {
    const token = localStorage.getItem('token')
    try {
      await axios.put(`http://127.0.0.1:5000/api/lawyer-case/${caseId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Refresh cases
      const response = await axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCases(response.data.cases)
      setError("") // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.error || "Failed to accept case")
    }
  }

  const handleRejectCase = async (caseId) => {
    const token = localStorage.getItem('token')
    try {
      await axios.put(`http://127.0.0.1:5000/api/lawyer-case/${caseId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Refresh cases
      const response = await axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCases(response.data.cases)
      setError("") // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reject case")
    }
  }

  if (error) {
    return (
      <div className={styles.dashboardPage}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  if (!lawyer) {
    return <div className={styles.dashboardPage}>Loading...</div>
  }

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            <Menu className={styles.menuIcon} />
          </button>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} />
            <span>NepaliLegalAidFinder</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

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
                    <label>Availability:</label>
                    <input type="text" name="availability" value={formData.availability || ""} onChange={handleProfileChange} className={styles.formInput} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Bio:</label>
                    <textarea name="bio" value={formData.bio || ""} onChange={handleProfileChange} className={styles.formTextarea} />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.actionButton}>Save</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className={styles.cancelButton}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <p className={styles.profileItem}><strong>Email:</strong> {lawyer.email}</p>
                  <p className={styles.profileItem}><strong>Specialization:</strong> {lawyer.specialization || "N/A"}</p>
                  <p className={styles.profileItem}><strong>Location:</strong> {lawyer.location || "N/A"}</p>
                  <p className={styles.profileItem}><strong>Availability:</strong> {lawyer.availability || "N/A"}</p>
                  <p className={styles.profileItem}><strong>Bio:</strong> {lawyer.bio || "N/A"}</p>
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
                          <button
                            onClick={() => handleAcceptCase(caseItem.id)}
                            className={styles.actionButton}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectCase(caseItem.id)}
                            className={styles.cancelButton}
                          >
                            Reject
                          </button>
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
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.actionButton}>Save</button>
                    <button type="button" onClick={() => setIsEditingPassword(false)} className={styles.cancelButton}>Cancel</button>
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