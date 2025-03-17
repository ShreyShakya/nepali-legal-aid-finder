import { useState, useEffect } from "react";
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
  Upload,
} from "lucide-react";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:5000/dashboard?token=${token}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const userName = `${userData?.first_name || ''} ${userData?.last_name || ''}`;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  const handleProfileEdit = () => {
    setEditingProfile(!editingProfile);
  };

  // Sample data for new sections
  const caseStats = {
    active: 0,
    pending: 0,
    completed: 0,
  };

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
  ];

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
  ];

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
  ];

  return (
    <div className={styles.dashboardContainer}>
      <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} size={20} />
            <span>Legal Portal</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("overview");
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <Briefcase size={18} />
            <span>Overview</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "cases" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("cases");
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <FileText size={18} />
            <span>My Cases</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "documents" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("documents");
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <File size={18} />
            <span>Documents</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "calendar" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("calendar");
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <Calendar size={18} />
            <span>Calendar</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "messages" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("messages");
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <MessageSquare size={18} />
            <span>Messages</span>
          </button>
        </nav>

        <div className={styles.userProfile}>
          <div className={styles.profileSection} onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
            <img src={userData?.avatar || "https://api.dicebear.com/9.x/miniavs/svg"} alt={userName} className={styles.avatar} />
            <div className={styles.userInfo}>
              <h4>{userName}</h4>
              <span>Client</span>
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
              <button className={styles.dropdownItem} onClick={handleSignOut}>
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className={styles.mainContent}>
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

        <div className={styles.dashboardContent}>
          {activeTab === "overview" && (
            <>
              <div className={styles.overviewGrid}>
                <section className={styles.profileCard}>
                  <div className={styles.profileHeader}>
                    <img
                      src={userData?.avatar || "https://api.dicebear.com/9.x/miniavs/svg"}
                      alt={userName}
                      className={styles.profileAvatar}
                    />
                    <div>
                      <h2 className={styles.profileName}>{userName}</h2>
                      <p className={styles.profileEmail}>{userData?.email}</p>
                    </div>
                    <button className={styles.editButton} onClick={handleProfileEdit}>
                      {editingProfile ? "Save" : "Edit Profile"}
                    </button>
                  </div>

                  {editingProfile ? (
                    <div className={styles.editProfileForm}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Full Name</label>
                          <input type="text" defaultValue={userName} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Email</label>
                          <input type="email" defaultValue={userData?.email} />
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Phone</label>
                          <input type="tel" defaultValue={userData?.phone_number} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>City</label>
                          <input type="text" defaultValue={userData?.city} />
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
                            <span className={styles.fileName}>{userData?.avatar || "profile-image.jpg"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.profileInfo}>
                      <div className={styles.infoGroup}>
                        <h4>Phone</h4>
                        <p>{userData?.phone_number || "Not provided"}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <h4>City</h4>
                        <p>{userData?.city || "Not provided"}</p>
                      </div>
                    </div>
                  )}
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
                        <span className={`${styles.status} ${styles[activity.status]}`}>
                          {activity.status}
                        </span>
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
                  <a href="/lawyers">New Case</a>
                </button>
              </div>
              <div className={styles.activityList}>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className={styles.activityCard}>
                    <div className={styles.activityHeader}>
                      <h3>{activity.title}</h3>
                      <span className={`${styles.status} ${styles[activity.status]}`}>
                        {activity.status}
                      </span>
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
                      <span>{doc.size} • {doc.date}</span>
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
                <button className={styles.uploadButton}>
                  <MessageSquare size={14} />
                  New Message
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;