import React, { useEffect, useRef, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    List,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLastMap, MapDTO } from '../api/maps';
import ProductSearchBar from './ProductSearchBar';
import { getProductDetails, ProductSearchDTO, ProductDetailsDTO } from '../api/inventory';
import {useAuth} from "./auth/AuthContext";
import ProductDetailsModal from "./modal/ProductDetailsModalWindow";

const Dashboard: React.FC = () => {
    const [mapData, setMapData] = useState<MapDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProductDetails, setSelectedProductDetails] = useState<ProductDetailsDTO[]>([]);
    const [detailProduct, setDetailProduct] = useState<ProductDetailsDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        getLastMap()
            .then((data) => {
                setMapData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading map:', err);
                setLoading(false);
            });
    }, []);


    const handleProductsSelected = async (products: ProductSearchDTO[]) => {
        const limited = products.slice(0, 10);
        try {
            const detailsArr: ProductDetailsDTO[] = await Promise.all(
                limited.map((prod) => getProductDetails(prod.inventoryId))
            );
            setSelectedProductDetails(detailsArr);
        } catch (error) {
            console.error('Error loading product details:', error);
        }
    };

    useEffect(() => {
        if (mapData && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = Number(mapData.width);
            canvas.height = Number(mapData.height);
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
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
                            ctx.fillStyle = 'rgba(0, 128, 255, 0.3)';
                            ctx.fill();
                            ctx.strokeStyle = 'blue';
                            ctx.stroke();
                        }
                    } catch (e) {
                        console.error('Error parsing zone shape', e);
                    }
                });
                selectedProductDetails.forEach(product => {
                    const { coordinateX, coordinateY } = product.coordinates;
                    ctx.beginPath();
                    ctx.arc(coordinateX, coordinateY, 8, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    ctx.strokeStyle = 'darkred';
                    ctx.stroke();
                    ctx.font = '12px Arial';
                    ctx.fillStyle = 'black';
                    ctx.fillText(`${product.inventoryId} - ${product.productName}`, coordinateX + 10, coordinateY);
                });
            }
        }
    }, [mapData, selectedProductDetails]);

    const handleProductClick = (inventoryId: number) => {
        const product = selectedProductDetails.find(p => p.inventoryId === inventoryId);
        if (product) {
            setDetailProduct(product);
            setModalOpen(true);
        }
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
                <Box sx={{ mt: 2 }}>
                    <ProductSearchBar onProductsSelected={handleProductsSelected} maxSelection={10} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5">Selected Products</Typography>
                    {selectedProductDetails.length === 0 ? (
                        <Typography>No products selected</Typography>
                    ) : (
                        <List>
                            {selectedProductDetails.map(product => (
                                <ListItemButton key={product.inventoryId} onClick={() => handleProductClick(product.inventoryId)}>
                                    <ListItemText primary={`${product.inventoryId} - ${product.productName}`} />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </Box>
                <Box sx={{ mt: 2 }}>
                    <canvas
                        ref={canvasRef}
                        style={{ border: '1px solid #ccc', width: '100%', height: 'auto' }}
                    />
                </Box>
            </Paper>
            <ProductDetailsModal
                product={detailProduct}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </Container>
    );
};

export default Dashboard;