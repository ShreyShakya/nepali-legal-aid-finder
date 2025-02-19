"use client";

import React, { useState } from "react";
import {
  Search,
  Scale,
  Users,
  Shield,
  Clock,
  FileText,
  Search as SearchIcon,
  UserCheck,
  ArrowRight,
  LineChart,
} from "lucide-react";
import "./LandingPage.css";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const features = [
    {
      icon: <Scale className="feature-icon" />,
      title: "Expert Legal Support",
      description: "Access to qualified lawyers and legal professionals across Nepal",
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Community Focus",
      description: "Supporting local communities with accessible legal services",
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Trusted Platform",
      description: "Verified professionals and secure communication channels",
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "Quick Response",
      description: "24/7 platform access with prompt professional responses",
    },
    {
      icon: <LineChart className="feature-icon" />,
      title: "Case Tracking",
      description: "Monitor your legal cases securely through our platform",
    },
    {
      icon: <FileText className="feature-icon" />,
      title: "Legal Templates",
      description: "Access and download professional legal document templates",
    },
  ];

  const steps = [
    {
      icon: <FileText className="step-icon" />,
      title: "Describe Your Issue",
      description:
        "Help us understand your needs. Provide details about your legal concerns, and we'll match you with the right assistance.",
    },
    {
      icon: <SearchIcon className="step-icon" />,
      title: "Explore Your Options",
      description:
        "Discover lawyers, or pro bono support. Compare the profiles and services of relevant legal aid providers.",
    },
    {
      icon: <UserCheck className="step-icon" />,
      title: "Connect and Solve",
      description:
        "Collaborate with your chosen professional. Track your case and communicate directly for effective resolution.",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Legal Support at Your Fingertips</h1>
          <p>Find trusted legal aid in Nepal for all your needs.</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="What legal assistance are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit">Search</button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Legal Professionals</span>
            </div>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Cases Resolved</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Districts Covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p className="section-subtitle">Let us guide you through the process of finding the right legal assistance.</p>

        <div className="steps">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                {step.icon}
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && <ArrowRight className="step-arrow" />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Take the first step towards resolving your legal matters.</p>
          <button className="cta-button">Find Legal Help Now</button>
        </div>
      </section>
    </div>
  );
}
