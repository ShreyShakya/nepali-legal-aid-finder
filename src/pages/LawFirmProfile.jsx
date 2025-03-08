import { useState } from "react";
import {
  MapPin,
  Users,
  Calendar,
  Star,
  Phone,
  Mail,
  Clock,
  Globe,
  Award,
  FileText,
  DollarSign,
  ChevronRight,
  CheckCircle,
  User,
} from "lucide-react";
import "./LawFirmProfile.css";

function App() {
  const [activeTab, setActiveTab] = useState("about");

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => <Star key={index} className={`star-icon ${index < rating ? "filled" : ""}`} />);
  };

  const reviews = [
    {
      id: "1",
      author: "John Smith",
      rating: 5,
      date: "2024-02-20",
      comment: "Excellent service and professional team. They handled my case with great expertise.",
    },
    {
      id: "2",
      author: "Sarah Johnson",
      rating: 5,
      date: "2024-02-15",
      comment: "Very knowledgeable and responsive. Would highly recommend their services.",
    },
  ];

  const teamMembers = [
    {
      id: "1",
      name: "David Wilson",
      role: "Senior Partner",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      experience: "15+ years",
    },
    {
      id: "2",
      name: "Emily Chen",
      role: "Associate",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      experience: "8+ years",
    },
  ];

  const practiceAreas = [
    "Corporate Law",
    "Civil Litigation",
    "Real Estate Law",
    "Family Law",
    "Criminal Defense",
    "Immigration Law",
  ];

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <section className="profile-hero">
        <div className="hero-content">
          <div className="firm-identity">
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
              alt="Law Firm Logo"
              className="firm-logo"
              width={120}
              height={120}
            />
            <div className="firm-info">
              <h1>Imperial Law Associates LLC</h1>
              <div className="firm-meta">
                <div className="rating-wrapper">
                  <div className="stars">{renderStars(5)}</div>
                  <span className="rating-text">5.0 (28 reviews)</span>
                </div>
                <div className="verification-badge">
                  <CheckCircle className="verify-icon" />
                  Verified
                </div>
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <Users className="stat-icon" />
              <div className="stat-text">
                <span className="stat-value">15+</span>
                <span className="stat-label">Lawyers</span>
              </div>
            </div>
            <div className="stat-item">
              <Calendar className="stat-icon" />
              <div className="stat-text">
                <span className="stat-value">1995</span>
                <span className="stat-label">Established</span>
              </div>
            </div>
            <div className="stat-item">
              <Award className="stat-icon" />
              <div className="stat-text">
                <span className="stat-value">500+</span>
                <span className="stat-label">Cases Won</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="profile-content">
        <div className="content-grid">
          {/* Left Column */}
          <div className="main-column">
            {/* Navigation Tabs */}
            <nav className="profile-tabs">
              <button
                className={`tab-button ${activeTab === "about" ? "active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                className={`tab-button ${activeTab === "practice" ? "active" : ""}`}
                onClick={() => setActiveTab("practice")}
              >
                Practice Areas
              </button>
              <button
                className={`tab-button ${activeTab === "team" ? "active" : ""}`}
                onClick={() => setActiveTab("team")}
              >
                Our Team
              </button>
              <button
                className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </nav>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "about" && (
                <div className="about-section">
                  <h2>About Us</h2>
                  <p>
                    Imperial Law Associates LLC is a full-service law firm with over 25 years of experience serving clients in
                    Kathmandu. Our team of dedicated attorneys brings extensive expertise across various practice areas,
                    providing comprehensive legal solutions tailored to our clients' needs.
                  </p>
                  <p>
                    We pride ourselves on our commitment to excellence, ethical practice, and client satisfaction. Our
                    firm has successfully handled thousands of cases, establishing a strong reputation in the legal
                    community.
                  </p>

                  <div className="key-features">
                    <h2>Why Choose Us</h2>
                    <ul>
                      <li>
                        <CheckCircle className="feature-icon" />
                        Experienced team of legal professionals
                      </li>
                      <li>
                        <CheckCircle className="feature-icon" />
                        Personalized attention to each case
                      </li>
                      <li>
                        <CheckCircle className="feature-icon" />
                        Proven track record of success
                      </li>
                      <li>
                        <CheckCircle className="feature-icon" />
                        Transparent communication and pricing
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "practice" && (
                <div className="practice-areas-section">
                  <h2>Practice Areas</h2>
                  <div className="practice-grid">
                    {practiceAreas.map((area, index) => (
                      <div key={index} className="practice-card">
                        <FileText className="practice-icon" />
                        <h3>{area}</h3>
                        <ChevronRight className="arrow-icon" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="team-section">
                  <h2>Our Team</h2>
                  <div className="team-grid">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="team-card">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="member-image"
                          width={200}
                          height={200}
                        />
                        <div className="member-info">
                          <h3>{member.name}</h3>
                          <p className="member-role">{member.role}</p>
                          <p className="member-experience">
                            <Clock className="experience-icon" />
                            {member.experience} experience
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="reviews-section">
                  <h2>Client Reviews</h2>
                  <div className="reviews-grid">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <User className="reviewer-icon" />
                            <span className="reviewer-name">{review.author}</span>
                          </div>
                          <div className="review-rating">{renderStars(review.rating)}</div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <span className="review-date">{review.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="sidebar">
            <div className="contact-card">
              <h3>Schedule a Consultation</h3>
              <div className="consultation-info">
                <div className="info-item">
                  <Clock className="info-icon" />
                  <div className="info-text">
                    <span className="info-label">Duration</span>
                    <span className="info-value">30 minutes</span>
                  </div>
                </div>
                <div className="info-item">
                  <DollarSign className="info-icon" />
                  <div className="info-text">
                    <span className="info-label">Consultation Fee</span>
                    <span className="info-value">Free</span>
                  </div>
                </div>
              </div>
              <button className="book-button">Book Consultation</button>

              <div className="contact-details">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <a href="mailto:contact@imp.com">contact@imperiallaw.com</a>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <address>123 Legal Street, Kathmandu, KTM 10001</address>
                </div>
                <div className="contact-item">
                  <Globe className="contact-icon" />
                  <a href="https://www.imperiallaw.com" target="_blank" rel="noopener noreferrer">
                    www.imperiallaw.com
                  </a>
                </div>
              </div>
            </div>

            <div className="languages-card">
              <h3>Languages</h3>
              <div className="languages-list">
                <span className="language-tag">English</span>
                <span className="language-tag">Nepali</span>
                <span className="language-tag">Hindi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;