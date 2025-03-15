// src/components/ResetPasswordRequestPage.tsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { initiatePasswordReset } from '../api/auth';

const ResetPasswordRequestPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await initiatePasswordReset(email);
            setMessage('An email has been sent with password reset instructions.');
        } catch (error) {
            console.error(error);
            setMessage('Error sending reset email. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Reset Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Send reset instructions
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

export default ResetPasswordRequestPage;
