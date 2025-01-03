import React, { useState } from 'react';
import './LandingPage.css'; 
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';

function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <header className="navbar">
                <div className="logo">
                    <a href="/">
                        <img src="/images/logo.png" alt="Legal Aid Finder Logo" />
                    </a>
                </div>
                <nav className="nav-links">
                    <a href="#" onClick={() => setShowLogin(true)}>Login</a>
                    <a href="#" onClick={() => setShowSignUp(true)}>Sign Up</a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Legal Support at Your Fingertips</h1>
                    <p>Find trusted legal aid in Nepal for all your needs.</p>
                    <div className="search-bar">
                        <input type="text" placeholder="What legal assistance are you looking for?" />
                        <button>Search</button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Why Choose Us?</h2>
                <div className="features-cards">
                    <div className="card">
                        <img src="/images/legalaid.jpg" alt="Legal Aid" />
                        <div className="card-content">
                            <h3>Find Legal Aid</h3>
                            <p>Connect with qualified lawyers and NGOs.</p>
                        </div>
                    </div>
                    <div className="card">
                        <img src="/images/ngo.jpg" alt="Pro Bono Support" />
                        <div className="card-content">
                            <h3>Pro Bono Support</h3>
                            <p>Get free legal assistance from NGOs.</p>
                        </div>
                    </div>
                    <div className="card">
                        <img src="/images/tracking.jpg" alt="Case Tracking" />
                        <div className="card-content">
                            <h3>Case Tracking</h3>
                            <p>Monitor your legal cases securely.</p>
                        </div>
                    </div>
                    <div className="card">
                        <img src="/images/templates.jpg" alt="Templates" />
                        <div className="card-content">
                            <h3>Templates</h3>
                            <p>Download customizable legal document templates.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <p>Let us guide you through the process of finding the right legal assistance.</p>
                <div className="how-it-works-cards">
                    <div className="how-card">
                        <h3>Describe Your Issue</h3>
                        <p>Help us understand your needs. Provide details about your legal concerns, and we’ll match you with the right assistance.</p>
                    </div>
                    <div className="how-card">
                        <h3>Explore Your Options</h3>
                        <p>Discover lawyers, or pro bono support. Compare the profiles and services of relevant legal aid providers.</p>
                    </div>
                    <div className="how-card">
                        <h3>Connect and Solve</h3>
                        <p>Collaborate with your chosen professional. Track your case and communicate directly for effective resolution.</p>
                    </div>
                </div>
            </section>

            {/* Login Modal */}
            {showLogin && (
                <div className="modal-overlay" onClick={() => setShowLogin(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <Login />
                    </div>
                </div>
            )}

            {/* Sign-Up Modal */}
            {showSignUp && (
                <div className="modal-overlay" onClick={() => setShowSignUp(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <SignUp />
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2025 Nepali Legal Aid Finder. All Rights Reserved.</p>
                    <div className="social-links">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
