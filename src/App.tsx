import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import RegistrationPage from './components/auth/RegistrationPage';
import LoginPage from './components/auth/LoginPage';
import { ConfirmEmail } from './components/auth/ConfirmEmail';
import Dashboard from "./components/Dashboard";
import {ProtectedRoute} from "./components/auth/ProtectedRule";
import { AuthProvider } from './components/auth/AuthContext';
import ResetPasswordRequestPage from "./components/auth/ResetPasswordRequestPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import MapImportPage from "./components/import/ImportMapPage";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/confirm-email" element={<ConfirmEmail />} />
                    <Route path="/map-import" element={<MapImportPage />} />
                    <Route path="/reset-password-request" element={<ResetPasswordRequestPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;