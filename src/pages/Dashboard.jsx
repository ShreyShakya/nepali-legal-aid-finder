import React, { useState } from 'react';
import {
  Scale,
  User,
  Settings,
  LogOut,
  Bell,
  FileText,
  Users,
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
  Image,
  File,
} from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const cases = {
    active: 2,
    pending: 1,
    closed: 3,
    recent: [
      {
        id: 1,
        title: 'Property Dispute Resolution',
        status: 'Active',
        lastUpdate: '2024-03-15',
        description: 'Updated evidence submitted for review',
      },
      {
        id: 2,
        title: 'Family Law Consultation',
        status: 'Pending',
        lastUpdate: '2024-03-14',
        description: 'Awaiting lawyer assignment',
      },
    ],
  };

  const assignedLawyer = {
    name: 'Adv. Rajesh Sharma',
    specialty: 'Property Law',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    nextAppointment: '2024-03-20 14:00',
  };

  const notifications = [
    {
      id: 1,
      type: 'case',
      message: 'New document uploaded to your case #123',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'appointment',
      message: 'Upcoming consultation tomorrow at 2 PM',
      time: '5 hours ago',
    },
  ];

  const documents = [
    {
      id: 1,
      title: 'Property Deed',
      type: 'image',
      format: 'JPG',
      uploadDate: '2024-03-15',
      caseId: 'CASE123',
    },
    {
      id: 2,
      title: 'Witness Statement',
      type: 'document',
      format: 'PDF',
      uploadDate: '2024-03-14',
      caseId: 'CASE123',
    },
  ];

  const sidebarItems = [
    { icon: <Briefcase />, label: 'Overview', id: 'overview' },
    { icon: <FileText />, label: 'My Cases', id: 'cases' },
    { icon: <Users />, label: 'My Lawyer', id: 'lawyer' },
    { icon: <File />, label: 'Documents', id: 'documents' },
    { icon: <Bell />, label: 'Notifications', id: 'notifications' },
  ];

  const quickActions = [
    { icon: <Eye />, label: 'View Evidence' },
    { icon: <MessageSquare />, label: 'Contact Lawyer' },
    { icon: <PlusCircle />, label: 'New Case' },
  ];

  return (
    <div className="dashboard-layout">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <Scale className="logo-icon" />
              <span>NepaliLegalAidFinder</span>
            </div>
            <div className="header-actions">
              <div className="notifications-dropdown">
                <Bell className="icon" />
                <span className="notification-badge">2</span>
              </div>
              <div className="profile-dropdown" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Profile" className="profile-image" />
                {profileDropdownOpen && (
                  <div className="dropdown-menu">
                    <a href="#profile"><User /> Profile</a>
                    <a href="#settings"><Settings /> Settings</a>
                    <a href="#logout"><LogOut /> Logout</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            {quickActions.map((action, index) => (
              <button key={index} className="quick-action-button">
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Case Status Summary */}
          <section className="case-summary">
            <div className="status-cards">
              <div className="status-card active">
                <Briefcase className="status-icon" />
                <div className="status-info">
                  <h3>Active Cases</h3>
                  <p className="status-number">{cases.active}</p>
                </div>
              </div>
              <div className="status-card pending">
                <Clock className="status-icon" />
                <div className="status-info">
                  <h3>Pending Cases</h3>
                  <p className="status-number">{cases.pending}</p>
                </div>
              </div>
              <div className="status-card closed">
                <CheckCircle className="status-icon" />
                <div className="status-info">
                  <h3>Closed Cases</h3>
                  <p className="status-number">{cases.closed}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Cases */}
          <section className="recent-cases">
            <div className="section-header">
              <h2>Recent Cases</h2>
              <button className="view-all-button">View All Cases</button>
            </div>
            <div className="cases-list">
              {cases.recent.map((case_) => (
                <div key={case_.id} className="case-card">
                  <div className="case-header">
                    <h3>{case_.title}</h3>
                    <span className={`status-badge ${case_.status.toLowerCase()}`}>
                      {case_.status}
                    </span>
                  </div>
                  <p className="case-update">{case_.description}</p>
                  <div className="case-footer">
                    <span className="update-date">{case_.lastUpdate}</span>
                    <button className="details-button">
                      View Details <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* My Lawyer Section */}
          <section className="my-lawyer">
            <div className="section-header">
              <h2>My Lawyer</h2>
            </div>
            <div className="lawyer-card">
              <img src={assignedLawyer.image} alt={assignedLawyer.name} className="lawyer-image" />
              <div className="lawyer-info">
                <h3>{assignedLawyer.name}</h3>
                <p className="specialty">{assignedLawyer.specialty}</p>
                <div className="next-appointment">
                  <Calendar size={16} />
                  <span>Next Appointment: {assignedLawyer.nextAppointment}</span>
                </div>
                <button className="contact-button">
                  <MessageSquare size={16} />
                  Request Consultation
                </button>
              </div>
            </div>
          </section>

          {/* Documents/Evidence Section */}
          <section className="documents">
            <div className="section-header">
              <h2>Case Documents & Evidence</h2>
              <div className="document-search">
                <div className="search-input">
                  <Search size={16} />
                  <input type="text" placeholder="Search documents..." />
                </div>
                <button className="filter-button">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
            </div>
            <div className="documents-grid">
              {documents.map((document) => (
                <div key={document.id} className="document-card">
                  {document.type === 'image' ? (
                    <Image className="document-icon" />
                  ) : (
                    <File className="document-icon" />
                  )}
                  <div className="document-info">
                    <h3>{document.title}</h3>
                    <p>Case ID: {document.caseId}</p>
                    <p className="document-meta">
                      {document.format} • Uploaded on {document.uploadDate}
                    </p>
                  </div>
                  <button className="view-button">
                    <Eye size={16} />
                    View
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className="notifications">
            <div className="section-header">
              <h2>Notifications</h2>
              <button className="mark-all-read">Mark all as read</button>
            </div>
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <AlertCircle className="notification-icon" />
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;