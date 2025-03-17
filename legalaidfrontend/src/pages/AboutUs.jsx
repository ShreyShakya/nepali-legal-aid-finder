import { FaLinkedin, FaEnvelope, FaUsers, FaBalanceScale, FaHandshake } from "react-icons/fa"
import "./AboutUS.css"

const teamMembers = [
  {
    id: 1,
    name: "Shrey Shakya",
    role: "Founder & CEO",
    bio: "Leading the vision to make legal services accessible to all Nepali citizens.",
    image: "/images/ngo.jpg",
    social: {
      linkedin: "#",
      email: "shrey@example.com",
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Legal Advisor",
    bio: "Expert in constitutional law with over 15 years of experience in legal consultation.",
    image: "/images/ngo.jpg",
    social: {
      linkedin: "#",
      email: "jane@example.com",
    },
  },
  {
    id: 3,
    name: "John Doe",
    role: "Community Outreach",
    bio: "Dedicated to building strong relationships between legal professionals and communities.",
    image: "/images/ngo.jpg",
    social: {
      linkedin: "#",
      email: "john@example.com",
    },
  },
]

const values = [
  {
    icon: <FaBalanceScale />,
    title: "Justice for All",
    description: "Making legal services accessible and affordable for every Nepali citizen.",
  },
  {
    icon: <FaUsers />,
    title: "Community First",
    description: "Building strong relationships between legal professionals and communities.",
  },
  {
    icon: <FaHandshake />,
    title: "Trust & Transparency",
    description: "Maintaining the highest standards of professional ethics and transparency.",
  },
]

export default function AboutUs() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Us</h1>
        <p>Learn more about our mission and team.</p>
      </header>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          We aim to make legal services in Nepal accessible and transparent for everyone, connecting those in need with
          trusted professionals and organizations. Through our platform, we strive to bridge the gap between legal
          expertise and public access, ensuring justice is within reach for all Nepali citizens.
        </p>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="member-image">
                <img src={member.image || "/placeholder.svg"} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <p className="member-bio">{member.bio}</p>
                <div className="member-social">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="social-link" aria-label="LinkedIn">
                      <FaLinkedin />
                    </a>
                  )}
                  {member.social.email && (
                    <a href={`mailto:${member.social.email}`} className="social-link" aria-label="Email">
                      <FaEnvelope />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
