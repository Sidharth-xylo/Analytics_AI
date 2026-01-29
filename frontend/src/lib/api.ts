import axios from 'axios';
import { getSessionId } from './session';

const api = axios.create({
    baseURL: 'http://localhost:8005',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Request Interceptor to inject Session ID
api.interceptors.request.use((config) => {
    const sessionId = getSessionId();
    config.headers['X-Session-ID'] = sessionId;
    return config;
});


export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const chat = async (query: string, fileId?: string) => {
    const response = await api.post('/chat', { query, file_id: fileId });
    return response.data;
};

export const connectUrl = async (url: string) => {
    const response = await api.post('/connect_url', { url });
    return response.data;
};

export const getFiles = async () => {
    const response = await api.get('/files');
    return response.data;
};

export const deleteFile = async (fileId: string) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
};

export default api;
