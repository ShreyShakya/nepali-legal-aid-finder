"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Scale,
  Users,
  Shield,
  FileText,
  Briefcase,
  Award,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Calendar,
} from "lucide-react"
import "./LandingPage.css"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

const slideRight = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
}

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("individual")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const services = [
    {
      icon: <Briefcase className="service-icon" />,
      title: "Corporate Law",
      description: "Expert guidance on business formation, contracts, and compliance matters.",
      link: "#corporate-law",
    },
    {
      icon: <Users className="service-icon" />,
      title: "Family Law",
      description: "Compassionate support for divorce, custody, and other family legal matters.",
      link: "#family-law",
    },
    {
      icon: <Shield className="service-icon" />,
      title: "Criminal Defense",
      description: "Strong representation for those facing criminal charges or investigations.",
      link: "#criminal-defense",
    },
    {
      icon: <Award className="service-icon" />,
      title: "Intellectual Property",
      description: "Protection for your creative works, inventions, and business identity.",
      link: "#intellectual-property",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "Small Business Owner",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "The legal guidance I received was exceptional. They helped me navigate complex business regulations with ease and confidence.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      position: "Tech Entrepreneur",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "Their expertise in intellectual property law saved my startup from potential disaster. Highly recommended for any business owner.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      position: "Family Client",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      text: "During a difficult divorce, they provided not just legal expertise but genuine compassion. I couldn't have asked for better representation.",
      rating: 4,
    },
  ]

  const attorneys = [
    {
      name: "David Wilson",
      specialty: "Corporate Law",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      experience: "15+ years experience",
    },
    {
      name: "Jennifer Lopez",
      specialty: "Family Law",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      experience: "12+ years experience",
    },
    {
      name: "Robert Chen",
      specialty: "Criminal Defense",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      experience: "20+ years experience",
    },
  ]

  const steps = [
    {
      icon: <Calendar className="step-icon" />,
      title: "Schedule a Consultation",
      description: "Book a free initial consultation with one of our expert attorneys to discuss your legal needs.",
    },
    {
      icon: <MessageSquare className="step-icon" />,
      title: "Discuss Your Case",
      description: "Meet with your attorney to review your situation in detail and explore potential legal strategies.",
    },
    {
      icon: <FileText className="step-icon" />,
      title: "Receive Custom Solution",
      description: "Get a tailored legal plan designed specifically for your unique situation and objectives.",
    },
    {
      icon: <Shield className="step-icon" />,
      title: "Ongoing Support",
      description: "Benefit from continuous legal guidance and representation throughout your case.",
    },
  ]

  const faqItems = [
    {
      question: "How do your legal fees work?",
      answer:
        "We offer various fee structures including hourly rates, flat fees for specific services, and contingency arrangements for certain cases. During your initial consultation, we'll discuss the most appropriate option for your specific situation.",
    },
    {
      question: "How long will my case take?",
      answer:
        "The timeline varies significantly depending on the nature and complexity of your case. Simple matters may resolve in weeks, while complex litigation can take months or years. Your attorney will provide a realistic timeline based on your specific circumstances.",
    },
    {
      question: "Do you offer virtual consultations?",
      answer:
        "Yes, we provide virtual consultations via secure video conferencing for clients who prefer remote meetings or are unable to visit our offices in person.",
    },
    {
      question: "What areas of law do you practice?",
      answer:
        "Our firm specializes in corporate law, family law, criminal defense, intellectual property, real estate, and estate planning. Our diverse team of attorneys brings expertise across these practice areas to serve your comprehensive legal needs.",
    },
  ]

  return (
    <div className="landing-page">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Scale className="logo-icon" />
            <span>NepaliLegalAidFinder</span>
          </div>

          <div
            className={`mobile-menu-button ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`main-nav ${mobileMenuOpen ? "open" : ""}`}>
            <ul>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#attorneys">Attorneys</a>
              </li>
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>

          <div className="header-cta">
            <a href="/register" className="contact-button">
              Get Started
            </a>
          </div>
        </div>
      </header>

      <motion.section className="hero" initial="hidden" animate={isVisible ? "visible" : "hidden"} variants={fadeIn}>
        <div className="hero-background"></div>
        <div className="hero-container">
          <motion.div className="hero-content" variants={slideUp} transition={{ duration: 0.6 }}>
            <h1>Welcome to Your Trusted Legal Partner</h1>
            <p>Expert legal solutions tailored to your unique needs. Navigate complex legal matters with confidence.</p>

            <div className="client-tabs">
              <button className={activeTab === "individual" ? "active" : ""} onClick={() => setActiveTab("individual")}>
                For Individuals
              </button>
              <button className={activeTab === "business" ? "active" : ""} onClick={() => setActiveTab("business")}>
                For Businesses
              </button>
            </div>

            <motion.form onSubmit={handleSearch} className="search-form" variants={slideUp} transition={{ delay: 0.2 }}>
              <div className="search-input">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "individual"
                      ? "What legal assistance do you need?"
                      : "What business legal services are you looking for?"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="search-button">
                Find Solutions
              </button>
            </motion.form>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="services"
        className="services"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-subtitle" variants={slideUp}>
              Our Expertise
            </motion.span>
            <motion.h2 variants={slideUp}>Comprehensive Legal Services</motion.h2>
            <motion.p variants={slideUp}>
              We offer a wide range of legal services to meet your personal and business needs. Our experienced
              attorneys are dedicated to providing exceptional representation.
            </motion.p>
          </div>

          <motion.div className="services-grid" variants={staggerChildren}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                variants={fadeIn}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="service-icon-wrapper">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href={service.link} className="service-link">
                  Learn More <ChevronRight className="link-icon" />
                </a>
              </motion.div>
            ))}
          </motion.div>

          <div className="services-cta">
            <p>Looking for a different legal service?</p>
            <a href="#contact" className="secondary-button">
              View All Services
            </a>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="process"
        className="process"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-subtitle" variants={slideUp}>
              Simple Process
            </motion.span>
            <motion.h2 variants={slideUp}>How We Work With You</motion.h2>
            <motion.p variants={slideUp}>
              Our streamlined approach ensures you receive efficient and effective legal support.
            </motion.p>
          </div>

          <motion.div className="process-steps" variants={staggerChildren}>
            {steps.map((step, index) => (
              <motion.div key={index} className="process-step" variants={fadeIn}>
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <div className="step-icon-wrapper">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <motion.div
                    className="step-connector"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="process-cta" variants={slideUp}>
            <a href="#contact" className="primary-button">
              Schedule Your Consultation
            </a>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="attorneys"
        className="attorneys"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-subtitle" variants={slideUp}>
              Expert Team
            </motion.span>
            <motion.h2 variants={slideUp}>Meet Our Attorneys</motion.h2>
            <motion.p variants={slideUp}>
              Our team of experienced attorneys is dedicated to providing exceptional legal representation.
            </motion.p>
          </div>

          <motion.div className="attorneys-grid" variants={staggerChildren}>
            {attorneys.map((attorney, index) => (
              <motion.div
                key={index}
                className="attorney-card"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="attorney-image">
                  <img src={attorney.image || "/placeholder.svg"} alt={attorney.name} />
                </div>
                <div className="attorney-info">
                  <h3>{attorney.name}</h3>
                  <p className="attorney-specialty">{attorney.specialty}</p>
                  <p className="attorney-experience">{attorney.experience}</p>
                  <a href="#" className="attorney-link">
                    View Profile
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="attorneys-cta">
            <a href="#" className="secondary-button">
              View All Attorneys
            </a>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="testimonials"
        className="testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-subtitle" variants={slideUp}>
              Client Success
            </motion.span>
            <motion.h2 variants={slideUp}>What Our Clients Say</motion.h2>
            <motion.p variants={slideUp}>
              Don't just take our word for it. Hear from clients who have experienced our exceptional legal services.
            </motion.p>
          </div>

          <motion.div className="testimonials-grid" variants={staggerChildren}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`star-icon ${i < testimonial.rating ? "filled" : ""}`} size={16} />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="section-container">
          <div className="contact-grid">
            <motion.div className="contact-info" variants={slideRight} style={{ width: "100%" }}>
              <span className="section-subtitle">Get In Touch</span>
              <h2>Contact Us Today</h2>
              <p>
                Ready to discuss your legal needs? Our team is here to help. Schedule a consultation or reach out with
                any questions.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <Phone className="contact-icon" />
                  <div>
                    <h4>Call Us</h4>
                    <p>(555) 123-4567</p>
                  </div>
                </div>

                <div className="contact-method">
                  <Mail className="contact-icon" />
                  <div>
                    <h4>Email Us</h4>
                    <p>info@legaledge.com</p>
                  </div>
                </div>

                <div className="contact-method">
                  <MapPin className="contact-icon" />
                  <div>
                    <h4>Visit Us</h4>
                    <p>
                      123 Legal Street, Suite 500
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              <div className="office-hours">
                <h4>Office Hours</h4>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 2:00 PM
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div className="cta-content" variants={slideUp}>
          <h2>Ready to Resolve Your Legal Matters?</h2>
          <p>Take the first step towards expert legal representation and peace of mind.</p>
          <motion.div className="cta-buttons" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href="#contact" className="cta-button primary">
              Schedule a Consultation
            </a>
            <a href="#services" className="cta-button secondary">
              Explore Our Services
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-about">
              <div className="footer-logo">
                <Scale className="logo-icon" />
                <span>LegalEdge</span>
              </div>
              <p>
                Providing exceptional legal services with integrity and dedication. Your trusted partner for all legal
                matters.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Services</h4>
                <ul>
                  <li>
                    <a href="#">Corporate Law</a>
                  </li>
                  <li>
                    <a href="#">Family Law</a>
                  </li>
                  <li>
                    <a href="#">Criminal Defense</a>
                  </li>
                  <li>
                    <a href="#">Intellectual Property</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Our Attorneys</a>
                  </li>
                  <li>
                    <a href="#">Testimonials</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                  <li>
                    <a href="#">Legal Resources</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} LegalEdge. All rights reserved.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <div className="social-icon facebook"></div>
              </a>
              <a href="#" aria-label="Twitter">
                <div className="social-icon twitter"></div>
              </a>
              <a href="#" aria-label="LinkedIn">
                <div className="social-icon linkedin"></div>
              </a>
              <a href="#" aria-label="Instagram">
                <div className="social-icon instagram"></div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

