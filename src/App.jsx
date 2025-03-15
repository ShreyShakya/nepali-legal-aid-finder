import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import UserProvider
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
import LawyerDashboard from './pages/LawyerDashboard';

function App() {
    return (
        <UserProvider>
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

                    {/* Registration */}
                    <Route path="/register" element={<Registration />} />

                    {/* Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Lawyer Dashboard (Protected Route) */}
                    <Route path="/lawyerdashboard" element={<LawyerDashboard />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;