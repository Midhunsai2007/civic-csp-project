import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking login or already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('civic_token');
        localStorage.removeItem('civic_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth Services
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Complaint Services
export const complaintApi = {
  create: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
};

// Citizen Services
export const citizenApi = {
  getDashboard: () => api.get('/citizen/dashboard'),
  getMyComplaints: (params) => api.get('/citizen/complaints', { params }),
};

// Staff Services
export const staffApi = {
  getDashboard: () => api.get('/staff/dashboard'),
  getAssigned: (params) => api.get('/staff/complaints', { params }),
  updateStatus: (id, data) => api.put(`/staff/complaints/${id}/status`, data),
  addNote: (id, noteData) => api.post(`/staff/complaints/${id}/notes`, noteData),
};

// Admin Services
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  assignComplaint: (id, data) => api.put(`/admin/complaints/${id}/assign`, data),
};

// AI Services (Proposed Architecture Preview)
export const aiApi = {
  classify: (data) => api.post('/ai/classify-complaint', data),
  detectPriority: (data) => api.post('/ai/detect-priority', data),
  getArchitectureInfo: () => api.get('/ai/architecture-info'),
};
