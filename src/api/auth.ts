import axios from 'axios';
import { BASE_URL } from './config';

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE'
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    lastName: string;
    username: string;
    role: Role;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    username?: string;
    errorMessage?: string;
    currentRole?: string;
    authToken?: string;
}

export async function registerUser(data: RegisterRequest): Promise<void> {
    await axios.post(`${BASE_URL}/users/registrations`, data);
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export async function initiatePasswordReset(email: string): Promise<void> {
    await axios.post(`${BASE_URL}/users/password-reset?email=${email}`);
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    // POST /users/password-reset/confirm
    // Можно передавать token и newPassword в body
    await axios.post(`${BASE_URL}/users/password-reset/confirm`, {
        token,
        newPassword
    });
}