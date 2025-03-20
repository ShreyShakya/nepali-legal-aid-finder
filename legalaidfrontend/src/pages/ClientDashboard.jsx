"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./ClientDashboard.module.css"

export default function ClientDashboard() {
  const [client, setClient] = useState(null)
  const [lawyers, setLawyers] = useState([])
  const [searchFilters, setSearchFilters] = useState({
    specialization: "",
    location: "",
    availability_status: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('clientToken')
    const clientData = localStorage.getItem('client')

    if (!token || !clientData) {
      navigate('/client-login')
      return
    }

    setClient(JSON.parse(clientData))
    fetchLawyers() // Fetch lawyers on initial load
  }, [navigate])

  const handleFilterChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value })
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    fetchLawyers()
  }

  const fetchLawyers = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/lawyers', {
        params: searchFilters,
      })
      setLawyers(response.data.lawyers)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch lawyers")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('clientToken')
    localStorage.removeItem('client')
    navigate('/client-login')
  }

  const handleViewProfile = (lawyerId) => {
    navigate(`/lawyer-profile/${lawyerId}`) // Redirect to lawyer profile page (to be implemented)
  }

  if (!client) return <div>Loading...</div>

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome, {client.name}</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      <section className={styles.content}>
        <h2>Search for Lawyers</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.formGroup}>
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              placeholder="e.g., Corporate Law"
              value={searchFilters.specialization}
              onChange={handleFilterChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., Kathmandu"
              value={searchFilters.location}
              onChange={handleFilterChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="availability_status">Availability Status</label>
            <select
              id="availability_status"
              name="availability_status"
              value={searchFilters.availability_status}
              onChange={handleFilterChange}
              className={styles.formInput}
            >
              <option value="">Any</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
          </div>
          <button type="submit" className={styles.searchButton} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.lawyerList}>
          {lawyers.length === 0 ? (
            <p>No lawyers found.</p>
          ) : (
            lawyers.map((lawyer) => (
              <div key={lawyer.id} className={styles.lawyerCard}>
                <div className={styles.lawyerInfo}>
                  {lawyer.profile_picture ? (
                    <img
                      src={lawyer.profile_picture}
                      alt={lawyer.name}
                      className={styles.profilePicture}
                    />
                  ) : (
                    <div className={styles.placeholderPicture}>No Image</div>
                  )}
                  <div>
                    <h3>{lawyer.name}</h3>
                    <p><strong>Specialization:</strong> {lawyer.specialization || 'Not specified'}</p>
                    <p><strong>Location:</strong> {lawyer.location || 'Not specified'}</p>
                    <p><strong>Availability:</strong> {lawyer.availability_status || 'Not specified'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewProfile(lawyer.id)}
                  className={styles.viewProfileButton}
                >
                  View Profile
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}