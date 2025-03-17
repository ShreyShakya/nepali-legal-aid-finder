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
        const token = localStorage.getItem('token'); // Fetch token from local storage
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
    localStorage.removeItem('token'); // Clear the token from local storage
    window.location.href = "/login"; // Redirect to the login page
  };

  const handleProfileEdit = () => {
    setEditingProfile(!editingProfile);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Menu Toggle */}
      <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
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
          <button
            className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("overview");
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <Briefcase size={18} />
            <span>Overview</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "cases" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("cases");
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <FileText size={18} />
            <span>My Cases</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "documents" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("documents");
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <File size={18} />
            <span>Documents</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "calendar" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("calendar");
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <Calendar size={18} />
            <span>Calendar</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "messages" ? styles.active : ""}`}
            onClick={() => {
              setActiveTab("messages");
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
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
              {notificationsOpen && (
                <div className={styles.notificationsDropdown}>
                  <div className={styles.notificationsHeader}>
                    <h3>Notifications</h3>
                    <button className={styles.markAllRead}>Mark all as read</button>
                  </div>
                  <div className={styles.notificationsList}>
                    {/* Notification items */}
                  </div>
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          {activeTab === "overview" && (
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
                  <button
                    className={styles.editButton}
                    onClick={handleProfileEdit}
                  >
                    {editingProfile ? "Save" : "Edit Profile"}
                  </button>
                </div>

                {editingProfile ? (
                  <div className={styles.editProfileForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input type="text" defaultValue={userData?.first_name + " " + userData?.last_name} />
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
                      <p>{userData?.phone_number}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <h4>City</h4>
                      <p>{userData?.city}</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;