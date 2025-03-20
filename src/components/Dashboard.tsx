import React, {useEffect, useRef, useState} from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import {getLastMap, MapDTO} from "../api/maps";

const Dashboard: React.FC = () => {
    const [mapData, setMapData] = useState<MapDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

    useEffect(() => {
        // Если карта загружена и canvas существует, отрисовываем карту
        if (mapData && canvasRef.current) {
            const canvas = canvasRef.current;
            // Устанавливаем размеры canvas согласно данным карты
            canvas.width = Number(mapData.width);
            canvas.height = Number(mapData.height);
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Очищаем canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Отрисовываем фон карты (например, просто рамку)
                ctx.strokeStyle = 'black';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                // Отрисовываем зоны
                mapData.zones?.forEach(zone => {
                    try {
                        const shapeObj = JSON.parse(zone.shape);
                        const points: { x: number; y: number }[] = shapeObj.points;
                        if (points && points.length > 0) {
                            ctx.beginPath();
                            ctx.moveTo(points[0].x, points[0].y);
                            for (let i = 1; i < points.length; i++) {
                                ctx.lineTo(points[i].x, points[i].y);
                            }
                            ctx.closePath();
                            ctx.fillStyle = 'rgba(0, 128, 255, 0.3)'; // Полупрозрачное заполнение
                            ctx.fill();
                            ctx.strokeStyle = 'blue';
                            ctx.stroke();
                        }
                    } catch (e) {
                        console.error('Error parsing zone shape', e);
                    }
                });
            }
        }
    }, [mapData]);

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h4">Dashboard</Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
                {loading ? (
                    <Typography variant="body1">Loading map...</Typography>
                ) : mapData ? (
                    <>
                        <Box sx={{ mt: 2 }}>
                            <canvas
                                ref={canvasRef}
                                style={{
                                    border: '1px solid #ccc',
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h5">Zones</Typography>
                            {mapData.zones?.map(zone => (
                                <Box key={zone.id} sx={{ mt: 1, p: 1, border: '1px solid #ccc' }}>
                                    <Typography variant="subtitle1">{zone.name}</Typography>
                                </Box>
                            ))}
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