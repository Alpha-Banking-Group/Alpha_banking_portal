import axios from 'axios';

// 1. Create the Axios Instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Your Spring Boot URL
});

// Before sending ANY request, check if we have a token.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Attach Key
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;