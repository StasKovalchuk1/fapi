import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import { ConfirmEmail } from './components/ConfirmEmail';
import Dashboard from "./components/Dashboard";
import {ProtectedRoute} from "./components/ProtectedRule";
import { AuthProvider } from './components/AuthContext';
import ResetPasswordRequestPage from "./components/ResetPasswordRequestPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/confirm-email" element={<ConfirmEmail />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/reset-password-request" element={<ResetPasswordRequestPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;