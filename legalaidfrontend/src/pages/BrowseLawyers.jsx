import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./BrowseLawyers.module.css";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function BrowseLawyers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    minRating: "",
    availabilityStatus: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hardcoded list of legal services
  const legalServices = [
    "Divorce",
    "Land Settlement",
    "Corporate Law",
    "Criminal Defense",
    "Family Law",
    "Intellectual Property",
    "Labor Law",
    "Immigration Law",
    "Tax Law",
    "Personal Injury",
  ];

  // Handle search input and show suggestions
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
      setSelectedService("");
      setLawyers([]);
      return;
    }

    const filteredSuggestions = legalServices.filter((service) =>
      service.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (service) => {
    setSearchQuery(service);
    setSelectedService(service);
    setSuggestions([]);
    fetchLawyers(service, filters);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (selectedService) {
        fetchLawyers(selectedService, newFilters);
      }
      return newFilters;
    });
  };

  // Fetch lawyers based on the selected legal service and filters
  const fetchLawyers = async (service, filters) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/lawyers', {
        params: {
          specialization: service,
          location: filters.location,
          min_rating: filters.minRating,
          availability_status: filters.availabilityStatus,
        },
      });
      setLawyers(response.data.lawyers);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch lawyers");
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    const serviceToSearch = selectedService || suggestions[0] || searchQuery;
    setSearchQuery(serviceToSearch);
    setSelectedService(serviceToSearch);
    setSuggestions([]);
    fetchLawyers(serviceToSearch, filters);
  };

  const handleViewProfile = (lawyerId) => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      navigate('/client-login');
      return;
    }
    navigate(`/lawyer-profile/${lawyerId}`);
  };

  return (
    <motion.div
      className={styles.browseLawyers}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} />
            <span>NepaliLegalAidFinder</span>
          </div>
          <nav className={styles.mainNav}>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/client-login">Client Login</a></li>
              <li><a href="/lawyer-login">Lawyer Login</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Search Section */}
      <section className={styles.searchSection}>
        <div className={styles.container}>
          <motion.div className={styles.searchContent} variants={slideUp}>
            <h1>Browse Lawyers</h1>
            <p>Find the right legal expert for your needs.</p>

            <motion.form
              onSubmit={handleSearch}
              className={styles.searchForm}
              variants={slideUp}
            >
              <div className={styles.searchInput}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by legal service (e.g., Divorce)"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={styles.suggestionItem}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Filters and Results Section */}
      {selectedService && (
        <motion.section
          className={styles.resultsSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <motion.h2 variants={slideUp}>
                Lawyers Specializing in {selectedService}
              </motion.h2>
            </div>

            {/* Filter Form */}
            <form className={styles.filterForm}>
              <div className={styles.filterGroup}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., Kathmandu"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                />
              </div>
              <div className={styles.filterGroup}>
                <label htmlFor="minRating">Minimum Rating</label>
                <select
                  id="minRating"
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                >
                  <option value="">Any</option>
                  <option value="1">1 Star & Up</option>
                  <option value="2">2 Stars & Up</option>
                  <option value="3">3 Stars & Up</option>
                  <option value="4">4 Stars & Up</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label htmlFor="availabilityStatus">Availability</label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  value={filters.availabilityStatus}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                >
                  <option value="">Any</option>
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                </select>
              </div>
            </form>

            {/* Results */}
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : lawyers.length === 0 ? (
              <p>No lawyers found for {selectedService}.</p>
            ) : (
              <motion.div
                className={styles.lawyerGrid}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {lawyers.map((lawyer) => (
                  <motion.div
                    key={lawyer.id}
                    className={styles.lawyerCard}
                    variants={slideUp}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.lawyerImage}>
                      {lawyer.profile_picture ? (
                        <img
                          src={lawyer.profile_picture}
                          alt={lawyer.name}
                          className={styles.profilePicture}
                        />
                      ) : (
                        <div className={styles.placeholderPicture}>No Image</div>
                      )}
                    </div>
                    <div className={styles.lawyerInfo}>
                      <h3>{lawyer.name}</h3>
                      <p><strong>Specialization:</strong> {lawyer.specialization || 'Not specified'}</p>
                      <p><strong>Location:</strong> {lawyer.location || 'Not specified'}</p>
                      <p><strong>Rating:</strong> {lawyer.rating ? lawyer.rating.toFixed(1) : 'Not rated'}</p>
                      <p><strong>Availability:</strong> {lawyer.availability_status || 'Not specified'}</p>
                    </div>
                    <button
                      onClick={() => handleViewProfile(lawyer.id)}
                      className={styles.viewProfileButton}
                    >
                      View Profile
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}