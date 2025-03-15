import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import { ConfirmEmail } from './components/ConfirmEmail';
import ResetPasswordRequestPage from './components/ResetPasswordRequestPage';
import ResetPasswordPage from './components/ResetPasswordPage';

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
                <Route path="/reset-password-request" element={<ResetPasswordRequestPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;