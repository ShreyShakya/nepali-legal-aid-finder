import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LawyersPage.css';

function LawyersPage() {
  const [lawyers, setLawyers] = useState([
    {
      id: 1,
      name: "Lawin and Partners Law Firm in Nepal",
      location: "Kathmandu, Nepal",
      founded: "2017",
      teamSize: 8,
      languages: ["English"],
      description: "Lawin and Partners is the leading Law Firm in Nepal with the best Lawyer in Nepal. Our team of Lawyers in Nepal are...",
      stars: 4,
    },
    {
      id: 2,
      name: "Imperial Law Associates",
      location: "Kathmandu, Nepal",
      founded: "2018",
      teamSize: 15,
      languages: ["English", "Nepali"],
      description: "Imperial Law Associates is a team of legal professionals providing the best legal services in Nepal. With the growing need for specialized legal...",
      stars: 5,
    },
    {
      id: 3,
      name: "Lawneeti Associates",
      location: "Kathmandu, Nepal",
      founded: "2017",
      teamSize: 10,
      languages: ["English", "Nepali"],
      description: "Law Neeti Associates is a premier law firm based in Kathmandu, Nepal. With a specialization in civil and criminal law, the firm boasts a team of...",
      stars: 4,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lawyers-page">
      {/* Search Section */}
      <section className="search-section">
        <h1>Legal Aid Finder</h1>
        <p>Search for legal aid services in Nepal tailored to your needs.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by location, expertise, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>Search</button>
        </div>
      </section>

      {/* Main Content */}
      <div className="lawyers-container">
        <h2>Search Results</h2>
        <div className="lawyers-grid">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="lawyer-card">
              <h2>{lawyer.name}</h2>
              <p>{lawyer.location}</p>
              <p>Founded in {lawyer.founded}</p>
              <p>{lawyer.teamSize} people in their team</p>
              <div>
                {lawyer.languages.map((lang) => (
                  <span key={lang} className="language">
                    {lang}
                  </span>
                ))}
              </div>
              <p>{lawyer.description}</p>
              <div className="rating">{"⭐".repeat(lawyer.stars)}</div>
              <p>{lawyer.consultation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LawyersPage;
