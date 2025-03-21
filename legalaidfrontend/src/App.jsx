import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Updated path for LandingPage
import CaseTrackingPage from './pages/CaseTrackingPage';
import LawyersPage from './pages/LawyersPage';
import Dashboard from './pages/Dashboard'; // Import the Dashboard component
import DocumentTemplates from './pages/DocumentTemplates'; 
import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import LawFirmProfile from './pages/LawFirmProfile';
import LawyerDashboard from './pages/LawyerDashboard';
import LawyerRegistration from './components/Auth/LawyerRegistration';
import LawyerLogin from './components/Auth/LawyerLogin';
import ClientRegistration from './components/Auth/ClientRegistration';
import ClientLogin from './components/Auth/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import BrowseLawyers from './pages/BrowseLawyers';
import LawyerProfile from './components/Auth/LawyerProfile';

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

                    {/* Dashboard (Protected Route) */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Document Templates */}
                    <Route path="/templates" element={<DocumentTemplates />} /> 

                    {/* FAQ */}
                    <Route path="/faq" element={<FAQ />} /> 

                    {/* About Us */}
                    <Route path="/about" element={<AboutUs />} />

                    {/* Law Firm Profile */}
                    <Route path="/lawfirmprofile" element={<LawFirmProfile />} />

                    {/* Lawyer Dashboard */}
                    <Route path="/lawyerdashboard" element={<LawyerDashboard />} />

                    {/* Lawyer Registration */}
                    <Route path="/register-lawyer" element={<LawyerRegistration />} />

                    {/* Lawyer Login */}
                    <Route path="/lawyer-login" element={<LawyerLogin />} />

                    <Route path="/client-registration" element={<ClientRegistration />} />

                    <Route path='/client-login' element={<ClientLogin />} />

                    <Route path="/client-dashboard" element={<ClientDashboard />} />

                    <Route path="/lawyer-profile/:id" element={<LawyerProfile />} />
                    <Route path="/browse-lawyers" element={<BrowseLawyers />} />
                    <Route path="lawyer-profile" element={<LawyerProfile />} />
                </Routes>
            </Router>
    );
}

export default App;