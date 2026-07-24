import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Stats ──────────────────────────────────────────
export const getStats = () => api.get('/stats');

// ── Incidents ──────────────────────────────────────
export const getIncidents = (params = {}) => api.get('/incidents', { params });
export const getIncidentById = (id) => api.get(`/incidents/${id}`);
export const createIncident = (data) => api.post('/incidents', data);
export const updateIncident = (id, data) => api.put(`/incidents/${id}`, data);

// ── AI ─────────────────────────────────────────────
export const analyzeWithAI = (data) => api.post('/ai/diagnose', data);
export const addToKnowledge = (data) => api.post('/ai/knowledge', data);

// ── Solutions ──────────────────────────────────────
export const getSolutions = () => api.get('/solutions');

// ── Knowledge ──────────────────────────────────────
export const getKnowledge = () => api.get('/knowledge');

// ── Auth ───────────────────────────────────────────
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

export default api;
