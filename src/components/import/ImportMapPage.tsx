import React, { useState } from 'react';
import { Container, Paper, Typography, Button, Box, Input, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { importMap, MapDTO } from "../../api/maps";
import Header from '../layout/Header';
import ReportAnalysisDialog from '../analysis/ReportAnalysisDialog';

const MapImportPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [importedMap, setImportedMap] = useState<MapDTO | null>(null);
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setMessage('Map import failed. Please try again.');
        }
    };

    const handleAnalysisOpen = () => {
        setAnalysisDialogOpen(true);
    };

    const handleAnalysisClose = () => {
        setAnalysisDialogOpen(false);
    };

    return (
        <>
            <Header onReportAnalysisClick={handleAnalysisOpen} />
            <Container maxWidth={isMobile ? "sm" : "md"} sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Import Map
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        maxWidth: '500px',
                        mx: 'auto'
                    }}>
                        <Input type="file" onChange={handleFileChange} />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleImport}
                            size={isMobile ? "small" : "medium"}
                            fullWidth
                        >
                            Import Map
                        </Button>
                    </Box>
                    {message && (
                        <Typography 
                            variant="body1" 
                            align="center" 
                            color={message.includes('success') ? 'success.main' : 'error'} 
                            sx={{ mt: 2 }}
                        >
                            {message}
                        </Typography>
                    )}
                </Paper>
            </Container>
            
            <ReportAnalysisDialog
                open={analysisDialogOpen}
                onClose={handleAnalysisClose}
            />
        </>
    );
};

export default MapImportPage;
