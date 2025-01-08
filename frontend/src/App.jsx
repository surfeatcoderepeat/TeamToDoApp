import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLoginButton from './components/GoogleLoginButton';
import ProtectedPage from './components/ProtectedPage';
import Dashboard from './pages/Dashboard';
import JoinProject from './components/JoinProject.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GoogleLoginButton />} />
                <Route path="/dashboard" element={<ProtectedPage> <Dashboard /> </ProtectedPage>} />
                <Route path="/join-project/:token" element={<ProtectedPage> <JoinProject /> </ProtectedPage>} />
            </Routes>
        </Router>
    );
};

export default App; 