import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import {ProductDetailsDTO} from "../../api/inventory";

interface ProductDetailsModalProps {
    product: ProductDetailsDTO | null;
    open: boolean;
    onClose: () => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                {product ? (
                    <>
                        <Typography variant="h6">Product Details</Typography>
                        <Typography>Item ID: {product.inventoryId}</Typography>
                        <Typography>Serial Number: {product.serialNumber}</Typography>
                        <Typography>Name: {product.productName}</Typography>
                        <Typography>Description: {product.description}</Typography>
                        <Typography>Status: {product.status}</Typography>
                        <Typography>Category: {product.categoryName}</Typography>
                        <Typography>
                            Coordinates: ({product.coordinates.coordinateX}, {product.coordinates.coordinateY})
                        </Typography>
                        <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default ProductDetailsModal;
