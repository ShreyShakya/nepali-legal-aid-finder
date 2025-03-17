"use client"

import { useState } from "react"
import {
  Scale,
  User,
  Settings,
  LogOut,
  Bell,
  Calendar,
  AlertCircle,
  Eye,
  MessageSquare,
  PlusCircle,
  ChevronRight,
  Search,
  Filter,
  Briefcase,
  Clock,
  CheckCircle,
  File,
  Menu,
  X,
  Users,
  BarChart,
  Edit,
  Upload,
  Download,
  Building,
  Phone,
  Mail,
  Award,
  MapPin,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react"
import styles from "./LawyerDashboard.module.css"

function LawyerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)

  const lawyerData = {
    name: "Sarah Wilson",
    email: "sarahwilson@lawfirm.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    specialization: "Property Law",
    lawFirm: "Wilson & Associates",
    experience: "12 years",
    barLicenseNumber: "BAR123456",
    address: "123 Legal Avenue, New York, NY 10001",
    phone: "212-555-7890",
  }

  const caseStats = {
    active: 8,
    pending: 5,
    completed: 12,
    totalClients: 15,
  }

  const performanceStats = {
    casesWon: 42,
    casesLost: 8,
    successRate: "84%",
    avgCaseTime: "4.2 months",
  }

  const cases = [
    {
      id: 1,
      title: "Property Dispute Case #2024-01",
      client: "Jason Moralles",
      status: "active",
      date: "2024-03-12",
      description: "Boundary dispute between neighboring properties",
      nextHearing: "2024-04-15",
      notes: "Client provided new evidence documents",
    },
    {
      id: 2,
      title: "Tenant Eviction #2024-03",
      client: "Michael Chen",
      status: "active",
      date: "2024-03-05",
      description: "Eviction proceedings for non-payment of rent",
      nextHearing: "2024-03-28",
      notes: "Tenant has requested mediation",
    },
    {
      id: 3,
      title: "Real Estate Contract Review #2024-05",
      client: "Emma Rodriguez",
      status: "pending",
      date: "2024-03-10",
      description: "Review of commercial property purchase agreement",
      nextHearing: null,
      notes: "Waiting for additional documentation from seller",
    },
    {
      id: 4,
      title: "Landlord-Tenant Dispute #2024-02",
      client: "David Johnson",
      status: "completed",
      date: "2024-02-15",
      description: "Dispute over security deposit return",
      nextHearing: null,
      notes: "Case settled with full deposit return to tenant",
    },
  ]

  const clients = [
    {
      id: 1,
      name: "Jason Moralles",
      email: "jasonmoralles@mail.com",
      phone: "904-302-4131",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      activeCases: 1,
      totalCases: 3,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michaelchen@mail.com",
      phone: "415-555-3827",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      activeCases: 1,
      totalCases: 1,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emmarodriguez@mail.com",
      phone: "305-555-9274",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      activeCases: 1,
      totalCases: 2,
    },
    {
      id: 4,
      name: "David Johnson",
      email: "davidjohnson@mail.com",
      phone: "212-555-4829",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      activeCases: 0,
      totalCases: 1,
    },
  ]

  const appointments = [
    {
      id: 1,
      client: "Jason Moralles",
      title: "Case Strategy Meeting",
      date: "2024-03-18",
      time: "10:00 AM",
      location: "Office",
      status: "upcoming",
    },
    {
      id: 2,
      client: "Emma Rodriguez",
      title: "Document Review",
      date: "2024-03-20",
      time: "2:30 PM",
      location: "Virtual",
      status: "upcoming",
    },
    {
      id: 3,
      client: "Michael Chen",
      title: "Court Preparation",
      date: "2024-03-25",
      time: "9:00 AM",
      location: "Office",
      status: "upcoming",
    },
  ]

  const documents = [
    {
      id: 1,
      name: "Property Deed - Moralles Case.pdf",
      case: "Property Dispute Case #2024-01",
      type: "pdf",
      size: "2.4 MB",
      date: "2024-03-10",
    },
    {
      id: 2,
      name: "Evidence Photos - Moralles Case.zip",
      case: "Property Dispute Case #2024-01",
      type: "zip",
      size: "15.7 MB",
      date: "2024-03-11",
    },
    {
      id: 3,
      name: "Lease Agreement - Chen Case.pdf",
      case: "Tenant Eviction #2024-03",
      type: "pdf",
      size: "1.8 MB",
      date: "2024-03-05",
    },
    {
      id: 4,
      name: "Purchase Agreement - Rodriguez Case.docx",
      case: "Real Estate Contract Review #2024-05",
      type: "docx",
      size: "1.2 MB",
      date: "2024-03-10",
    },
  ]

  const notifications = [
    {
      id: 1,
      message: "New document uploaded in Property Dispute Case #2024-01",
      type: "document",
      time: "1 hour ago",
    },
    {
      id: 2,
      message: "Upcoming appointment with Jason Moralles tomorrow at 10:00 AM",
      type: "appointment",
      time: "3 hours ago",
    },
    {
      id: 3,
      message: "Court date scheduled for Tenant Eviction #2024-03 on March 28",
      type: "court",
      time: "Yesterday",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Jason Moralles",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      message: "Do I need to bring any additional documents to our meeting tomorrow?",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Emma Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      message: "I've reviewed the contract and have some concerns about section 3.2.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      sender: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      message: "Can we schedule a call to discuss the eviction process?",
      time: "2 days ago",
      unread: false,
    },
  ]

  const lawFirmData = {
    name: "Wilson & Associates",
    address: "123 Legal Avenue, New York, NY 10001",
    phone: "212-555-7890",
    email: "info@wilsonassociates.com",
    partners: ["Sarah Wilson", "James Thompson", "Maria Garcia"],
    associates: ["Alex Johnson", "Lisa Chen", "Robert Smith"],
  }

  const navigationItems = [
    { id: "dashboard", icon: <BarChart size={18} />, label: "Dashboard" },
    { id: "cases", icon: <Briefcase size={18} />, label: "My Cases" },
    { id: "clients", icon: <Users size={18} />, label: "Client Assignments" },
    { id: "appointments", icon: <Calendar size={18} />, label: "Appointments" },
    { id: "documents", icon: <File size={18} />, label: "Documents" },
    { id: "messages", icon: <MessageSquare size={18} />, label: "Messages" },
    { id: "lawfirm", icon: <Building size={18} />, label: "Law Firm" },
    { id: "settings", icon: <Settings size={18} />, label: "Settings" },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Menu Toggle */}
      <button className={styles.menuToggle} onClick={toggleSidebar}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} size={20} />
            <span>Legal Portal</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ""}`}
              onClick={() => {
                setActiveTab(item.id)
                if (window.innerWidth < 768) {
                  setSidebarOpen(false)
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.userProfile}>
          <div className={styles.profileSection} onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
            <img src={lawyerData.avatar || "/placeholder.svg"} alt={lawyerData.name} className={styles.avatar} />
            <div className={styles.userInfo}>
              <h4>{lawyerData.name}</h4>
              <span>{lawyerData.specialization}</span>
            </div>
          </div>

          {profileDropdownOpen && (
            <div className={styles.profileDropdown}>
              <button className={styles.dropdownItem}>
                <User size={14} />
                Profile
              </button>
              <button className={styles.dropdownItem}>
                <Settings size={14} />
                Settings
              </button>
              <button className={styles.dropdownItem}>
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={16} />
            <input type="text" placeholder="Search cases, clients, documents..." />
          </div>

          <div className={styles.headerActions}>
            <button className={styles.notificationButton} onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <Bell size={18} />
              {notifications.length > 0 && <span className={styles.notificationBadge}>{notifications.length}</span>}
            </button>

            {notificationsOpen && (
              <div className={styles.notificationsDropdown}>
                <div className={styles.notificationsHeader}>
                  <h3>Notifications</h3>
                  <button className={styles.markAllRead}>Mark all as read</button>
                </div>
                <div className={styles.notificationsList}>
                  {notifications.map((notification) => (
                    <div key={notification.id} className={styles.notificationItem}>
                      <AlertCircle className={styles.notificationIcon} size={16} />
                      <div className={styles.notificationContent}>
                        <p>{notification.message}</p>
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          {activeTab === "dashboard" && (
            <>
              <section className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <img
                    src={lawyerData.avatar || "/placeholder.svg"}
                    alt={lawyerData.name}
                    className={styles.profileAvatar}
                  />
                  <div>
                    <h2 className={styles.profileName}>{lawyerData.name}</h2>
                    <p className={styles.profileEmail}>{lawyerData.email}</p>
                    <div className={styles.profileTags}>
                      <span className={styles.profileTag}>{lawyerData.specialization}</span>
                      <span className={styles.profileTag}>{lawyerData.lawFirm}</span>
                    </div>
                  </div>
                  <button className={styles.editButton} onClick={() => setEditingProfile(!editingProfile)}>
                    {editingProfile ? "Save" : "Edit Profile"}
                  </button>
                </div>

                {editingProfile ? (
                  <div className={styles.editProfileForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input type="text" defaultValue={lawyerData.name} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" defaultValue={lawyerData.email} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Specialization</label>
                        <input type="text" defaultValue={lawyerData.specialization} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Law Firm</label>
                        <select defaultValue={lawyerData.lawFirm}>
                          <option value="Wilson & Associates">Wilson & Associates</option>
                          <option value="Legal Eagles LLP">Legal Eagles LLP</option>
                          <option value="Justice Partners">Justice Partners</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Experience</label>
                        <input type="text" defaultValue={lawyerData.experience} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Bar License Number</label>
                        <input type="text" defaultValue={lawyerData.barLicenseNumber} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Phone</label>
                        <input type="tel" defaultValue={lawyerData.phone} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Address</label>
                        <input type="text" defaultValue={lawyerData.address} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Profile Picture</label>
                        <div className={styles.uploadControl}>
                          <button className={styles.uploadButton}>
                            <Upload size={14} />
                            Upload New
                          </button>
                          <span className={styles.fileName}>profile-image.jpg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.profileInfo}>
                    <div className={styles.infoGroup}>
                      <h4>Experience</h4>
                      <p>{lawyerData.experience}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <h4>Bar License</h4>
                      <p>{lawyerData.barLicenseNumber}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <h4>Phone</h4>
                      <p>{lawyerData.phone}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <h4>Address</h4>
                      <p>{lawyerData.address}</p>
                    </div>
                  </div>
                )}
              </section>

              <div className={styles.statsGrid}>
                <section className={styles.statsSection}>
                  <h3 className={styles.sectionTitle}>Case Statistics</h3>
                  <div className={styles.statsCards}>
                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.activeIcon}`}>
                        <Briefcase size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Active Cases</h3>
                        <p>{caseStats.active}</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.pendingIcon}`}>
                        <Clock size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Pending</h3>
                        <p>{caseStats.pending}</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.completedIcon}`}>
                        <CheckCircle size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Completed</h3>
                        <p>{caseStats.completed}</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.clientsIcon}`}>
                        <Users size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Total Clients</h3>
                        <p>{caseStats.totalClients}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className={styles.statsSection}>
                  <h3 className={styles.sectionTitle}>Performance Metrics</h3>
                  <div className={styles.statsCards}>
                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.wonIcon}`}>
                        <Award size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Cases Won</h3>
                        <p>{performanceStats.casesWon}</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.lostIcon}`}>
                        <AlertCircle size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Cases Lost</h3>
                        <p>{performanceStats.casesLost}</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.rateIcon}`}>
                        <BarChart size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Success Rate</h3>
                        <p>{performanceStats.successRate}</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIcon} ${styles.timeIcon}`}>
                        <Clock size={16} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>Avg Case Time</h3>
                        <p>{performanceStats.avgCaseTime}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className={styles.dashboardGrid}>
                <section className={styles.upcomingAppointments}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Upcoming Appointments</h3>
                    <button className={styles.viewAllButton}>
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className={styles.appointmentsList}>
                    {appointments.slice(0, 2).map((appointment) => (
                      <div key={appointment.id} className={styles.appointmentCard}>
                        <div className={styles.appointmentInfo}>
                          <h4>{appointment.title}</h4>
                          <p>Client: {appointment.client}</p>
                          <div className={styles.appointmentMeta}>
                            <span>
                              {appointment.date} at {appointment.time}
                            </span>
                            <span className={styles.appointmentLocation}>{appointment.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className={styles.recentCases}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Recent Cases</h3>
                    <button className={styles.viewAllButton}>
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className={styles.casesList}>
                    {cases.slice(0, 2).map((caseItem) => (
                      <div key={caseItem.id} className={styles.caseCard}>
                        <div className={styles.caseHeader}>
                          <h4>{caseItem.title}</h4>
                          <span className={`${styles.status} ${styles[caseItem.status]}`}>{caseItem.status}</span>
                        </div>
                        <p>Client: {caseItem.client}</p>
                        <div className={styles.caseMeta}>
                          <span>Opened: {caseItem.date}</span>
                          {caseItem.nextHearing && <span>Next Hearing: {caseItem.nextHearing}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTab === "cases" && (
            <section className={styles.casesSection}>
              <div className={styles.sectionHeader}>
                <h2>My Cases</h2>
                <div className={styles.caseActions}>
                  <div className={styles.filterGroup}>
                    <select className={styles.filterSelect}>
                      <option value="all">All Cases</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <button className={styles.addButton}>
                    <PlusCircle size={14} />
                    New Case
                  </button>
                </div>
              </div>

              <div className={styles.casesList}>
                {cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className={`${styles.caseCard} ${selectedCase === caseItem.id ? styles.selectedCard : ""}`}
                    onClick={() => setSelectedCase(selectedCase === caseItem.id ? null : caseItem.id)}
                  >
                    <div className={styles.caseHeader}>
                      <h4>{caseItem.title}</h4>
                      <span className={`${styles.status} ${styles[caseItem.status]}`}>{caseItem.status}</span>
                    </div>
                    <p className={styles.caseDescription}>{caseItem.description}</p>
                    <p>Client: {caseItem.client}</p>
                    <div className={styles.caseMeta}>
                      <span>Opened: {caseItem.date}</span>
                      {caseItem.nextHearing && <span>Next Hearing: {caseItem.nextHearing}</span>}
                    </div>

                    {selectedCase === caseItem.id && (
                      <div className={styles.caseDetails}>
                        <div className={styles.caseNotes}>
                          <h5>Case Notes</h5>
                          <p>{caseItem.notes}</p>
                          <div className={styles.addNoteForm}>
                            <textarea placeholder="Add a new note..." rows={2}></textarea>
                            <button className={styles.smallButton}>Add Note</button>
                          </div>
                        </div>
                        <div className={styles.caseActions}>
                          <button className={styles.actionButton}>
                            <Edit size={14} />
                            Update Status
                          </button>
                          <button className={styles.actionButton}>
                            <File size={14} />
                            View Documents
                          </button>
                          <button className={styles.actionButton}>
                            <Calendar size={14} />
                            Schedule Hearing
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "clients" && (
            <section className={styles.clientsSection}>
              <div className={styles.sectionHeader}>
                <h2>Client Assignments</h2>
                <button className={styles.addButton}>
                  <UserPlus size={14} />
                  Add Client
                </button>
              </div>

              <div className={styles.clientsList}>
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className={`${styles.clientCard} ${selectedClient === client.id ? styles.selectedCard : ""}`}
                    onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                  >
                    <div className={styles.clientHeader}>
                      <img
                        src={client.avatar || "/placeholder.svg"}
                        alt={client.name}
                        className={styles.clientAvatar}
                      />
                      <div>
                        <h4>{client.name}</h4>
                        <div className={styles.clientMeta}>
                          <span>
                            {client.activeCases} active case{client.activeCases !== 1 ? "s" : ""}
                          </span>
                          <span>
                            {client.totalCases} total case{client.totalCases !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.clientContact}>
                      <div className={styles.contactItem}>
                        <Mail size={14} />
                        <span>{client.email}</span>
                      </div>
                      <div className={styles.contactItem}>
                        <Phone size={14} />
                        <span>{client.phone}</span>
                      </div>
                    </div>

                    {selectedClient === client.id && (
                      <div className={styles.clientDetails}>
                        <div className={styles.clientCases}>
                          <h5>Associated Cases</h5>
                          <ul className={styles.casesList}>
                            {cases
                              .filter((caseItem) => caseItem.client === client.name)
                              .map((caseItem) => (
                                <li key={caseItem.id} className={styles.clientCaseItem}>
                                  <div>
                                    <h6>{caseItem.title}</h6>
                                    <span className={`${styles.status} ${styles[caseItem.status]}`}>
                                      {caseItem.status}
                                    </span>
                                  </div>
                                  <p>{caseItem.description}</p>
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className={styles.clientActions}>
                          <button className={styles.actionButton}>
                            <MessageSquare size={14} />
                            Message
                          </button>
                          <button className={styles.actionButton}>
                            <Calendar size={14} />
                            Schedule Meeting
                          </button>
                          <button className={styles.actionButton}>
                            <File size={14} />
                            View Documents
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "appointments" && (
            <section className={styles.appointmentsSection}>
              <div className={styles.sectionHeader}>
                <h2>Appointments</h2>
                <button className={styles.addButton}>
                  <PlusCircle size={14} />
                  Schedule New
                </button>
              </div>

              <div className={styles.appointmentsList}>
                {appointments.map((appointment) => (
                  <div key={appointment.id} className={styles.appointmentCard}>
                    <div className={styles.appointmentHeader}>
                      <h4>{appointment.title}</h4>
                      <span className={`${styles.status} ${styles[appointment.status]}`}>{appointment.status}</span>
                    </div>
                    <div className={styles.appointmentInfo}>
                      <p>Client: {appointment.client}</p>
                      <div className={styles.appointmentMeta}>
                        <div className={styles.metaItem}>
                          <Calendar size={14} />
                          <span>{appointment.date}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Clock size={14} />
                          <span>{appointment.time}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <MapPin size={14} />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.appointmentActions}>
                      <button className={styles.actionButton}>
                        <Edit size={14} />
                        Reschedule
                      </button>
                      <button className={styles.actionButton}>
                        <CheckCircle size={14} />
                        Complete
                      </button>
                      <button className={styles.actionButton}>
                        <Trash2 size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "documents" && (
            <section className={styles.documentsSection}>
              <div className={styles.sectionHeader}>
                <h2>Documents & Evidence</h2>
                <div className={styles.documentActions}>
                  <button className={styles.uploadButton}>
                    <Upload size={14} />
                    Upload New
                  </button>
                  <button className={styles.filterButton}>
                    <Filter size={14} />
                    Filter
                  </button>
                </div>
              </div>

              <div className={styles.documentsList}>
                {documents.map((doc) => (
                  <div key={doc.id} className={styles.documentCard}>
                    <div className={styles.documentIcon}>
                      <File size={16} />
                    </div>
                    <div className={styles.documentInfo}>
                      <h4>{doc.name}</h4>
                      <p>Case: {doc.case}</p>
                      <span>
                        {doc.size} • {doc.date}
                      </span>
                    </div>
                    <div className={styles.documentActions}>
                      <button className={styles.iconButton}>
                        <Eye size={14} />
                      </button>
                      <button className={styles.iconButton}>
                        <Download size={14} />
                      </button>
                      <button className={styles.iconButton}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "messages" && (
            <section className={styles.messagesSection}>
              <div className={styles.sectionHeader}>
                <h2>Messages</h2>
                <button className={styles.addButton}>
                  <Plus size={14} />
                  New Message
                </button>
              </div>

              <div className={styles.messagesList}>
                {messages.map((message) => (
                  <div key={message.id} className={`${styles.messageCard} ${message.unread ? styles.unread : ""}`}>
                    <div className={styles.messageHeader}>
                      <div className={styles.messageSender}>
                        <img
                          src={message.avatar || "/placeholder.svg"}
                          alt={message.sender}
                          className={styles.senderAvatar}
                        />
                        <h4>{message.sender}</h4>
                      </div>
                      <span className={styles.messageTime}>{message.time}</span>
                    </div>
                    <p className={styles.messageContent}>{message.message}</p>
                    <div className={styles.messageActions}>
                      <button className={styles.replyButton}>
                        <MessageSquare size={14} />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "lawfirm" && (
            <section className={styles.lawFirmSection}>
              <div className={styles.sectionHeader}>
                <h2>Law Firm Information</h2>
                <button className={styles.editButton}>
                  <Edit size={14} />
                  Edit
                </button>
              </div>

              <div className={styles.lawFirmCard}>
                <div className={styles.lawFirmHeader}>
                  <h3>{lawFirmData.name}</h3>
                </div>

                <div className={styles.lawFirmInfo}>
                  <div className={styles.infoGroup}>
                    <h4>Address</h4>
                    <p>{lawFirmData.address}</p>
                  </div>
                  <div className={styles.infoGroup}>
                    <h4>Phone</h4>
                    <p>{lawFirmData.phone}</p>
                  </div>
                  <div className={styles.infoGroup}>
                    <h4>Email</h4>
                    <p>{lawFirmData.email}</p>
                  </div>
                </div>

                <div className={styles.lawFirmTeam}>
                  <div className={styles.teamSection}>
                    <h4>Partners</h4>
                    <ul className={styles.teamList}>
                      {lawFirmData.partners.map((partner, index) => (
                        <li key={index} className={styles.teamMember}>
                          {partner}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.teamSection}>
                    <h4>Associates</h4>
                    <ul className={styles.teamList}>
                      {lawFirmData.associates.map((associate, index) => (
                        <li key={index} className={styles.teamMember}>
                          {associate}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.lawFirmActions}>
                  <button className={styles.actionButton}>
                    <UserPlus size={14} />
                    Add Team Member
                  </button>
                  <button className={styles.actionButton}>
                    <Building size={14} />
                    Firm Details
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "settings" && (
            <section className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Settings</h2>
              </div>

              <div className={styles.settingsCard}>
                <div className={styles.settingsGroup}>
                  <h3>Profile Settings</h3>
                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>Email Notifications</h4>
                      <p>Receive email notifications for new cases, appointments, and messages</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>

                <div className={styles.settingsGroup}>
                  <h3>Case Management Settings</h3>
                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>Case Reminders</h4>
                      <p>Receive reminders for upcoming hearings and deadlines</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>Document Sharing</h4>
                      <p>Allow clients to upload documents directly to their cases</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>

                <div className={styles.settingsGroup}>
                  <h3>Account Settings</h3>
                  <button className={styles.settingsButton}>Change Password</button>
                  <button className={styles.settingsButton}>Manage Subscription</button>
                  <button className={styles.settingsButton}>Privacy Settings</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default LawyerDashboard

