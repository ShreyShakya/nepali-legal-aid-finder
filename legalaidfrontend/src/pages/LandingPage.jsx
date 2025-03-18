"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Scale,
  Users,
  Shield,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Calendar,
} from "lucide-react"
import styles from "./LandingPage.module.css"

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
  const [lawyerDropdownOpen, setLawyerDropdownOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const features = [
    {
      icon: <FileText className={styles.serviceIcon} />,
      title: "Case Tracking",
      description:
        "Real-time updates and comprehensive tracking for all your legal cases. Monitor progress, deadlines, and important documents in one place.",
      link: "#case-tracking",
    },
    {
      icon: <Users className={styles.serviceIcon} />,
      title: "Pro Bono & NGO Support",
      description:
        "Dedicated resources and specialized assistance for non-profits and those seeking pro bono legal representation.",
      link: "#pro-bono",
    },
    {
      icon: <FileText className={styles.serviceIcon} />,
      title: "Legal Document Templates",
      description:
        "Access a vast library of customizable legal templates for contracts, agreements, and other essential documents.",
      link: "#document-templates",
    },
    {
      icon: <Phone className={styles.serviceIcon} />,
      title: "Voice & Video Consultation",
      description:
        "Connect with legal experts remotely through secure voice and video calls for convenient legal advice from anywhere.",
      link: "#consultation",
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
      name: "Sabin Shrestha",
      specialty: "Corporate Law",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      experience: "15+ years experience",
    },
    {
      name: "Sujal Prajapati",
      specialty: "Family Law",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      experience: "12+ years experience",
    },
    {
      name: "Ratish Bajracharya",
      specialty: "Criminal Defense",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      experience: "20+ years experience",
    },
  ]

  const steps = [
    {
      icon: <Calendar className={styles.stepIcon} />,
      title: "Schedule a Consultation",
      description: "Book a free initial consultation with one of our expert attorneys to discuss your legal needs.",
    },
    {
      icon: <MessageSquare className={styles.stepIcon} />,
      title: "Discuss Your Case",
      description: "Meet with your attorney to review your situation in detail and explore potential legal strategies.",
    },
    {
      icon: <FileText className={styles.stepIcon} />,
      title: "Receive Custom Solution",
      description: "Get a tailored legal plan designed specifically for your unique situation and objectives.",
    },
    {
      icon: <Shield className={styles.stepIcon} />,
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
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} />
            <span>NepaliLegalAidFinder</span>
          </div>

          <div
            className={`${styles.mobileMenuButton} ${mobileMenuOpen ? styles.active : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`${styles.mainNav} ${mobileMenuOpen ? styles.open : ""}`}>
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

          <div className={styles.headerCta}>
            <div className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => setLawyerDropdownOpen(!lawyerDropdownOpen)}
                onBlur={() => setTimeout(() => setLawyerDropdownOpen(false), 100)}
              >
                For Lawyers
                <ChevronRight
                  className={`${styles.dropdownIcon} ${lawyerDropdownOpen ? styles.dropdownIconOpen : ""}`}
                />
              </button>
              {lawyerDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <a href="/register-lawyer">Register</a>
                  <a href="/lawyer-login">Login</a>
                </div>
              )}
            </div>
            <a href="/register" className={styles.contactButton}>
              Get Started
            </a>
          </div>
        </div>
      </header>

      <motion.section
        className={styles.hero}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContainer}>
          <motion.div className={styles.heroContent} variants={slideUp} transition={{ duration: 0.6 }}>
            <h1>Welcome to Your Trusted Legal Partner</h1>
            <p>Expert legal solutions tailored to your unique needs. Navigate complex legal matters with confidence.</p>

            <div className={styles.clientTabs}>
              <button
                className={activeTab === "individual" ? styles.active : ""}
                onClick={() => setActiveTab("individual")}
              >
                For Individuals
              </button>
              <button
                className={activeTab === "business" ? styles.active : ""}
                onClick={() => setActiveTab("business")}
              >
                For Businesses
              </button>
            </div>

            <motion.form
              onSubmit={handleSearch}
              className={styles.searchForm}
              variants={slideUp}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.searchInput}>
                <Search className={styles.searchIcon} />
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
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </motion.form>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="services"
        className={styles.services}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <motion.span className={styles.sectionSubtitle} variants={slideUp}>
              Platform Features
            </motion.span>
            <motion.h2 variants={slideUp}>Powerful Legal Technology</motion.h2>
            <motion.p variants={slideUp}>
              Our platform offers innovative tools and features designed to streamline your legal experience. From case
              management to remote consultations, we provide everything you need for effective legal support.
            </motion.p>
          </div>

          <motion.div className={styles.servicesGrid} variants={staggerChildren}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.serviceCard}
                variants={fadeIn}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className={styles.serviceIconWrapper}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                
              </motion.div>
            ))}
          </motion.div>

          <div className={styles.servicesCta}>
            <p>Want to explore more platform capabilities?</p>
            <a href="#contact" className={styles.secondaryButton}>
              Register Now
            </a>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="process"
        className={styles.process}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <motion.span className={styles.sectionSubtitle} variants={slideUp}>
              Simple Process
            </motion.span>
            <motion.h2 variants={slideUp}>How We Work With You</motion.h2>
            <motion.p variants={slideUp}>
              Our streamlined approach ensures you receive efficient and effective legal support.
            </motion.p>
          </div>

          <motion.div className={styles.processSteps} variants={staggerChildren}>
            {steps.map((step, index) => (
              <motion.div key={index} className={styles.processStep} variants={fadeIn}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepIconWrapper}>{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className={styles.processCta} variants={slideUp}>
            <a href="/register" className={styles.primaryButton}>
              Schedule Your Consultation
            </a>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="attorneys"
        className={styles.attorneys}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <motion.span className={styles.sectionSubtitle} variants={slideUp}>
              Expert Team
            </motion.span>
            <motion.h2 variants={slideUp}>Meet Our Attorneys</motion.h2>
            <motion.p variants={slideUp}>
              Our team of experienced attorneys is dedicated to providing exceptional legal representation.
            </motion.p>
          </div>

          <motion.div className={styles.attorneysGrid} variants={staggerChildren}>
            {attorneys.map((attorney, index) => (
              <motion.div
                key={index}
                className={styles.attorneyCard}
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={styles.attorneyImage}>
                  <img src={attorney.image || "/placeholder.svg"} alt={attorney.name} />
                </div>
                <div className={styles.attorneyInfo}>
                  <h3>{attorney.name}</h3>
                  <p className={styles.attorneySpecialty}>{attorney.specialty}</p>
                  <p className={styles.attorneyExperience}>{attorney.experience}</p>
                  <a href="#" className={styles.attorneyLink}>
                    View Profile
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className={styles.attorneysCta}>
            <a href="#" className={styles.secondaryButton}>
              View All Attorneys
            </a>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="testimonials"
        className={styles.testimonials}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <motion.span className={styles.sectionSubtitle} variants={slideUp}>
              Client Success
            </motion.span>
            <motion.h2 variants={slideUp}>What Our Clients Say</motion.h2>
            <motion.p variants={slideUp}>
              Don't just take our word for it. Hear from clients who have experienced our exceptional legal services.
            </motion.p>
          </div>

          <motion.div className={styles.testimonialsGrid} variants={staggerChildren}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={styles.testimonialCard}
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={styles.testimonialRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`${styles.starIcon} ${i < testimonial.rating ? styles.filled : ""}`}
                      size={16}
                    />
                  ))}
                </div>
                <p className={styles.testimonialText}>"{testimonial.text}"</p>
                <div className={styles.testimonialAuthor}>
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
        className={styles.contact}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.contactGrid}>
            <motion.div className={styles.contactInfo} variants={slideRight} style={{ width: "100%" }}>
              <span className={styles.sectionSubtitle}>Get In Touch</span>
              <h2>Contact Us Today</h2>
              <p>
                Ready to discuss your legal needs? Our team is here to help. Schedule a consultation or reach out with
                any questions.
              </p>

              <div className={styles.contactMethods}>
                <div className={styles.contactMethod}>
                  <Phone className={styles.contactIcon} />
                  <div>
                    <h4>Call Us</h4>
                    <p>(555) 123-4567</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <Mail className={styles.contactIcon} />
                  <div>
                    <h4>Email Us</h4>
                    <p>info@nlaf.com</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <MapPin className={styles.contactIcon} />
                  <div>
                    <h4>Visit Us</h4>
                    <p>
                      123 Street, 500
                      <br />
                      KTM, NEPAL 10001
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.officeHours}>
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
        className={styles.ctaSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div className={styles.ctaContent} variants={slideUp}>
          <h2>Ready to Resolve Your Legal Matters?</h2>
          <p>Take the first step towards expert legal representation and peace of mind.</p>
          <motion.div className={styles.ctaButtons} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href="/register" className={`${styles.ctaButton} ${styles.primary}`}>
              Schedule a Consultation
            </a>
            <a href="#services" className={`${styles.ctaButton} ${styles.secondary}`}>
              Explore Our Services
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div className={styles.footerAbout}>
              <div className={styles.footerLogo}>
                <Scale className={styles.logoIcon} />
                <span>Nepali Legal Aid Finder</span>
              </div>
              <p>
                Providing exceptional legal services with integrity and dedication. Your trusted partner for all legal
                matters.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.footerLinksColumn}>
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

              <div className={styles.footerLinksColumn}>
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

              <div className={styles.footerLinksColumn}>
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

          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} LegalEdge. All rights reserved.</p>
            <div className={styles.footerSocial}>
              <a href="#" aria-label="Facebook">
                <div className={`${styles.socialIcon} ${styles.facebook}`}></div>
              </a>
              <a href="#" aria-label="Twitter">
                <div className={`${styles.socialIcon} ${styles.twitter}`}></div>
              </a>
              <a href="#" aria-label="LinkedIn">
                <div className={`${styles.socialIcon} ${styles.linkedin}`}></div>
              </a>
              <a href="#" aria-label="Instagram">
                <div className={`${styles.socialIcon} ${styles.instagram}`}></div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

