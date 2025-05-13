// Vertx_Flow_fe/src/context/StartupProfileContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Using axios directly for simplicity, can be replaced with a preconfigured instance

const API_URL = 'http://localhost:5000/api/startups'; // Backend API endpoint

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

  const getToken = () => localStorage.getItem('authToken');

  // Function to fetch existing startup data
  const fetchStartupData = useCallback(async () => {
    setLoadingData(true);
    setError(null);
    const token = getToken();

    if (!token) {
      //setError("Authentication token not found. Please log in.");
      // setLoadingData(false); // Set loading to false as we are not fetching
      // navigate('/login'); // Or handle as per your app's auth flow
      // For now, allow proceeding with an empty form if no token (e.g. initial setup before full auth guard)
      // This behavior might need adjustment based on strictness of auth for this page.
      console.warn("No auth token found for fetching startup data. User might be new or not logged in.");
      setStartupData({ stage: '', location: '', raise: '', revenue: '', industry: [], pitch: '' });
      setLoadingData(false);
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
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

    // Ensure industry is an array for the payload
    const payload = {
        ...startupData,
        industry: Array.isArray(startupData.industry) ? startupData.industry : (startupData.industry ? [startupData.industry] : [])
    };
    // If industry is empty, backend model defaults to [], so sending an empty array is fine.

    try {
      const response = await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage(response.data.message || "Profile saved successfully!");
      if (response.data && response.data.data) {
        const savedData = response.data.data;
        // Update context with potentially processed/validated data from backend
        setStartupData({
            stage: savedData.stage || '',
            location: savedData.location || '',
            raise: savedData.raise || '',
            revenue: savedData.revenue || '',
            industry: Array.isArray(savedData.industry) ? savedData.industry : (savedData.industry ? [savedData.industry] : []),
            pitch: savedData.pitch || ''
        });
      }
      return true; // Indicate success
    } catch (err) {
      console.error("Failed to submit startup data:", err);
      let errorMessage = err.response?.data?.message || "An error occurred while saving your profile.";
      if (err.response?.data?.errors) {
         const validationErrors = Object.values(err.response.data.errors).map(e => e.message).join(', ');
         errorMessage = `Validation Failed: ${validationErrors}`;
      }
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