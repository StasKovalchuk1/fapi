import React, { useState } from 'react';
import { Container, Paper, Typography, Button, Box, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {importMap, MapDTO} from "../../api/maps";

const MapImportPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [importedMap, setImportedMap] = useState<MapDTO | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            setMessage('Please select a file.');
            return;
        }
        try {
            const mapData = await importMap(selectedFile);
            setImportedMap(mapData);
            setMessage('Map imported successfully!');
            // Перенаправить или обновить состояние дашборда по необходимости
            // Например, можно сразу перейти на Dashboard:
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setMessage('Map import failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Import Map
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Input type="file" onChange={handleFileChange} />
                    <Button variant="contained" color="primary" onClick={handleImport}>
                        Import Map
                    </Button>
                </Box>
                {message && (
                    <Typography variant="body1" align="center" color="error" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default MapImportPage;
