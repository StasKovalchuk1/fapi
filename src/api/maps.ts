import axios from 'axios';
import { BASE_URL } from './config';

export interface ZoneDTO {
    id: number;
    zoneId: number;
    name: string;
    isNotified: boolean;
    shape: string; // JSON строка
}

export interface MapDTO {
    id: number;
    name: string;
    width: number;
    height: number;
    zones: ZoneDTO[];
}

export async function importMap(file: File): Promise<MapDTO> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<MapDTO>(`${BASE_URL}/maps/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}

export async function getLastMap(): Promise<MapDTO> {
    const response = await axios.get<MapDTO>(`${BASE_URL}/maps/current`);
    return response.data;
}