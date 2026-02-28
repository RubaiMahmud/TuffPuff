import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach access token
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined' && auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Error fetching Firebase token', err);
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If we get 401 even with Firebase token, we might need them to log in again
      if (typeof window !== 'undefined') {
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

