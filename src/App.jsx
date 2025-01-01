import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import LandingPage from './pages/LandingPage'; // Updated path for LandingPage

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;
