import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundPay from '../assets/backgroundPay.jpg';

const Payment_Page = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/payments/plans');
        
        // Check the response format and ensure plans is an array
        if (response.data) {
          // If response.data is an array, use it directly
          if (Array.isArray(response.data)) {
            setPlans(response.data);
          } 
          // If response.data has a plans property that's an array
          else if (response.data.plans && Array.isArray(response.data.plans)) {
            setPlans(response.data.plans);
          }
          // If response.data is an object with plan properties
          else if (typeof response.data === 'object') {
            // Log the response to understand its structure
            console.log('API Response:', response.data);
            
            // Convert to array if it's an object with plan properties
            // This is a fallback in case the API returns an object instead of an array
            const plansArray = Object.keys(response.data).map(key => {
              return {
                ...response.data[key],
                _id: key
              };
            });
            
            setPlans(plansArray);
          } else {
            // If we can't determine the structure, set an empty array
            console.error('Unexpected API response format:', response.data);
            setPlans([]);
            setError('Unexpected data format received from server.');
          }
        } else {
          setPlans([]);
          setError('No data received from server.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment plans:', err);
        setError('Failed to load payment plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 relative bg-black overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
      <div 
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundImage: `url(${backgroundPay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3
        }}>
      </div>
      
      {/* Header */}
      <div className="text-center mb-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-4">Start Fundraising Today. Level Up Anytime.</h1>
        <p className="text-gray-300 text-sm mb-2">
          Every founder's journey is different, start where you are, unlock what you need. Grow with Vertx.
          <br />Designed for Founders. Built for Outcomes.
        </p>
        <p className="text-gray-300 text-sm">
          (For Incubators, Accelerators, Universities, Enterprises, <a href="#" className="text-blue-400 underline">sign up here</a>)
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-10 space-x-4">
        <span className="text-white font-medium">MONTHLY</span>
        <div className="relative inline-block w-12 h-6">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={billingCycle === 'quarterly'}
            onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'quarterly' : 'monthly')}
            id="toggle"
          />
          <label 
            htmlFor="toggle"
            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${billingCycle === 'quarterly' ? 'bg-white' : 'bg-gray-600'}`}
          >
            <span 
              className={`absolute h-4 w-4 left-1 bottom-1 bg-gray-800 rounded-full transition-all duration-300 ${billingCycle === 'quarterly' ? 'transform translate-x-6' : ''}`}
            ></span>
          </label>
        </div>
        <div className="flex items-center">
          <span className="text-white font-medium">QUARTERLY</span>
          <span className="ml-2 bg-blue-600 text-xs px-2 py-0.5 rounded-full text-white">SAVE 33%</span>
        </div>
      </div>

      {/* Pricing Cards */}
      {loading ? (
        <div className="text-white text-center py-10">
          <p className="text-xl">Loading payment plans...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-white text-center py-10">
          <p className="text-xl">No payment plans available at this time.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full items-start">
          {plans.map((plan, index) => (
            <div key={plan._id || index} className="flex flex-col rounded-lg overflow-hidden h-auto">
              {/* Plan Header */}
              <div className="bg-blue-900 p-4 text-center">
                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              </div>
              
              {/* Plan Price and Description */}
              <div className="p-6 bg-indigo-900/30 backdrop-blur-sm">
                <div className="mb-6">
                  <h3 className="text-5xl font-bold text-white">
                    ${billingCycle === 'monthly' 
                      ? (plan.monthlyPrice || plan.price || 0) 
                      : (plan.quarterlyPrice || (plan.monthlyPrice ? plan.monthlyPrice * 3 * 0.67 : 0) || 0).toFixed(0)} 
                    <span className="text-sm font-normal ml-1">per startup / {billingCycle}</span>
                  </h3>
                  <p className="text-white mt-1">{plan.description || `${plan.name} plan for startups`}</p>
                </div>
                
                <button 
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold"
                  onClick={() => {
                    // Handle subscription logic here
                    console.log(`Selected plan: ${plan.name}, Billing: ${billingCycle}`);
                  }}
                >
                  {plan.buttonText || (
                    plan.name === 'Starter' ? 'Try Vertx' : 
                    plan.name === 'Launch' ? 'Start Fundraising' : 'Master Fundraising'
                  )}
                </button>
              </div>
              
              {/* Features List */}
              <div className="bg-black p-6 max-h-64 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                <div className="space-y-3">
                  {Array.isArray(plan.features) ? plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white">
                      <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{feature}</span>
                    </div>
                  )) : (
                    // Fallback if features is not an array
                    <div className="flex items-center text-white">
                      <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{plan.name} features</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payment_Page;