import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (dev only)
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('API Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

export const leadsService = {
  create: (data: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    source?: string;
    metadata?: any;
  }) => api.post('/leads', data),

  submitDiagnosis: (data: {
    email: string;
    firstName?: string;
    phone?: string;
    answers: Record<string, any>;
    diagnosisId?: string;
  }) => api.post('/leads/diagnosis', data),
};

export default api;
