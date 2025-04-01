import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Updated path for LandingPage
import LawyersPage from './pages/LawyersPage';
import LawyerDashboard from './pages/LawyerDashboard';
import LawyerRegistration from './components/Auth/LawyerRegistration';
import LawyerLogin from './components/Auth/LawyerLogin';
import ClientRegistration from './components/Auth/ClientRegistration';
import ClientLogin from './components/Auth/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import BrowseLawyers from './pages/BrowseLawyers';
import LawyerProfile from './components/Auth/LawyerProfile';
import CaseDetails from './pages/CaseDetails';
import ClientCaseDetails from './pages/ClientCaseDetails'; // Import the new ClientCaseDetails component
import DocumentTemplatesPage from './pages/DocumentTemplatesPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Lawyers Page */}
                <Route path="/lawyers" element={<LawyersPage />} />

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
                <Route path="/lawyer-profile" element={<LawyerProfile />} />
                <Route path="/case-details/:caseId" element={<CaseDetails />} />

                {/* Add the new route for ClientCaseDetails */}
                <Route path="/client-case/:caseId" element={<ClientCaseDetails />} />

                <Route path="/document-templates" element={<DocumentTemplatesPage />} />
            </Routes>
        </Router>
    );
}

export default App;