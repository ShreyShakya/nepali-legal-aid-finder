"use client"

import { useState, useEffect } from "react"
import { Scale, Sun, Moon, FileText, Clock, Calendar, User, Settings, AlertCircle, CheckCircle, Menu, X, MoreVertical, BarChart2 } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip } from 'react-tooltip'
import styles from "./LawyerDashboard.module.css"

export default function LawyerDashboard() {
  const [lawyer, setLawyer] = useState(null)
  const [cases, setCases] = useState([])
  const [appointments, setAppointments] = useState([])
  const [clients, setClients] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [formData, setFormData] = useState({})
  const [settingsFormData, setSettingsFormData] = useState({})
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [dialog, setDialog] = useState({ isOpen: false, message: "", onConfirm: null })
  const [selectedCase, setSelectedCase] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isCreatingCase, setIsCreatingCase] = useState(false)
  const [newCaseData, setNewCaseData] = useState({
    client_id: "",
    title: "",
    case_type: "Civil",
    status: "pending",
    filing_date: new Date().toISOString().split('T')[0],
    jurisdiction: "District Court",
    description: "",
    plaintiff_name: "",
    defendant_name: "",
    priority: "Medium"
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })
  const [passwordError, setPasswordError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    document.body.className = theme === 'dark' ? styles.darkTheme : ''
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const addNotification = (message, type = 'success') => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000)
  }

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
        const profileResponse = await axios.get('http://127.0.0.1:5000/api/lawyer-profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setLawyer(profileResponse.data.lawyer)
        setFormData(profileResponse.data.lawyer)
        setSettingsFormData({
          email_notifications: profileResponse.data.lawyer.email_notifications,
          preferred_contact: profileResponse.data.lawyer.preferred_contact
        })

        const casesResponse = await axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCases(casesResponse.data.cases)

        try {
          const appointmentsResponse = await axios.get(
            `http://127.0.0.1:5000/api/lawyer-appointments/${profileResponse.data.lawyer.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          setAppointments(appointmentsResponse.data.appointments || [])
        } catch (apptErr) {
          addNotification("Failed to load appointments. This feature may not be available yet.", "error")
          setAppointments([])
        }

        try {
          const clientsResponse = await axios.get('http://127.0.0.1:5000/api/lawyer-clients', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setClients(clientsResponse.data.clients || [])
        } catch (clientErr) {
          addNotification("Failed to load clients. You may not be able to create cases.", "error")
          setClients([])
        }
      } catch (err) {
        console.log("Error:", err.response?.data?.error || err.message)
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

  const handleLogout = () => {
    setDialog({
      isOpen: true,
      message: "Are you sure you want to logout?",
      onConfirm: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('lawyer')
        addNotification("Logged out successfully", "success")
        navigate('/lawyer-login')
      }
    })
  }

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettingsFormData({ ...settingsFormData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePictureFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setFormData({ ...formData, profile_picture: reader.result })
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      for (const key in formData) {
        if (key !== 'profile_picture') formDataToSend.append(key, formData[key])
      }
      if (profilePictureFile) formDataToSend.append('profile_picture', profilePictureFile)

      const response = await axios.put('http://127.0.0.1:5000/api/lawyer-profile', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setLawyer(response.data.lawyer)
      localStorage.setItem('lawyer', JSON.stringify(response.data.lawyer))
      setIsEditingProfile(false)
      setProfilePictureFile(null)
      addNotification(response.data.message || "Profile updated successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingsSave = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.put('http://127.0.0.1:5000/api/lawyer-profile', settingsFormData, {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      })
      setLawyer(response.data.lawyer)
      localStorage.setItem('lawyer', JSON.stringify(response.data.lawyer))
      addNotification(response.data.message || "Settings updated successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update settings", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({ ...passwordData, [name]: value })
    setPasswordError("")
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      setPasswordError("All fields are required")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New password and confirmation do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.put(
        'http://127.0.0.1:5000/api/lawyer/change-password',
        {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      })
      setPasswordError("")
      addNotification(response.data.message || "Password updated successfully", "success")

      setDialog({
        isOpen: true,
        message: "Password changed successfully. You will be logged out. Please log in again with your new password.",
        onConfirm: () => {
          localStorage.removeItem('token')
          localStorage.removeItem('lawyer')
          navigate('/lawyer-login')
        }
      })
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Failed to update password")
      addNotification(err.response?.data?.error || "Failed to update password", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCaseDetails = (caseItem) => {
    navigate(`/case-details/${caseItem.id}`)
  }

  const handleAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment)
  }

  const handleStatusChange = async (caseId, newStatus) => {
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/lawyer-case/${caseId}/update-status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const casesResponse = await axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCases(casesResponse.data.cases)
      addNotification(response.data.message || "Case status updated successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update case status", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/update-appointment-status/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const appointmentsResponse = await axios.get(`http://127.0.0.1:5000/api/lawyer-appointments/${lawyer.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments(appointmentsResponse.data.appointments || [])
      addNotification(response.data.message || `Appointment ${newStatus} successfully`, "success")
    } catch (err) {
      addNotification(err.response?.data?.error || `Failed to ${newStatus} appointment`, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewCaseChange = (e) => {
    const { name, value } = e.target
    setNewCaseData({ ...newCaseData, [name]: value })
  }

  const handleCreateCase = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    setIsLoading(true)
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/create-case', newCaseData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const casesResponse = await axios.get('http://127.0.0.1:5000/api/lawyer-cases', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCases(casesResponse.data.cases)
      setIsCreatingCase(false)
      setNewCaseData({
        client_id: "",
        title: "",
        case_type: "Civil",
        status: "pending",
        filing_date: new Date().toISOString().split('T')[0],
        jurisdiction: "District Court",
        description: "",
        plaintiff_name: "",
        defendant_name: "",
        priority: "Medium"
      })
      addNotification(response.data.message || "Case created successfully", "success")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to create case", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const totalCases = cases.length
  const pendingCases = cases.filter(c => c.status === 'pending').length
  const highPriorityCases = cases.filter(c => c.priority === 'High').length
  const completedCases = cases.filter(c => c.status === 'completed').length

  const recentCases = cases.slice(0, 3)

  const upcomingAppointments = appointments
    .filter(appt => new Date(appt.appointment_date) >= new Date() && appt.status !== 'cancelled')
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 3)

  if (!lawyer) {
    return (
      <div className={`${styles.dashboardPage} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <div className={styles.loader}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={`${styles.dashboardPage} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Tooltip id="theme-tooltip" />
      <Tooltip id="logout-tooltip" />
      <Tooltip id="edit-tooltip" />
      <Tooltip id="details-tooltip" />
      <Tooltip id="create-case-tooltip" />

      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.logo}>
            <button className={styles.menuButton} onClick={toggleSidebar}>
              {isSidebarOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
            </button>
            <button
              onClick={() => navigate('/')}
              className={styles.logoLink}
            >
              <Scale className={styles.logoIcon} />
              <span>NepaliLegalAidFinder</span>
            </button>
          </div>
          <nav className={styles.sidebarNav}>
            <button
              onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
              className={`${styles.navLink} ${activeTab === "dashboard" ? styles.activeNavLink : ''}`}
            >
              <BarChart2 className={styles.navIcon} /> Dashboard
            </button>
            <button
              onClick={() => { setActiveTab("cases"); setIsSidebarOpen(false); }}
              className={`${styles.navLink} ${activeTab === "cases" ? styles.activeNavLink : ''}`}
            >
              <FileText className={styles.navIcon} /> Cases
            </button>
            <button
              onClick={() => { setActiveTab("appointments"); setIsSidebarOpen(false); }}
              className={`${styles.navLink} ${activeTab === "appointments" ? styles.activeNavLink : ''}`}
            >
              <Clock className={styles.navIcon} /> Appointments
            </button>
            <button
              onClick={() => { setActiveTab("profile"); setIsSidebarOpen(false); }}
              className={`${styles.navLink} ${activeTab === "profile" ? styles.activeNavLink : ''}`}
            >
              <User className={styles.navIcon} /> Profile
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
              className={`${styles.navLink} ${activeTab === "settings" ? styles.activeNavLink : ''}`}
            >
              <Settings className={styles.navIcon} /> Settings
            </button>
          </nav>
        </aside>
        <main className={styles.main}>
          <div className={styles.topBar}>
            <span className={styles.currentDate}>
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
            </span>
            <div className={styles.headerActions}>
              <button onClick={toggleTheme} className={styles.themeButton} data-tooltip-id="theme-tooltip" data-tooltip-content="Toggle theme">
                {theme === 'light' ? <Moon className={styles.icon} /> : <Sun className={styles.icon} />}
              </button>
              <button onClick={handleLogout} className={styles.logoutButton} data-tooltip-id="logout-tooltip" data-tooltip-content="Log out of your account">
                Logout
              </button>
            </div>
          </div>
          <div className={styles.dashboardContent}>
            {activeTab === "dashboard" && (
              <>
                <div className={styles.statsContainer}>
                  <div className={`${styles.statCard} ${styles.totalCases}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <FileText className={styles.statIcon} />
                      <h3>{totalCases}</h3>
                    </div>
                    <p>Total Cases</p>
                  </div>
                  <div className={`${styles.statCard} ${styles.pendingCases}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Clock className={styles.statIcon} />
                      <h3>{pendingCases}</h3>
                    </div>
                    <p>Pending Cases</p>
                  </div>
                  <div className={`${styles.statCard} ${styles.highPriorityCases}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <AlertCircle className={styles.statIcon} />
                      <h3>{highPriorityCases}</h3>
                    </div>
                    <p>High-Priority Cases</p>
                  </div>
                  <div className={`${styles.statCard} ${styles.completedCases}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <CheckCircle className={styles.statIcon} />
                      <h3>{completedCases}</h3>
                    </div>
                    <p>Completed Cases</p>
                  </div>
                </div>

                <div className={styles.card} id="recent-cases">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className={styles.sectionTitle}>Recent Cases</h2>
                    <button
                      onClick={() => setActiveTab("cases")}
                      className={styles.actionButton}
                    >
                      View All Cases
                    </button>
                  </div>
                  {recentCases.length > 0 ? (
                    <div className={styles.tableWrapper}>
                      <table className={styles.caseTable}>
                        <thead>
                          <tr>
                            <th>Case Info</th>
                            <th>Case No</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentCases.map((caseItem) => (
                            <tr key={caseItem.id}>
                              <td>
                                <div className={styles.caseInfo}>
                                  <div className={styles.caseDetails}>
                                    <span className={styles.caseTitle}>{caseItem.title}</span>
                                    <span className={styles.caseDescription}>{caseItem.description || "No description"}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{caseItem.id}</td>
                              <td>{caseItem.priority}</td>
                              <td>{caseItem.status}</td>
                              <td>{new Date(caseItem.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td>
                                <button
                                  onClick={() => setSelectedCase(caseItem)} // Updated to show summary dialog
                                  className={styles.ellipsisButton}
                                  data-tooltip-id="details-tooltip"
                                  data-tooltip-content="View case summary"
                                >
                                  <MoreVertical className={styles.ellipsisIcon} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.emptyMessage}>No cases assigned yet.</p>
                  )}
                </div>

                <div className={styles.card} id="upcoming-appointments">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className={styles.sectionTitle}>Upcoming Appointments</h2>
                    <button
                      onClick={() => setActiveTab("appointments")}
                      className={styles.actionButton}
                    >
                      View All Appointments
                    </button>
                  </div>
                  {upcomingAppointments.length > 0 ? (
                    <div className={styles.tableWrapper}>
                      <table className={styles.appointmentTable}>
                        <thead>
                          <tr>
                            <th>Client Name</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Booked On</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingAppointments.map((appt) => (
                            <tr key={appt.id}>
                              <td>{appt.client_name}</td>
                              <td>{new Date(appt.appointment_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                              <td>{appt.status}</td>
                              <td>{new Date(appt.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td>
                                <button
                                  onClick={() => handleAppointmentDetails(appt)}
                                  className={styles.ellipsisButton}
                                  data-tooltip-id="details-tooltip"
                                  data-tooltip-content="View appointment details"
                                >
                                  <MoreVertical className={styles.ellipsisIcon} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.emptyMessage}>No upcoming appointments.</p>
                  )}
                </div>
              </>
            )}

            {activeTab === "cases" && (
              <div className={styles.card} id="cases">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className={styles.sectionTitle}>Case List</h2>
                  <button
                    onClick={() => setIsCreatingCase(true)}
                    className={styles.actionButton}
                    data-tooltip-id="create-case-tooltip"
                    data-tooltip-content="Create a new case"
                  >
                    Create Case
                  </button>
                </div>
                {isCreatingCase ? (
                  <form onSubmit={handleCreateCase} className={styles.createCaseForm}>
                    <h3>Case Basic Details</h3>
                    <div className={styles.formGroup}>
                      <label>Case Title:</label>
                      <input
                        type="text"
                        name="title"
                        value={newCaseData.title}
                        onChange={handleNewCaseChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Case Type:</label>
                      <select
                        name="case_type"
                        value={newCaseData.case_type}
                        onChange={handleNewCaseChange}
                        className={styles.formInput}
                        required
                      >
                        <option value="Civil">Civil</option>
                        <option value="Criminal">Criminal</option>
                        <option value="Family">Family</option>
                        <option value="Property">Property</option>
                        <option value="Labor">Labor</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Case Status:</label>
                      <input
                        type="text"
                        name="status"
                        value={newCaseData.status}
                        className={styles.formInput}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Filing Date:</label>
                      <input
                        type="date"
                        name="filing_date"
                        value={newCaseData.filing_date}
                        className={styles.formInput}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Jurisdiction:</label>
                      <select
                        name="jurisdiction"
                        value={newCaseData.jurisdiction}
                        onChange={handleNewCaseChange}
                        className={styles.formInput}
                        required
                      >
                        <option value="District Court">District Court</option>
                        <option value="High Court">High Court</option>
                        <option value="Supreme Court">Supreme Court</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Case Description:</label>
                      <textarea
                        name="description"
                        value={newCaseData.description}
                        onChange={handleNewCaseChange}
                        className={styles.formTextarea}
                        required
                      />
                    </div>

                    <h3>Parties Involved</h3>
                    <div className={styles.formGroup}>
                      <label>Client (Plaintiff):</label>
                      <select
                        name="client_id"
                        value={newCaseData.client_id}
                        onChange={handleNewCaseChange}
                        className={styles.formInput}
                        required
                      >
                        <option value="">Select a client</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Plaintiff Name(s):</label>
                      <input
                        type="text"
                        name="plaintiff_name"
                        value={newCaseData.plaintiff_name}
                        onChange={handleNewCaseChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Defendant Name(s):</label>
                      <input
                        type="text"
                        name="defendant_name"
                        value={newCaseData.defendant_name}
                        onChange={handleNewCaseChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Assigned Lawyer:</label>
                      <input
                        type="text"
                        value={lawyer?.name || "Loading..."}
                        className={styles.formInput}
                        disabled
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.actionButton} disabled={isLoading}>Create</button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingCase(false)}
                        className={styles.cancelButton}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : cases.length > 0 ? (
                  <div className={styles.tableWrapper}>
                    <table className={styles.caseTable}>
                      <thead>
                        <tr>
                          <th>Case Info</th>
                          <th>Case No</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cases.map((caseItem) => (
                          <tr key={caseItem.id}>
                            <td>
                              <div className={styles.caseInfo}>
                                <div className={styles.caseDetails}>
                                  <span className={styles.caseTitle}>{caseItem.title}</span>
                                  <span className={styles.caseDescription}>{caseItem.description || "No description"}</span>
                                </div>
                              </div>
                            </td>
                            <td>{caseItem.id}</td>
                            <td>{caseItem.priority}</td>
                            <td>
                              <select
                                value={caseItem.status}
                                onChange={(e) => handleStatusChange(caseItem.id, e.target.value)}
                                className={styles.statusSelect}
                                disabled={isLoading}
                              >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                            <td>{new Date(caseItem.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td>
                              <button
                                onClick={() => handleCaseDetails(caseItem)}
                                className={styles.ellipsisButton}
                                data-tooltip-id="details-tooltip"
                                data-tooltip-content="View case details"
                              >
                                <MoreVertical className={styles.ellipsisIcon} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className={styles.emptyMessage}>No cases assigned yet.</p>
                )}
              </div>
            )}

            {activeTab === "appointments" && (
              <>
                <div className={styles.card} id="appointments">
                  <h2 className={styles.sectionTitle}>Appointments</h2>
                  {appointments.length > 0 ? (
                    <div className={styles.tableWrapper}>
                      <table className={styles.appointmentTable}>
                        <thead>
                          <tr>
                            <th>Client Name</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Booked On</th>
                            <th>Actions</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appt) => (
                            <tr key={appt.id}>
                              <td>{appt.client_name}</td>
                              <td>{new Date(appt.appointment_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                              <td>{appt.status}</td>
                              <td>{new Date(appt.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td>
                                {appt.status === 'pending' && (
                                  <div className={styles.appointmentActions}>
                                    <button
                                      onClick={() => handleUpdateAppointmentStatus(appt.id, 'confirmed')}
                                      className={styles.confirmButton}
                                      disabled={isLoading}
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => handleUpdateAppointmentStatus(appt.id, 'cancelled')}
                                      className={styles.cancelAppointmentButton}
                                      disabled={isLoading}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td>
                                <button
                                  onClick={() => handleAppointmentDetails(appt)}
                                  className={styles.ellipsisButton}
                                  data-tooltip-id="details-tooltip"
                                  data-tooltip-content="View appointment details"
                                >
                                  <MoreVertical className={styles.ellipsisIcon} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.emptyMessage}>No appointments scheduled.</p>
                  )}
                </div>
                <div className={styles.card} id="calendar">
                  <h2 className={styles.sectionTitle}>Calendar</h2>
                  <div className={styles.placeholderContent}>
                    <p className={styles.emptyMessage}>[Placeholder: Calendar to be implemented]</p>
                    <button className={styles.actionButton}>Add Events to Calendar</button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <div className={styles.profileCard} id="profile">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileSave} className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label>Profile Picture:</label>
                      <div className={styles.profilePictureWrapper}>
                        <img
                          src={formData.profile_picture || "https://via.placeholder.com/100"}
                          alt="Profile"
                          className={styles.profilePicture}
                        />
                        <label htmlFor="profilePictureUpload" className={styles.uploadButton}>
                          Upload
                          <input
                            id="profilePictureUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className={styles.fileInput}
                          />
                        </label>
                      </div>
                    </div>
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
                      <label>Availability Status:</label>
                      <select name="availability_status" value={formData.availability_status} onChange={handleProfileChange} className={styles.formInput}>
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Working Hours Start:</label>
                      <input type="time" name="working_hours_start" value={formData.working_hours_start || "09:00"} onChange={handleProfileChange} className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Working Hours End:</label>
                      <input type="time" name="working_hours_end" value={formData.working_hours_end || "17:00"} onChange={handleProfileChange} className={styles.formInput} />
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.actionButton} disabled={isLoading}>Save</button>
                      <button type="button" onClick={() => setIsEditingProfile(false)} className={styles.cancelButton} disabled={isLoading}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className={styles.profileHeader}>
                      <div className={styles.profilePictureWrapper}>
                        <img
                          src={lawyer.profile_picture ? `http://127.0.0.1:5000${lawyer.profile_picture}` : "https://via.placeholder.com/100"}
                          alt="Profile"
                          className={styles.profilePicture}
                        />
                      </div>
                      <div className={styles.profileInfo}>
                        <h3>{lawyer.name || "Lawyer Name"}</h3>
                        <p className={styles.profileSubtitle}>{lawyer.specialization || "Specialization N/A"}</p>
                      </div>
                    </div>
                    <div className={styles.profileDetails}>
                      <p className={styles.profileItem}><strong>Email:</strong> {lawyer.email}</p>
                      <p className={styles.profileItem}><strong>Location:</strong> {lawyer.location || "N/A"}</p>
                      <p className={styles.profileItem}><strong>Availability:</strong> {lawyer.availability || "N/A"}</p>
                      <p className={styles.profileItem}><strong>Bio:</strong> {lawyer.bio || "N/A"}</p>
                      <p className={styles.profileItem}><strong>Status:</strong> {lawyer.availability_status}</p>
                      <p className={styles.profileItem}><strong>Working Hours:</strong> {lawyer.working_hours_start} - {lawyer.working_hours_end}</p>
                    </div>
                    <button 
                      onClick={() => setIsEditingProfile(true)} 
                      className={styles.actionButton} 
                      data-tooltip-id="edit-tooltip" 
                      data-tooltip-content="Edit your profile details"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className={styles.card} id="settings">
                <h2 className={styles.sectionTitle}>Account Settings</h2>
                <form onSubmit={handleSettingsSave} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label>Email Notifications:</label>
                    <input
                      type="checkbox"
                      name="email_notifications"
                      checked={settingsFormData.email_notifications}
                      onChange={handleSettingsChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Preferred Contact Method:</label>
                    <select
                      name="preferred_contact"
                      value={settingsFormData.preferred_contact}
                      onChange={handleSettingsChange}
                      className={styles.formInput}
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                    </select>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.actionButton} disabled={isLoading}>Save Settings</button>
                  </div>
                </form>

                <div className={styles.card} style={{ marginTop: '2rem' }}>
                  <h2 className={styles.sectionTitle}>Change Password</h2>
                  <form onSubmit={handlePasswordUpdate} className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="currentPassword">Current Password:</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword">New Password:</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {passwordError && (
                      <p className={styles.errorMessage} style={{ color: '#ef4444', marginTop: '0.5rem' }}>
                        {passwordError}
                      </p>
                    )}
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.actionButton} disabled={isLoading}>
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmNewPassword: ""
                          })
                          setPasswordError("")
                        }}
                        className={styles.cancelButton}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {dialog.isOpen && (
          <motion.div
            className={styles.dialogOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.dialogBox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>{dialog.message}</h3>
              <div className={styles.dialogActions}>
                <button onClick={dialog.onConfirm} className={styles.actionButton}>Yes</button>
                <button onClick={() => setDialog({ isOpen: false, message: "", onConfirm: null })} className={styles.cancelButton}>No</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCase && (
          <motion.div
            className={styles.dialogOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.dialogBox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>Case Details: {selectedCase.title}</h3>
              <div className={styles.caseDialogContent}>
                <p><strong>Case Number:</strong> {selectedCase.id}</p>
                <p><strong>Description:</strong> {selectedCase.description || "No description"}</p>
                <p><strong>Status:</strong> {selectedCase.status}</p>
                <p><strong>Priority:</strong> {selectedCase.priority}</p>
                <p><strong>Created At:</strong> {new Date(selectedCase.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className={styles.cancelButton}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            className={styles.dialogOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.dialogBox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>Appointment Details</h3>
              <div className={styles.appointmentDialogContent}>
                <p><strong>Client Name:</strong> {selectedAppointment.client_name}</p>
                <p><strong>Date & Time:</strong> {new Date(selectedAppointment.appointment_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Status:</strong> {selectedAppointment.status}</p>
                <p><strong>Booked On:</strong> {new Date(selectedAppointment.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className={styles.cancelButton}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.notificationContainer}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`${styles.notification} ${notification.type === 'error' ? styles.errorNotification : styles.successNotification}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {notification.type === 'success' ? (
                <CheckCircle className={styles.notificationIcon} />
              ) : (
                <AlertCircle className={styles.notificationIcon} />
              )}
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.loaderOverlay} style={{ display: isLoading ? 'flex' : 'none' }}>
        <div className={styles.loader}></div>
      </div>
    </div>
  )
}