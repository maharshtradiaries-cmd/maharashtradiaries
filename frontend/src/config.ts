// API Configuration for Maharashtra Diaries
// In development, it uses localhost:5000. In production (Vercel), it uses relative paths.

const isProduction = import.meta.env.MODE === 'production' || 
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

export const API_BASE_URL = isProduction 
  ? '/api' 
  : 'http://localhost:5000/api';

export const AUTH_API_URL = `${API_BASE_URL}/auth`;
export const OTP_API_URL = `${API_BASE_URL}/otp`;
export const TRIP_API_URL = `${API_BASE_URL}/trips`;
export const DESTINATION_API_URL = `${API_BASE_URL}/destinations`;
