import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import LawyersList from './LawyersList';
import ClientsList from './ClientsList';
import CasesList from './CasesList';
import AppointmentsList from './AppointmentsList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lawyers');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>
      <nav className={styles.nav}>
        <button
          className={activeTab === 'lawyers' ? styles.active : ''}
          onClick={() => setActiveTab('lawyers')}
        >
          Lawyers
        </button>
        <button
          className={activeTab === 'clients' ? styles.active : ''}
          onClick={() => setActiveTab('clients')}
        >
          Clients
        </button>
        <button
          className={activeTab === 'cases' ? styles.active : ''}
          onClick={() => setActiveTab('cases')}
        >
          Cases
        </button>
        <button
          className={activeTab === 'appointments' ? styles.active : ''}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
      </nav>
      <main className={styles.main}>
        {activeTab === 'lawyers' && <LawyersList />}
        {activeTab === 'clients' && <ClientsList />}
        {activeTab === 'cases' && <CasesList />}
        {activeTab === 'appointments' && <AppointmentsList />}
      </main>
    </div>
  );
};

export default Dashboard;