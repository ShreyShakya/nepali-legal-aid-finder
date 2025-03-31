"use client"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Sun, Moon, FileText, Clock, User, Settings, AlertCircle, CheckCircle, Menu, X, MoreVertical } from "lucide-react";
import { Tooltip } from 'react-tooltip';
import styles from "./ClientDashboard.module.css";

export default function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({});
  const [settingsFormData, setSettingsFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? styles.darkTheme : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const clientData = localStorage.getItem('client');

    if (!token || !clientData) {
      addNotification("Please log in to access the dashboard", "error");
      navigate('/client-login');
      return;
    }

    const parsedClient = JSON.parse(clientData);
    setClient(parsedClient);
    setFormData(parsedClient);
    setSettingsFormData({
      email_notifications: parsedClient.email_notifications || false,
      preferred_contact: parsedClient.preferred_contact || "Email"
    });
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token) => {
    setLoading(true);
    setError("");
    try {
      // Fetch appointments
      const appointmentsResponse = await axios.get('http://127.0.0.1:5000/api/client-appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointmentsResponse.data.appointments || []);

      // Fetch cases
      try {
        const casesResponse = await axios.get('http://127.0.0.1:5000/api/client-cases', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCases(casesResponse.data.cases || []);
      } catch (caseErr) {
        addNotification("Failed to load cases. This feature may not be available yet.", "error");
        setCases([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data.");
      addNotification(err.response?.data?.error || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('client');
    addNotification("Logged out successfully", "success");
    navigate('/client-login');
  };

  const handleAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettingsFormData({ ...settingsFormData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profile_picture: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('clientToken');
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key !== 'profile_picture') formDataToSend.append(key, formData[key]);
      }
      if (profilePictureFile) formDataToSend.append('profile_picture', profilePictureFile);

      const response = await axios.put('http://127.0.0.1:5000/api/client-profile', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setClient(response.data.client);
      localStorage.setItem('client', JSON.stringify(response.data.client));
      setIsEditingProfile(false);
      setProfilePictureFile(null);
      addNotification(response.data.message || "Profile updated successfully", "success");
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('clientToken');
    setLoading(true);
    try {
      const response = await axios.put('http://127.0.0.1:5000/api/client-profile', settingsFormData, {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });
      setClient(response.data.client);
      localStorage.setItem('client', JSON.stringify(response.data.client));
      addNotification(response.data.message || "Settings updated successfully", "success");
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError("");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('clientToken');
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        'http://127.0.0.1:5000/api/client/change-password',
        {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
      setPasswordError("");
      addNotification(response.data.message || "Password updated successfully", "success");

      localStorage.removeItem('clientToken');
      localStorage.removeItem('client');
      navigate('/client-login');
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Failed to update password");
      addNotification(err.response?.data?.error || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(appt => new Date(appt.appointment_date) >= new Date() && appt.status !== 'cancelled')
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 3);

  const recentCases = cases.slice(0, 3);

  if (!client) {
    return (
      <div className={`${styles.dashboardPage} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboardPage} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Tooltip id="theme-tooltip" />
      <Tooltip id="logout-tooltip" />
      <Tooltip id="details-tooltip" />
      <Tooltip id="edit-tooltip" />

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
              <FileText className={styles.navIcon} /> Dashboard
            </button>
            <button
              onClick={() => { setActiveTab("appointments"); setIsSidebarOpen(false); }}
              className={`${styles.navLink} ${activeTab === "appointments" ? styles.activeNavLink : ''}`}
            >
              <Clock className={styles.navIcon} /> Appointments
            </button>
            <button
              onClick={() => { setActiveTab("cases"); setIsSidebarOpen(false); }}
              className={`${styles.navLink} ${activeTab === "cases" ? styles.activeNavLink : ''}`}
            >
              <FileText className={styles.navIcon} /> Cases
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
                <div className={styles.card} id="welcome">
                  <h2 className={styles.sectionTitle}>Welcome, {client.name}</h2>
                  <p>Manage your legal needs efficiently with NepaliLegalAidFinder.</p>
                  <button
                    onClick={() => navigate('/browse-lawyers')}
                    className={styles.actionButton}
                  >
                    Browse Lawyers
                  </button>
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
                  {loading ? (
                    <p className={styles.emptyMessage}>Loading appointments...</p>
                  ) : error ? (
                    <p className={styles.errorMessage}>{error}</p>
                  ) : upcomingAppointments.length === 0 ? (
                    <p className={styles.emptyMessage}>No upcoming appointments.</p>
                  ) : (
                    <div className={styles.tableWrapper}>
                      <table className={styles.appointmentTable}>
                        <thead>
                          <tr>
                            <th>Lawyer Name</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Booked On</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingAppointments.map((appt) => (
                            <tr key={appt.id}>
                              <td>{appt.lawyer_name}</td>
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
                  )}
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
                  {loading ? (
                    <p className={styles.emptyMessage}>Loading cases...</p>
                  ) : cases.length > 0 ? (
                    <div className={styles.tableWrapper}>
                      <table className={styles.caseTable}>
                        <thead>
                          <tr>
                            <th>Case Info</th>
                            <th>Case No</th>
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
                              <td>{caseItem.status}</td>
                              <td>{new Date(caseItem.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td>
                                <button
                                  onClick={() => navigate(`/client-case/${caseItem.id}`)}
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
                    <p className={styles.emptyMessage}>No cases available. Feature coming soon.</p>
                  )}
                </div>
              </>
            )}

            {activeTab === "appointments" && (
              <div className={styles.card} id="appointments">
                <h2 className={styles.sectionTitle}>Appointments</h2>
                {loading ? (
                  <p className={styles.emptyMessage}>Loading appointments...</p>
                ) : error ? (
                  <p className={styles.errorMessage}>{error}</p>
                ) : appointments.length === 0 ? (
                  <p className={styles.emptyMessage}>You have no appointments scheduled.</p>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.appointmentTable}>
                      <thead>
                        <tr>
                          <th>Lawyer Name</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Booked On</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt) => (
                          <tr key={appt.id}>
                            <td>{appt.lawyer_name}</td>
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
                )}
              </div>
            )}

            {activeTab === "cases" && (
              <div className={styles.card} id="cases">
                <h2 className={styles.sectionTitle}>Your Cases</h2>
                {loading ? (
                  <p className={styles.emptyMessage}>Loading cases...</p>
                ) : cases.length > 0 ? (
                  <div className={styles.tableWrapper}>
                    <table className={styles.caseTable}>
                      <thead>
                        <tr>
                          <th>Case Info</th>
                          <th>Case No</th>
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
                            <td>{caseItem.status}</td>
                            <td>{new Date(caseItem.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td>
                              <button
                                onClick={() => navigate(`/client-case/${caseItem.id}`)}
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
                  <p className={styles.emptyMessage}>No cases available.</p>
                )}
              </div>
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
                      <label>Phone:</label>
                      <input type="text" name="phone" value={formData.phone || ""} onChange={handleProfileChange} className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Address:</label>
                      <input type="text" name="address" value={formData.address || ""} onChange={handleProfileChange} className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Bio:</label>
                      <textarea name="bio" value={formData.bio || ""} onChange={handleProfileChange} className={styles.formTextarea} />
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.actionButton} disabled={loading}>Save</button>
                      <button type="button" onClick={() => setIsEditingProfile(false)} className={styles.cancelButton} disabled={loading}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className={styles.profileHeader}>
                      <div className={styles.profilePictureWrapper}>
                        <img
                          src={client.profile_picture ? `http://127.0.0.1:5000${client.profile_picture}` : "https://via.placeholder.com/100"}
                          alt="Profile"
                          className={styles.profilePicture}
                        />
                      </div>
                      <div className={styles.profileInfo}>
                        <h3>{client.name}</h3>
                        <p className={styles.profileSubtitle}>Client</p>
                      </div>
                    </div>
                    <div className={styles.profileDetails}>
                      <p className={styles.profileItem}><strong>Email:</strong> {client.email}</p>
                      <p className={styles.profileItem}><strong>Phone:</strong> {client.phone || "Not provided"}</p>
                      <p className={styles.profileItem}><strong>Address:</strong> {client.address || "Not provided"}</p>
                      <p className={styles.profileItem}><strong>Bio:</strong> {client.bio || "Not provided"}</p>
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
                    <button type="submit" className={styles.actionButton} disabled={loading}>Save Settings</button>
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                    </div>
                    {passwordError && (
                      <p className={styles.errorMessage} style={{ color: '#ef4444', marginTop: '0.5rem' }}>
                        {passwordError}
                      </p>
                    )}
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.actionButton} disabled={loading}>
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmNewPassword: ""
                          });
                          setPasswordError("");
                        }}
                        className={styles.cancelButton}
                        disabled={loading}
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
                <p><strong>Lawyer Name:</strong> {selectedAppointment.lawyer_name}</p>
                <p><strong>Specialization:</strong> {selectedAppointment.specialization}</p>
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

      <div className={styles.loaderOverlay} style={{ display: loading ? 'flex' : 'none' }}>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
}