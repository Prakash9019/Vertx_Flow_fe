// Vertx_Flow_fe/src/context/StartupProfileContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Using axios directly for simplicity, can be replaced with a preconfigured instance
import API_KEY from '../../key';
const API_URL = `${API_KEY}/api/startups`; // Backend API endpoint

const StartupProfileContext = createContext();

export const useStartupProfile = () => useContext(StartupProfileContext);

export const StartupProfileProvider = ({ children }) => {
  const [startupData, setStartupData] = useState({
    stage: '',
    location: '',
    raise: '',
    revenue: '',
    industry: [], // Ensure industry is an array
    pitch: ''
  });
  const [loadingData, setLoadingData] = useState(true); // For initial data load
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Update token handling to be consistent
  const getToken = () => {
    const token = localStorage.getItem('authToken'); // Changed back to 'authToken' to match login storage
    console.log('Current token:', token); // Debug log
    return token;
  };

  // Function to fetch existing startup data
  const fetchStartupData = useCallback(async () => {
    setLoadingData(true);
    setError(null);
    const token = getToken();
    console.log('Fetching with token:', token); // Debug log

    if (!token) {
      console.warn("No auth token found for fetching startup data. User might be new or not logged in.");
      setStartupData({ stage: '', location: '', raise: '', revenue: '', industry: [], pitch: '' });
      setLoadingData(false);
      return;
    }

    try {
      const response = await axios.get(`${API_KEY}/api/startups`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.data.data) {
        const fetchedData = response.data.data;
        setStartupData({
          stage: fetchedData.stage || '',
          location: fetchedData.location || '',
          raise: fetchedData.raise || '',
          revenue: fetchedData.revenue || '',
          // Ensure industry is always an array, even if it's a single string or null from backend
          industry: Array.isArray(fetchedData.industry) ? fetchedData.industry : (fetchedData.industry ? [fetchedData.industry] : []),
          pitch: fetchedData.pitch || ''
        });
      } else {
         // No existing profile, initialize with defaults (already done by useState)
        setStartupData({ stage: '', location: '', raise: '', revenue: '', industry: [], pitch: '' });
      }
    } catch (err) {
      console.error("Fetch error details:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      if (err.response && err.response.status === 404) {
        console.log("No startup profile found for this user. Ready for new profile creation.");
        setStartupData({ stage: '', location: '', raise: '', revenue: '', industry: [], pitch: '' });
      } else {
        console.error("Failed to fetch startup data:", err);
        setError(err.response?.data?.message || "Failed to load existing profile data. Please try again.");
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Update a specific field in the startup data
  const updateStartupField = (field, value) => {
    setStartupData(prevData => ({
      ...prevData,
      [field]: value
    }));
    setError(null); // Clear error when user starts editing
    setSuccessMessage(''); // Clear success message
  };

  // Submit the entire startup profile
  const submitStartupProfile = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please log in to save your profile.");
      setIsSubmitting(false);
      return false;
    }

    const payload = {
      ...startupData,
      industry: Array.isArray(startupData.industry) ? startupData.industry : [startupData.industry].filter(Boolean)
    };

    try {
      console.log('Submitting with token:', token); // Debug log
      console.log('Payload:', payload); // Debug log

      const response = await axios.post(API_URL, payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Submit response:', response.data); // Debug log
      
      setSuccessMessage(response.data.message || "Profile saved successfully!");
      if (response.data && response.data.data) {
        const savedData = response.data.data;
        // Update context with potentially processed/validated data from backend
        setStartupData({
          stage: savedData.stage || '',
          location: savedData.location || '',
          raise: savedData.raise || '',
          revenue: savedData.revenue || '',
          industry: Array.isArray(savedData.industry) ? savedData.industry : [savedData.industry].filter(Boolean),
          pitch: savedData.pitch || ''
        });
      }
      return true; // Indicate success
    } catch (err) {
      console.error("Submit error details:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      const errorMessage = err.response?.data?.message || "An error occurred while saving your profile.";
      setError(errorMessage);
      return false; // Indicate failure
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch initial data when the provider mounts if a token exists
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchStartupData();
    } else {
      setLoadingData(false); // No token, so not actively loading from backend
    }
  }, [fetchStartupData]); // fetchStartupData is memoized with useCallback

  return (
    <StartupProfileContext.Provider value={{
      startupData,
      loadingData,
      isSubmitting,
      error,
      successMessage,
      fetchStartupData, // For manual refetch if needed
      updateStartupField,
      submitStartupProfile,
      setError // Allow components to set/clear errors
    }}>
      {children}
    </StartupProfileContext.Provider>
  );
};