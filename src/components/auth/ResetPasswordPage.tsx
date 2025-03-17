// src/components/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../../api/auth';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Извлекаем токен из URL
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setMessage('Invalid or missing token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setMessage('No token provided.');
            return;
        }
        try {
            await confirmPasswordReset(token, newPassword);
            setMessage('Password has been reset successfully. You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Error resetting password. The token may be invalid or expired.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Set New Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Reset Password
                    </Button>
                </Box>
                {message && (
                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default ResetPasswordPage;
