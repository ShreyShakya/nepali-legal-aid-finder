import { useState } from "react";
import "./DocumentTemplates.css";
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaDownload,
  FaFileAlt,
  FaGavel,
  FaHandshake,
  FaFileSignature,
} from "react-icons/fa";

const templates = [
  {
    id: 1,
    title: "Employment Contract",
    description: "A standard employment agreement template.",
    category: "contracts",
    icon: FaFileSignature, // Store reference, not JSX
  },
  {
    id: 2,
    title: "Affidavit of Residence",
    description: "A document to verify a person's place of residence.",
    category: "affidavits",
    icon: FaGavel,
  },
  {
    id: 3,
    title: "Rental Agreement",
    description: "A legal document between a landlord and a tenant.",
    category: "agreements",
    icon: FaHandshake,
  },
  {
    id: 4,
    title: "Freelance Work Contract",
    description: "A contract template for hiring freelancers.",
    category: "contracts",
    icon: FaFileAlt,
  },
];

export default function LegalTemplates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || template.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (templateId) => {
    console.log(`Downloading template ${templateId}`);
  };

  return (
    <div className="legal-templates">
      <div className="header">
        <h1>Legal Document Templates</h1>
        <p className="subtitle">Professional templates for your legal needs</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for a template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filters">
        {["all", "contracts", "affidavits", "agreements"].map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon; // Get the correct icon component
          return (
            <div key={template.id} className="template-card">
              <div className="template-icon">
                <IconComponent /> {/* Render the icon properly */}
              </div>
              <div className="template-content">
                <h3>{template.title}</h3>
                <p>{template.description}</p>
                <button className="download-btn" onClick={() => handleDownload(template.id)}>
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
