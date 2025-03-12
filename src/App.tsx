import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import { ConfirmEmail } from './components/ConfirmEmail';

const Dashboard: React.FC = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Dashboard</h2>
        <p>Welcome to your dashboard.</p>
    </div>
);

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;