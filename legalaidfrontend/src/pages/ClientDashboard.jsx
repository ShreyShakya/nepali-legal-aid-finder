"use client"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ClientDashboard.module.css";

export default function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const clientData = localStorage.getItem('client');

    if (!token || !clientData) {
      navigate('/client-login');
      return;
    }

    setClient(JSON.parse(clientData));
    fetchAppointments(token);
  }, [navigate]);

  const fetchAppointments = async (token) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/client-appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data.appointments);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('client');
    navigate('/client-login');
  };

  if (!client) return <div>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome, {client.name}</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>
      <section className={styles.content}>
        <h2>Your Profile</h2>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone || 'Not provided'}</p>

        <h2>Your Appointments</h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : appointments.length === 0 ? (
          <p>You have no appointments scheduled.</p>
        ) : (
          <div className={styles.appointmentList}>
            {appointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <h3>Appointment with {appointment.lawyer_name}</h3>
                <p><strong>Specialization:</strong> {appointment.specialization}</p>
                <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
                <p><strong>Booked On:</strong> {new Date(appointment.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        <h2>Your Cases</h2>
        <p>Feature coming soon: View and manage your legal cases here.</p>

        <p>
          Looking for a lawyer? <a href="/browse-lawyers" className={styles.link}>Browse Lawyers</a>
        </p>
      </section>
    </div>
  );
}