// Vertx_Flow_fe/src/context/StartupProfileContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Using axios directly for simplicity, can be replaced with a preconfigured instance
import API_KEY from '../../key';
const API_URL = `${API_KEY}/api/startups`; // Backend API endpoint
const PROFILE_URL = `${API_KEY}/api/profile/manual`;

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
  const [profileData, setProfileData] = useState({
    companyName: '',
    companyWebsite: '',
    accountName:''
  });
  const [loadingData, setLoadingData] = useState(true); // For initial data load
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [user_id, setUserid] = useState('');
  const [startupId, setstartupId ] =useState('');
  const getToken = () => localStorage.getItem('authToken');

  const fetchStartupData = useCallback(async () => {
    setLoadingData(true);
    setError(null);
    const token = getToken();
    console.log(token)
    if (!token) {
      console.warn("No auth token found for fetching startup data. User might be new or not logged in.");
      setStartupData({ stage: '', location: '', raise: '', revenue: '', industry: [], pitch: '' });
      setLoadingData(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        const fetchedData = response.data.data;
        setUserid(fetchedData.userId)
        setstartupId(fetchedData._id);
        setStartupData({
          stage: fetchedData.stage || '',
          location: fetchedData.location || '',
          raise: fetchedData.raise || '',
          revenue: fetchedData.revenue || '',
          industry: Array.isArray(fetchedData.industry) ? fetchedData.industry : (fetchedData.industry ? [fetchedData.industry] : []),
          pitch: fetchedData.pitch || ''
        });
        console.log(fetchedData);
      } else {
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

  const fetchProfileData = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get(PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setProfileData({
          companyName: res.data.companyName || '',
          companyWebsite: res.data.companyWebsite || '',
          accountName: res.data.accountName ||''
        });
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  }, []);

  const updateStartupField = (field, value) => {
    setStartupData(prevData => ({
      ...prevData,
      [field]: value
    }));
    setError(null);
    setSuccessMessage('');
  };

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
      industry: Array.isArray(startupData.industry) ? startupData.industry : (startupData.industry ? [startupData.industry] : [])
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage(response.data.message || "Profile saved successfully!");
      if (response.data && response.data.data) {
        const savedData = response.data.data;
        setStartupData({
          stage: savedData.stage || '',
          location: savedData.location || '',
          raise: savedData.raise || '',
          revenue: savedData.revenue || '',
          industry: Array.isArray(savedData.industry) ? savedData.industry : (savedData.industry ? [savedData.industry] : []),
          pitch: savedData.pitch || ''
        });
      }
      return true;
    } catch (err) {
      console.error("Failed to submit startup data:", err);
      let errorMessage = err.response?.data?.message || "An error occurred while saving your profile.";
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).map(e => e.message).join(', ');
        errorMessage = `Validation Failed: ${validationErrors}`;
      }
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchStartupData();
      fetchProfileData();
    } else {
      setLoadingData(false);
    }
  }, [fetchStartupData, fetchProfileData]);

  return (
    <StartupProfileContext.Provider value={{
      startupData,
      profileData,
      loadingData,
      fetchProfileData,
      user_id,
      startupId,
      isSubmitting,
      error,
      successMessage,
      fetchStartupData,
      updateStartupField,
      submitStartupProfile,
      setError
    }}>
      {children}
    </StartupProfileContext.Provider>
  );
};
