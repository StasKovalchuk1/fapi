import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { registerUser, Role, RegisterRequest } from '../../api/auth';

const RegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
        username: '',
        name: '',
        lastName: '',
        role: Role.EMPLOYEE
    });
    const [message, setMessage] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            setMessage('Registration successful! Please check your email to confirm your account.');
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required />
                    <TextField label="First Name" name="name" value={formData.name} onChange={handleChange} required />
                    <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    <Button variant="contained" color="primary" type="submit">
                        Register
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

export default RegistrationPage;