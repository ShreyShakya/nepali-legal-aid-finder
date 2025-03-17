import { useState } from "react";
import { Search, MapPin, Users, Calendar, Star, Phone, Building, Filter, User } from "lucide-react";
import { Link } from "react-router-dom";
import "./LawyersPage.css";

const lawFirms = [
  {
    id: "1",
    name: "Lawin and Partners Law Firm in Nepal",
    location: "Kathmandu, Nepal",
    founded: 2017,
    teamSize: 8,
    languages: ["English"],
    description:
      "Lawin and Partners is the leading Law Firm in Nepal with the best Lawyer in Nepal. Our team of Lawyers in Nepal are...",
    rating: 4,
    image: "/images/ngo.jpg", // Replaced placeholder with ngo.jpg
    specialties: ["Corporate Law", "Civil Law", "Criminal Law"],
    contact: {
      phone: "+977-1-4444444",
      email: "contact@lawin.com",
    },
  },
  {
    id: "2",
    name: "Imperial Law Associates",
    location: "Kathmandu, Nepal",
    founded: 2018,
    teamSize: 15,
    languages: ["English", "Nepali"],
    description:
      "Imperial Law Associates is a team of legal professionals providing the best legal services in Nepal. With the growing need for specialized legal...",
    rating: 5,
    image: "/images/ngo.jpg", // Replaced placeholder with ngo.jpg
    specialties: ["Commercial Law", "Property Law", "Family Law"],
    contact: {
      phone: "+977-1-5555555",
      email: "contact@imperial.com",
    },
  },
  {
    id: "3",
    name: "Lawneeti Associates",
    location: "Kathmandu, Nepal",
    founded: 2017,
    teamSize: 10,
    languages: ["English", "Nepali"],
    description:
      "Law Neeti Associates is a premier law firm based in Kathmandu, Nepal. With a specialization in civil and criminal law, the firm boasts a team of...",
    rating: 4,
    image: "/images/ngo.jpg", // Replaced placeholder with ngo.jpg
    specialties: ["Civil Law", "Criminal Law", "Constitutional Law"],
    contact: {
      phone: "+977-1-6666666",
      email: "contact@lawneeti.com",
    },
  },
];

export default function LawFirmSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  const allSpecialties = Array.from(new Set(lawFirms.flatMap((firm) => firm.specialties)));

  const handleSpecialtyToggle = (specialty) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  };

  const filteredFirms = lawFirms.filter((firm) => {
    const matchesSearch =
      firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialties =
      selectedSpecialties.length === 0 || selectedSpecialties.some((specialty) => firm.specialties.includes(specialty));

    return matchesSearch && matchesSpecialties;
  });

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => <Star key={index} className={`star-icon ${index < rating ? "filled" : ""}`} />);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Legal Aid Finder</h1>
        <p>Search for legal aid services in Nepal tailored to your needs.</p>

        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by location, expertise, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-header">
            <Filter className="filter-icon" />
            <span>Filter by Specialty:</span>
          </div>
          <div className="specialty-tags">
            {allSpecialties.map((specialty) => (
              <button
                key={specialty}
                className={`specialty-tag ${selectedSpecialties.includes(specialty) ? "active" : ""}`}
                onClick={() => handleSpecialtyToggle(specialty)}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="search-results">
        <h2>Search Results</h2>
        <div className="results-grid">
          {filteredFirms.map((firm) => (
            <div key={firm.id} className="firm-card">
              <div className="firm-header">
                <img src={firm.image || "/placeholder.svg"} alt={firm.name} className="firm-logo" />
                <div className="firm-rating">{renderStars(firm.rating)}</div>
              </div>

              <div className="firm-content">
                <h3>{firm.name}</h3>
                <div className="firm-details">
                  <div className="detail-item">
                    <MapPin className="detail-icon" />
                    <span>{firm.location}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar className="detail-icon" />
                    <span>Founded in {firm.founded}</span>
                  </div>
                  <div className="detail-item">
                    <Users className="detail-icon" />
                    <span>{firm.teamSize} people in their team</span>
                  </div>
                  <div className="detail-item">
                    <Building className="detail-icon" />
                    <span>{firm.specialties.join(", ")}</span>
                  </div>
                </div>
                <p className="firm-description">{firm.description}</p>
                <div className="action-buttons">
                  <button className="action-btn contact">
                    <Phone className="action-icon" /> Contact
                  </button>
                  <button className="action-btn profile">
                    <User className="action-icon" /> <a href="/lawfirmprofile">View Profile</a>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}