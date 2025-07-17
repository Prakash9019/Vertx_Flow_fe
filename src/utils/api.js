import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Payment API functions
export const paymentApi = {
  // Get all available plans
  getPlans: () => api.get('/payments/plans'),
  
  // Create a payment order
  createOrder: (planName, billingCycle) => 
    api.post('/payments/create-order', { planName, billingCycle }),
  
  // Verify payment after completion
  verifyPayment: (paymentData) => 
    api.post('/payments/verify', paymentData),
  
  // Get user's current subscription
  getSubscription: () => api.get('/payments/subscription'),
  
  // For testing without actual payment
  testVerifyPayment: (planName, billingCycle) => 
    api.post('/payments/test-verify', { planName, billingCycle }),
    
  // Get payment history
  getPaymentHistory: () => api.get('/payments/history'),
};

export default api;