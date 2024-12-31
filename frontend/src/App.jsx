import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLoginButton from './components/GoogleLoginButton';
import Projects from './pages/Projects';
import ProtectedPage from './components/ProtectedPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GoogleLoginButton />} />
                <Route path="/projects" element={<ProtectedPage> <Projects /> </ProtectedPage>} />
            </Routes>
        </Router>
    );
};

export default App; 