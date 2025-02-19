import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import "./footer.css";

export default function Footer({
  socialLinks = [
    { href: "https://facebook.com", icon: <FaFacebook />, label: "Facebook" },
    { href: "https://twitter.com", icon: <FaTwitter />, label: "Twitter" },
    { href: "https://linkedin.com", icon: <FaLinkedin />, label: "LinkedIn" },
  ],
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="copyright">© {currentYear} Nepali Legal Aid Finder. All rights reserved.</p>

          <div className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
