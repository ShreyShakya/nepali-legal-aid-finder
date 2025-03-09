import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Updated path for LandingPage
import CaseTrackingPage from './pages/CaseTrackingPage';
import LawyersPage from './pages/LawyersPage';
import Dashboard from './pages/Dashboard'; // Import the Dashboard component
import DocumentTemplates from './pages/DocumentTemplates'; 
import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import LawFirmProfile from './pages/LawFirmProfile';
import Registration from './components/Auth/Registration';
import Login from './components/Auth/Login';

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Case Tracking Page */}
                <Route path="/case-tracking" element={<CaseTrackingPage />} />

                {/* Lawyers Page */}
                <Route path="/lawyers" element={<LawyersPage />} />

                <Route path="/dashboard" element={<Dashboard />} /> {/* New Dashboard route */}

                <Route path="/templates" element={<DocumentTemplates />} /> 

                <Route path="/faq" element={<FAQ />} /> 

                <Route path="/about" element={<AboutUs />} />

                <Route path="/lawfirmprofile" element={<LawFirmProfile />} />

                <Route path="/register" element={<Registration />} />

                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
}

export default App;
