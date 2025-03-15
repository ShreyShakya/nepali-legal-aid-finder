"use client"

import { useState } from "react"
import {
  Scale,
  User,
  Settings,
  LogOut,
  Bell,
  FileText,
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
} from "lucide-react"
import styles from "./Dashboard.module.css"

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const userData = {
    name: "Jason Moralles",
    email: "jasonmoralles@mail.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Client",
    phone: "904-302-4131",
    address: "750 third street, Neptune beach, FL 32266",
    dob: "1985/01/07",
  }

  const caseStats = {
    active: 3,
    pending: 2,
    completed: 5,
  }

  const recentActivity = [
    {
      id: 1,
      type: "case_update",
      title: "Property Dispute Case #2024-01",
      status: "active",
      date: "2024-03-12",
      description: "New evidence documents uploaded",
    },
    {
      id: 2,
      type: "appointment",
      title: "Consultation Meeting",
      status: "pending",
      date: "2024-03-15",
      description: "Scheduled with Adv. Sarah Wilson",
    },
  ]

  const documents = [
    {
      id: 1,
      name: "Property Deed.pdf",
      type: "pdf",
      size: "2.4 MB",
      date: "2024-03-10",
    },
    {
      id: 2,
      name: "Evidence Photos.zip",
      type: "zip",
      size: "15.7 MB",
      date: "2024-03-11",
    },
  ]

  const notifications = [
    {
      id: 1,
      message: "Your next appointment is tomorrow at 2:00 PM",
      type: "reminder",
      time: "1 hour ago",
    },
    {
      id: 2,
      message: "New document shared in Case #2024-01",
      type: "update",
      time: "3 hours ago",
    },
  ]

  const navigationItems = [
    { id: "overview", icon: <Briefcase size={18} />, label: "Overview" },
    { id: "cases", icon: <FileText size={18} />, label: "My Cases" },
    { id: "documents", icon: <File size={18} />, label: "Documents" },
    { id: "calendar", icon: <Calendar size={18} />, label: "Calendar" },
    { id: "messages", icon: <MessageSquare size={18} />, label: "Messages" },
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
            <img src={userData.avatar || "/placeholder.svg"} alt={userData.name} className={styles.avatar} />
            <div className={styles.userInfo}>
              <h4>{userData.name}</h4>
              <span>{userData.role}</span>
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
            <input type="text" placeholder="Search cases, documents..." />
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
          {activeTab === "overview" && (
            <>
              <div className={styles.overviewGrid}>
                <section className={styles.profileCard}>
                  <div className={styles.profileHeader}>
                    <img
                      src={userData.avatar || "/placeholder.svg"}
                      alt={userData.name}
                      className={styles.profileAvatar}
                    />
                    <div>
                      <h2 className={styles.profileName}>{userData.name}</h2>
                      <p className={styles.profileEmail}>{userData.email}</p>
                    </div>
                    <button className={styles.editButton}>Edit</button>
                  </div>
                  <div className={styles.profileInfo}>
                    <div className={styles.infoGroup}>
                      <h4>DOB</h4>
                      <p>{userData.dob}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <h4>Phone</h4>
                      <p>{userData.phone}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <h4>Address</h4>
                      <p>{userData.address}</p>
                    </div>
                  </div>
                </section>

                <section className={styles.statsSection}>
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
                </section>
              </div>

              {/* Recent Activity */}
              <section className={styles.activitySection}>
                <div className={styles.sectionHeader}>
                  <h2>Recent Activity</h2>
                  <button className={styles.viewAllButton}>
                    View All <ChevronRight size={14} />
                  </button>
                </div>

                <div className={styles.activityList}>
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className={styles.activityCard}>
                      <div className={styles.activityHeader}>
                        <h3>{activity.title}</h3>
                        <span className={`${styles.status} ${styles[activity.status]}`}>{activity.status}</span>
                      </div>
                      <p>{activity.description}</p>
                      <div className={styles.activityFooter}>
                        <span>{activity.date}</span>
                        <button className={styles.detailsButton}>
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === "cases" && (
            <section className={styles.casesSection}>
              <div className={styles.sectionHeader}>
                <h2>My Cases</h2>
                <button className={styles.uploadButton}>
                  <PlusCircle size={14} />
                  New Case
                </button>
              </div>
              <div className={styles.activityList}>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className={styles.activityCard}>
                    <div className={styles.activityHeader}>
                      <h3>{activity.title}</h3>
                      <span className={`${styles.status} ${styles[activity.status]}`}>{activity.status}</span>
                    </div>
                    <p>{activity.description}</p>
                    <div className={styles.activityFooter}>
                      <span>{activity.date}</span>
                      <button className={styles.detailsButton}>
                        Details <ChevronRight size={14} />
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
                    <PlusCircle size={14} />
                    Upload
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
                      <span>
                        {doc.size} • {doc.date}
                      </span>
                    </div>
                    <button className={styles.viewButton}>
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "calendar" && (
            <section className={styles.calendarSection}>
              <div className={styles.sectionHeader}>
                <h2>Upcoming Appointments</h2>
                <button className={styles.uploadButton}>
                  <PlusCircle size={14} />
                  Schedule
                </button>
              </div>
              <div className={styles.emptyState}>
                <Calendar size={36} />
                <h3>No upcoming appointments</h3>
                <p>Schedule a consultation with your lawyer</p>
              </div>
            </section>
          )}

          {activeTab === "messages" && (
            <section className={styles.messagesSection}>
              <div className={styles.sectionHeader}>
                <h2>Messages</h2>
              </div>
              <div className={styles.emptyState}>
                <MessageSquare size={36} />
                <h3>No messages yet</h3>
                <p>Start a conversation with your legal team</p>
                <button>
                  <MessageSquare size={14} />
                  New Message
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

