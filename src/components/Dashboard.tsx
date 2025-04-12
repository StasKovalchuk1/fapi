import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    List,
    ListItemButton,
    ListItemText,
    Switch,
    FormControlLabel,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { getLastMap, MapDTO } from '../api/maps';
import ProductSearchBar from './ProductSearchBar';
import { getProductDetails, ProductSearchDTO, ProductDetailsDTO } from '../api/inventory';
import ProductDetailsModal from "./modal/ProductDetailsModalWindow";
import Header from './layout/Header';
import MapViewer from './map/MapViewer';
import ReportAnalysisDialog from './analysis/ReportAnalysisDialog';

const Dashboard: React.FC = () => {
    const [mapData, setMapData] = useState<MapDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProductDetails, setSelectedProductDetails] = useState<ProductDetailsDTO[]>([]);
    const [detailProduct, setDetailProduct] = useState<ProductDetailsDTO | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [showHeatMap, setShowHeatMap] = useState<boolean>(false);
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.down('md'));

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
            const detailsArr = await Promise.all(
                limited.map((prod) => getProductDetails(prod.inventoryId))
            );
            setSelectedProductDetails(detailsArr);
        } catch (error) {
            console.error('Error loading product details:', error);
        }
    };

    const handleProductClick = (inventoryId: number) => {
        const product = selectedProductDetails.find(p => p.inventoryId === inventoryId);
        if (product) {
            setDetailProduct(product);
            setModalOpen(true);
        }
    };

    const handleToggleHeatMap = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowHeatMap(event.target.checked);
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
            <Container maxWidth={isMobile ? "sm" : isMedium ? "md" : "lg"} sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>Dashboard</Typography>
                    
                    <Box sx={{ mt: 2 }}>
                        <ProductSearchBar onProductsSelected={handleProductsSelected} maxSelection={10} />
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        mt: 3,
                        gap: 2
                    }}>
                        <Box sx={{ 
                            width: isMobile ? '100%' : '30%',
                            minWidth: isMobile ? 'auto' : '250px'
                        }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>Selected Products</Typography>
                            <FormControlLabel
                                control={<Switch checked={showHeatMap} onChange={handleToggleHeatMap} />}
                                label="Show Heat Map"
                                sx={{ mb: 2 }}
                            />
                            {selectedProductDetails.length === 0 ? (
                                <Typography>No products selected</Typography>
                            ) : (
                                <List sx={{ 
                                    maxHeight: '400px', 
                                    overflow: 'auto',
                                    border: '1px solid #eee',
                                    borderRadius: '4px'
                                }}>
                                    {selectedProductDetails.map(product => (
                                        <ListItemButton 
                                            key={product.inventoryId} 
                                            onClick={() => handleProductClick(product.inventoryId)}
                                            divider
                                        >
                                            <ListItemText 
                                                primary={`${product.inventoryId} - ${product.productName}`}
                                                secondary={`Status: ${product.status} | Category: ${product.categoryName}`}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            )}
                        </Box>
                        
                        <Box sx={{ 
                            width: isMobile ? '100%' : '70%',
                            mt: isMobile ? 2 : 0
                        }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>Warehouse Map</Typography>
                            {loading ? (
                                <Typography>Loading map...</Typography>
                            ) : (
                                <MapViewer 
                                    mapData={mapData} 
                                    selectedProducts={selectedProductDetails} 
                                    showHeatMap={showHeatMap}
                                />
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Container>
            
            <ProductDetailsModal
                product={detailProduct}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
            
            <ReportAnalysisDialog
                open={analysisDialogOpen}
                onClose={handleAnalysisClose}
            />
        </>
    );
};

export default Dashboard;
