import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface ConfirmResponse {
    message: string;
}

export function ConfirmEmail() {
    const [message, setMessage] = useState<string>("Verifying...");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (token) {
            axios
                .get<ConfirmResponse>(`http://localhost:8080/tracking-service/api/users/confirm-email?token=${token}`)
                .then(response => {
                    setMessage(response.data.message);
                    // Если подтверждение прошло успешно, через 3 сек переходим на логин.
                    if (response.data.message === "Email successfully confirmed") {
                        setTimeout(() => navigate("/login"), 3000);
                    }
                })
                .catch(error => {
                    console.error(error);
                    setMessage("Error during email verification.");
                });
        } else {
            setMessage("Token is missing.");
        }
    }, [token, navigate]);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Email Verification</h2>
            <p>{message}</p>
        </div>
    );
}