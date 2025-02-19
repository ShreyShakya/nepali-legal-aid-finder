// components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Correct import for React app
import { Atom } from "lucide-react";
import "./Header.css";

export default function Header({
  navLinks = [
    { href: "/", label: "Home" },
    { href: "/contact", label: "Contact" },
  ],
}) {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <Atom className="logo-icon" />
          <span className="logo-text">Nepali Legal Aid Finder</span>
        </Link>

        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
