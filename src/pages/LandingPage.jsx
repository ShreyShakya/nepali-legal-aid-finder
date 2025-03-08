import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      description: "Help us understand your needs. Provide details about your legal concerns, and we'll match you with the right assistance.",
    },
    {
      icon: <SearchIcon className="step-icon" />,
      title: "Explore Your Options",
      description: "Discover lawyers, or pro bono support. Compare the profiles and services of relevant legal aid providers.",
    },
    {
      icon: <UserCheck className="step-icon" />,
      title: "Connect and Solve",
      description: "Collaborate with your chosen professional. Track your case and communicate directly for effective resolution.",
    },
  ];

  return (
    <div className="landing-page">
      <motion.section 
        className="hero"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div 
          className="hero-content"
          variants={slideUp}
          transition={{ duration: 0.6 }}
        >
          <h1>Legal Support at Your Fingertips</h1>
          <p>Find trusted legal aid in Nepal for all your needs.</p>

          <motion.form 
            onSubmit={handleSearch} 
            className="search-form"
            variants={slideUp}
            transition={{ delay: 0.2 }}
          >
            <div className="search-input">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="What legal assistance are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </motion.form>

          <motion.div 
            className="hero-stats"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {[
              { number: "500+", label: "Legal Professionals" },
              { number: "1000+", label: "Cases Resolved" },
              { number: "50+", label: "Districts Covered" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat"
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
              >
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section 
        className="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.h2 variants={slideUp}>Why Choose Us?</motion.h2>
        <motion.div 
          className="features-grid"
          variants={staggerChildren}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section 
        className="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.h2 variants={slideUp}>How It Works</motion.h2>
        <motion.p 
          className="section-subtitle"
          variants={slideUp}
        >
          Let us guide you through the process of finding the right legal assistance.
        </motion.p>

        <motion.div 
          className="steps"
          variants={staggerChildren}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-card"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                {step.icon}
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <motion.div 
                  className="step-arrow"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ArrowRight />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section 
        className="cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div 
          className="cta-content"
          variants={slideUp}
        >
          <h2>Ready to Get Started?</h2>
          <p>Take the first step towards resolving your legal matters.</p>
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Find Legal Help Now
          </motion.button>
        </motion.div>
      </motion.section>
    </div>
  );
}