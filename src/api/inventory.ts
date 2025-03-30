import axios from 'axios';
import { BASE_URL } from './config';

export interface CoordinatesDTO {
    coordinateX: number;
    coordinateY: number;
}

export interface ProductSearchDTO {
    inventoryId: number;
    productName: string;
}

export interface ProductDetailsDTO {
    inventoryId: number;
    serialNumber: number;
    productName: string;
    description: string;
    status: string;
    categoryName: string;
    coordinates: CoordinatesDTO;
}

export async function searchProducts(query: string): Promise<ProductSearchDTO[]> {
    const response = await axios.get<ProductSearchDTO[]>(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.data;
}

export async function getProductDetails(inventoryId: number): Promise<ProductDetailsDTO> {
    const response = await axios.get<ProductDetailsDTO>(`${BASE_URL}/search/${inventoryId}`);
    return response.data;
}