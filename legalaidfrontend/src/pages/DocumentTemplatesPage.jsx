import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Scale } from "lucide-react";
import styles from "./LandingPage.module.css";
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function DocumentTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/client-login";
      return;
    }
    setIsVisible(true);
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/api/document-templates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTemplates(response.data.templates);
    } catch (err) {
      setError("Failed to load document templates. Please try again later.");
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl, filename) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to download templates.");
        window.location.href = "/client-login";
        return;
      }
      const response = await axios.get(`http://127.0.0.1:5000${downloadUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "Template file not found."
          : "Failed to download the template. Please try again."
      );
      console.error("Error downloading template:", err);
    }
  };

  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} />
            <span>NepaliLegalAidFinder</span>
          </div>
          <nav className={styles.mainNav}>
            <ul>
              <li>
                <a href="/browse-lawyers">Browse Lawyers</a>
              </li>
              <li>
                <a href="/document-templates">Document Templates</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
          <div className={styles.headerButtonGroup}>
            <a href="/client-login" className={styles.ctaButton}>
              Get Started
            </a>
          </div>
        </div>
      </header>

      <motion.section
        className={styles.features}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <motion.span className={styles.sectionTag} variants={slideUp}>
              Resources
            </motion.span>
            <motion.h2 variants={slideUp}>Document Templates</motion.h2>
            <motion.p variants={slideUp}>
              Access a variety of legal document templates to assist with your case preparation. Download and customize them as needed.
            </motion.p>
          </div>

          <div className={styles.featuresGrid}>
            {loading ? (
              <motion.p variants={slideUp}>Loading templates...</motion.p>
            ) : error ? (
              <motion.div
                className={styles.errorMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {error}
              </motion.div>
            ) : templates.length > 0 ? (
              templates.map((template, index) => (
                <motion.div
                  key={index}
                  className={styles.featureCard}
                  variants={slideUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <FileText className={styles.featureIcon} />
                  <h3>{template.filename}</h3>
                  <p>Download this template to get started with your legal documentation.</p>
                  <button
                    className={styles.ctaButton}
                    onClick={() => handleDownload(template.download_url, template.filename)}
                  >
                    <Download className={styles.buttonIcon} />
                    Download
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.p variants={slideUp}>
                No templates available at the moment.
              </motion.p>
            )}
          </div>
        </div>
      </motion.section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <Scale className={styles.logoIcon} />
              <span>NepaliLegalAidFinder</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="/about">About Us</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <p>© 2025 NepaliLegalAidFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}