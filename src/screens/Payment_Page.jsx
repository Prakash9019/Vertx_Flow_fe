import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundPay from '../assets/backgroundPay.png';
import API_KEY from "../../key";
import PaymentStatus from '../components/PaymentStatus';

const Payment_Page = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', or null
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Enable scrolling on body and html
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Fetch plans from API
    fetchPlans();
    
    // Check if user has existing subscription
    checkSubscription();
    
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_KEY}/api/payments/plans`);

      // Log the raw response to understand the data structure
      console.log('Raw API Response:', response.data);

      // Check the response format and ensure plans is an array
      if (response.data) {
        // If response.data is an array, use it directly
        if (Array.isArray(response.data)) {
          console.log('Response is an array with length:', response.data.length);
          
          // Add quarterly price calculation if not provided
          const processedPlans = response.data.map(plan => {
            if (!plan.quarterlyPrice && plan.monthlyPrice) {
              return {
                ...plan,
                quarterlyPrice: Math.round(plan.monthlyPrice * 2) // 33% discount for quarterly
              };
            }
            return plan;
          });
          
          setPlans(processedPlans);
        } 
        // If response.data has a plans property that's an array
        else if (response.data.plans && Array.isArray(response.data.plans)) {
          console.log('Response has plans array with length:', response.data.plans.length);
          
          // Add quarterly price calculation if not provided
          const processedPlans = response.data.plans.map(plan => {
            if (!plan.quarterlyPrice && plan.monthlyPrice) {
              return {
                ...plan,
                quarterlyPrice: Math.round(plan.monthlyPrice * 2) // 33% discount for quarterly
              };
            }
            return plan;
          });
          
          setPlans(processedPlans);
        }
        // If response.data is an object with plan properties
        else if (typeof response.data === 'object') {
          console.log('Response is an object with keys:', Object.keys(response.data));
          
          // Convert to array if it's an object with plan properties
          // This is a fallback in case the API returns an object instead of an array
          const plansArray = Object.keys(response.data).map(key => {
            const plan = response.data[key];
            
            // Add quarterly price calculation if not provided
            if (!plan.quarterlyPrice && plan.monthlyPrice) {
              return {
                ...plan,
                _id: key,
                quarterlyPrice: Math.round(plan.monthlyPrice * 2) // 33% discount for quarterly
              };
            }
            
            return {
              ...plan,
              _id: key
            };
          });
          
          console.log('Converted to plans array:', plansArray);
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

  // Check if user has existing subscription
  const checkSubscription = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_KEY}/api/payments/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        if (data.hasSubscription) {
          setUserSubscription(data.subscription);
          // If user has subscription, fetch payment history
          fetchPaymentHistory();
        }
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };
  
  // Fetch payment history
  const fetchPaymentHistory = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_KEY}/api/payments/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        if (data.payments) {
          setPaymentHistory(data.payments);
        }
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
    }
  };

  // Handle subscription with Razorpay integration
  const handleSubscription = async (plan) => {
    // Check if user is logged in - use authToken which is what GoogleAuthCallback sets
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      alert("Please log in to continue with your subscription");
      navigate('/login');
      return;
    }
    
    // Set processing state for this specific plan only
    setProcessingPlanId(plan._id || plan.name);
    
    try {
      // Create order via API
      const orderResponse = await axios.post(`${API_KEY}/api/payments/create-order`, {
        planName: plan.name,
        billingCycle
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const orderData = orderResponse.data;
      console.log('Order created:', orderData);
      
      // Create Razorpay options using order data
      const options = {
        key: "rzp_test_bXPIg9ufh31QAf", // Razorpay test key
        amount: orderData.amount, // Amount from order
        currency: orderData.currency,
        name: "Vertx",
        description: `${plan.name} Plan - ${billingCycle === 'quarterly' ? 'Quarterly' : 'Monthly'}`,
        order_id: orderData.orderId, // Order ID from API
        image: "https://i.imgur.com/3g7nmJC.png", // Vertx logo
        handler: async function(response) {
          console.log("Payment successful!", response);
          
          try {
            // Get auth token
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Authentication token not found');
            
            // Send verification request to backend
            const verifyData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id || 'direct_payment',
              razorpay_signature: response.razorpay_signature || 'direct_payment',
              planName: plan.name,
              billingCycle: billingCycle,
              amount: getTotalAmount(plan) * 100
            };
            
            // First call the verify endpoint to record the payment
            const verifyResponse = await axios.post(`${API_KEY}/api/payments/verify`, verifyData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            const verifyResult = verifyResponse.data;
            console.log('Payment verified:', verifyResult);
            
            // Refresh subscription data
            await checkSubscription();
            
            setProcessingPlanId(null);
            // Show success status instead of alert
            setPaymentStatus('success');
            setPaymentDetails({
              planName: plan.name,
              amount: getTotalAmount(plan),
              billingCycle: billingCycle === 'quarterly' ? 'Quarterly' : 'Monthly',
              transactionId: response.razorpay_payment_id,
              expiryDate: verifyResult.subscription.expiryDate,
              invoiceNumber: verifyResult.subscription.invoiceNumber
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            setProcessingPlanId(null);
            // Show failure status instead of alert
            setPaymentStatus('failed');
            setPaymentDetails({
              planName: plan.name,
              amount: getTotalAmount(plan),
              billingCycle: billingCycle === 'quarterly' ? 'Quarterly' : 'Monthly',
              error: 'Payment was processed but verification failed. Please contact support.'
            });
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setProcessingPlanId(null);
          },
          escape: true
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: "#3399cc"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setProcessingPlanId(null);
      // Show failure status instead of alert
      setPaymentStatus('failed');
      setPaymentDetails({
        planName: plan.name,
        amount: getTotalAmount(plan),
        billingCycle: billingCycle === 'quarterly' ? 'Quarterly' : 'Monthly',
        error: 'Failed to initiate payment. Please try again later.'
      });
    }
  };

  const getTotalAmount = (plan) => {
    // For quarterly, multiply by 3 months
    return billingCycle === "quarterly" ? plan.quarterlyPrice * 3 : plan.monthlyPrice;
  };

  return (
    <div className="h-screen w-full flex flex-col py-10 px-4 relative bg-black overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900" style={{scrollbarWidth: 'thin'}}>
      {/* Payment Status Popup */}
      {paymentStatus && (
        <PaymentStatus 
          status={paymentStatus} 
          details={paymentDetails} 
          onClose={() => setPaymentStatus(null)}
        />
      )}
      
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
      <div className="text-center mb-8 max-w-3xl mx-auto">
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
      <div className="flex items-center justify-center mb-10 space-x-4 mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full items-start mx-auto">
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
                      : (
                          // For quarterly pricing:
                          // 1. Use quarterlyPrice if available
                          // 2. Otherwise calculate from monthlyPrice with 33% discount (multiply by 2 instead of 3)
                          // 3. If neither is available, use price or default to 0
                          plan.quarterlyPrice || 
                          (plan.monthlyPrice ? Math.round(plan.monthlyPrice * 2) : 0) || 
                          (plan.price ? Math.round(plan.price * 2) : 0)
                        )} 
                    <span className="text-sm font-normal ml-1">per startup / {billingCycle}</span>
                  </h3>
                  <p className="text-white mt-1">{plan.description || `${plan.name} plan for startups`}</p>
                </div>
                
                <button 
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold"
                  onClick={() => handleSubscription(plan)}
                  disabled={processingPlanId === (plan._id || plan.name)}
                >
                  {processingPlanId === (plan._id || plan.name) ? 'Processing...' : (
                    plan.buttonText || (
                      plan.name === 'Starter' ? 'Try Vertx' : 
                      plan.name === 'Launch' ? 'Start Fundraising' : 'Master Fundraising'
                    )
                  )}
                </button>
              </div>
              
              {/* Features List */}
              <div className="bg-black p-6">
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