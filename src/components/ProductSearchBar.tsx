import React, { useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { searchProducts, ProductSearchDTO } from '../api/inventory';

interface ProductSearchBarProps {
    onProductsSelected: (products: ProductSearchDTO[]) => void;
    maxSelection?: number;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ onProductsSelected, maxSelection = 10 }) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<ProductSearchDTO[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<ProductSearchDTO[]>([]);

    const handleInputChange = async (_: any, value: string) => {
        setInputValue(value);
        if (value.length > 1) {
            try {
                const results = await searchProducts(value);
                setOptions(results);
            } catch (error) {
                console.error('Error searching products:', error);
            }
        } else {
            setOptions([]);
        }
    };

    const handleSelectionChange = (_: any, newValue: ProductSearchDTO[]) => {
        if (newValue.length <= maxSelection) {
            setSelectedProducts(newValue);
            onProductsSelected(newValue);
        }
    };

    return (
        <Box>
            <Autocomplete
                multiple
                options={options}
                getOptionLabel={(option) => `${option.inventoryId} - ${option.productName}`}
                filterSelectedOptions
                filterOptions={(options) => options}
                value={selectedProducts}
                onChange={handleSelectionChange}
                onInputChange={handleInputChange}
                renderInput={(params) => (
                    <TextField {...params} label="Search by Serial ID or Product Name" variant="outlined" />
                )}
            />
        </Box>
    );
};

export default ProductSearchBar;
