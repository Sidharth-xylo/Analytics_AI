import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sage-unrocky-cursively.ngrok-free.dev', // Hardcoded Ngrok URL
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required to bypass Ngrok warning
    },
});

// Add Request Interceptor to inject Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
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
