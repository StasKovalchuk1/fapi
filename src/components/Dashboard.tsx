import React, {useEffect, useState} from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import {getLastMap, MapDTO} from "../api/maps";

const Dashboard: React.FC = () => {
    const [mapData, setMapData] = useState<MapDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        // Загрузка последней карты
        getLastMap()
            .then((data) => {
                setMapData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const renderZones = () => {
        if (!mapData?.zones) return null;
        return mapData.zones.map((zone) => {
            let points: { x: number; y: number }[] = [];
            try {
                const shapeObj = JSON.parse(zone.shape);
                points = shapeObj.points;
            } catch (e) {
                console.error("Error parsing zone shape", e);
            }
            return (
                <Box key={zone.id} sx={{ mt: 1, p: 1, border: '1px solid #ccc' }}>
                    <Typography variant="subtitle1">{zone.name}</Typography>
                    <Typography variant="body2">
                        Points: {points.map((p) => `(${p.x}, ${p.y})`).join(', ')}
                    </Typography>
                </Box>
            );
        });
    };

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4">Dashboard</Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
                {loading ? (
                    <Typography variant="body1">Loading map...</Typography>
                ) : mapData ? (
                    <>
                        {/*<Box sx={{ mt: 2 }}>*/}
                        {/*    /!* Если карта хранится как изображение (base64) *!/*/}
                        {/*    {mapData.mapFileBase64 ? (*/}
                        {/*        <img*/}
                        {/*            src={`data:image/png;base64,${mapData.mapFileBase64}`}*/}
                        {/*            alt="Map"*/}
                        {/*            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}*/}
                        {/*        />*/}
                        {/*    ) : (*/}
                        {/*        <Typography variant="body2">No image available for this map.</Typography>*/}
                        {/*    )}*/}
                        {/*</Box>*/}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h5">Zones</Typography>
                            {renderZones()}
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1">No map data available.</Typography>
                )}
            </Paper>
        </Container>
    );
};

export default Dashboard;