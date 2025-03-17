import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser, LoginRequest, LoginResponse } from '../../api/auth';
import {useAuth} from "./AuthContext";

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginRequest>({ username: '', password: '' });
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response: LoginResponse = await loginUser(formData);
            if (response.authToken) {
                auth.login(response.authToken);
                setMessage('Login successful!');
                navigate('/dashboard');
            } else {
                setMessage('Login failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Login
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

export default LoginPage;
