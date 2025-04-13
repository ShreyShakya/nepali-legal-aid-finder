import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminLogin = (email, password) =>
  api.post('/admin/login', { email, password });

export const getLawyers = () => api.get('/admin/lawyers');
export const deleteLawyer = (lawyerId) => api.delete(`/admin/lawyers/${lawyerId}`);

export const getClients = () => api.get('/admin/clients');
export const deleteClient = (clientId) => api.delete(`/admin/clients/${clientId}`);

export const getCases = () => api.get('/admin/cases');
export const deleteCase = (caseId) => api.delete(`/admin/cases/${caseId}`);

export const getAppointments = () => api.get('/admin/appointments');
export const deleteAppointment = (appointmentId) =>
  api.delete(`/admin/appointments/${appointmentId}`);

// Added in the previous step
export const deleteDocumentTemplate = (filename) =>
  api.delete(`/admin/delete-template/${filename}`);

// Add this to fetch document templates
export const getDocumentTemplates = () => api.get('/document-templates');

// Optionally, add a function to upload templates
export const uploadDocumentTemplate = (formData) =>
  api.post('/admin/upload-template', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });