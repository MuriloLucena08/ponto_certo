import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include token if we implement token-based auth later,
// though Flutter code used basic login returning ID.
