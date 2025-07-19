<<<<<<< HEAD
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundPay from '../assets/backgroundPay.png';
import API_KEY from "../../key";
import PaymentStatus from '../components/PaymentStatus';
>>>>>>> Payment
import Galaxy from "../assets/Galaxy.png";
import PaymentGradient1 from '../assets/PaymentGradient1.png'; 
import PaymentGradient2 from '../assets/PaymentGradient2.png'; 
import PaymentGradient3 from '../assets/PaymentGradient3.png';

const Payment_Page = () => {
  const [billingCycle, setBillingCycle] = useState('QUARTERLY');

<<<<<<< HEAD
  const plans = [
    {
      name: 'Starter',
      monthlyPrice: '$9',
      quarterlyPrice: '$19',
      period: 'per startup / month',
      description: 'Perfect for idea stage projects.',
      buttonText: 'Try Vertx',
      buttonStyle: 'bg-white text-black',
      features: [
        'Investor database',
        'Fundraising',
        'Customized one pager',
        'Standard support'
      ]
    },
    {
      name: 'Launch',
      monthlyPrice: '$29',
      quarterlyPrice: '$59',
      period: 'per startup / month',
      description: 'Ideal for pre-seed startups.',
      buttonText: 'Start Fundraising',
      buttonStyle: 'bg-white text-black',
      features: [
        'Everything in Starter +',
        'Access complete pitch reports',
        'Access investor outreach',
        'Access one pager analytics',
        'Everything in fundraising',
        'Access flash',
        'Priority support'
      ]
    },
    {
      name: 'Scale',
      monthlyPrice: '$49',
      quarterlyPrice: '$99',
      period: 'per startup / month',
      description: 'Ideal for revenue generating startups.',
      buttonText: 'Master Fundraising',
      buttonStyle: 'bg-white text-black',
      features: [
        'Everything in Launch +',
        'Evaluate with high usage limits',
        'Mock pitching with high usage',
        'Generate unlimited pitch decks',
        'Investor outreach with high usage',
        'Flash with high usage limits',
        'Access early features',
        '1:1 Support'
      ]
=======
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
      const response = await axios.get(`${API_KEY}/api/payment/plans`);

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
>>>>>>> Payment
    }
  ];

<<<<<<< HEAD
  const comparisonData = [
    {
      category: 'Fundraising Experience',
      items: [
        { feature: 'Dashboard', starter: 'Yes', launch: 'Analytics included', scale: 'Analytics included' },
        { feature: 'Investor database', starter: 'Yes', launch: 'Yes', scale: 'Match score (included)' },
        { feature: 'Manage and track progress', starter: 'Yes', launch: '+2 extra rounds', scale: 'Unlimited rounds' },
        { feature: 'Create target lists', starter: 'Yes', launch: 'Shareable', scale: 'Shareable' },
        { feature: 'Customized one pager', starter: 'Yes', launch: 'Analytics included', scale: 'Analytics with tips' }
      ]
    },
    {
      category: 'Flash',
      items: [
        { feature: 'Usage limits', starter: 'No', launch: 'High', scale: 'Highest' },
        { feature: 'SuperFlash', starter: 'No', launch: 'No', scale: 'Yes' },
        { feature: 'Early access to new features', starter: 'No', launch: 'No', scale: 'Yes' }
      ]
    },
    {
      category: 'Investor Outreach',
      items: [
        { feature: 'Outreach', starter: 'No', launch: 'Manual', scale: 'Smarter + Analytics' },
        { feature: 'Compliments & feedback', starter: 'View only', launch: 'Manual Reply', scale: 'Enhanced + Schedule call' },
        { feature: 'Automated outreach', starter: 'No', launch: 'No', scale: 'Yes' }
      ]
    },
    {
      category: 'Evaluate',
      items: [
        { feature: 'Pitch Deck Evaluation', starter: 'No', launch: 'Yes', scale: 'Downloadable + Insights' },
        { feature: 'Suggestions', starter: 'No', launch: 'Basic', scale: 'Advanced' }
      ]
    },
    {
      category: 'Playground',
      items: [
        { feature: 'Mock Pitching', starter: 'No', launch: 'No', scale: 'Unlimited calls + Custom' },
        { feature: 'Pitch Deck Generator', starter: 'No', launch: '2 per month', scale: 'Unlimited + Easy modify' }
      ]
    },
    {
      category: 'Other',
      items: [
        { feature: 'Support', starter: 'Standard', launch: 'Priority', scale: '1:1 Expert Support' }
      ]
    }
  ];
=======
  // Check if user has existing subscription
  const checkSubscription = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_KEY}/api/payment/subscription`, {
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
      const response = await axios.get(`${API_KEY}/api/payment/history`, {
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
      const orderResponse = await axios.post(`${API_KEY}/api/payment/create-order`, {
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
        theme: {
          color: "#3399cc",
          hide_topbar: false
        },
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
            const verifyResponse = await axios.post(`${API_KEY}/api/payment/verify`, verifyData, {
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
>>>>>>> Payment

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      
<<<<<<< HEAD
      <div className="flex-1 overflow-y-auto">
        <div
          className="min-h-screen bg-fixed bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${Galaxy})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'top center',
          }}
        >
          {/* Background texture/pattern */}
          <div className="absolute inset-0 opacity-50"></div>
          
          <div className="  relative z-10 px-3 sm:px-4 md:px-6 lg:px-7 py-6 sm:py-8 md:py-12 lg:py-16">
            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h1 className="text-white text-center font-bold mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[2.1rem] font-inter">
                Start Fundraising Today. Level Up Anytime.
              </h1>
              <p className="text-center text-[#B8B8B8] font-inter text-xs sm:text-sm md:text-base lg:text-[0.875rem] font-normal mb-1">
                Every founder's journey is different, start where you are, unlock what you need. Grow with Vertx.
              </p>
              <p className="text-center text-[#B8B8B8] font-inter text-xs sm:text-sm md:text-base lg:text-[0.875rem] font-normal mb-2">
                Designed for Founders. Built for Outcomes.
              </p>
              <p className="text-center text-white font-inter text-xs sm:text-sm md:text-base lg:text-[0.875rem] font-semibold">
                (For Incubators, Accelerators, Universities, Enterprises,{' '}
                <span className="cursor-pointer text-[#CF94FF] font-inter text-xs sm:text-sm md:text-base lg:text-[0.875rem] font-semibold underline">
                  sign up here
                </span>
                )
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <span className={`mr-2 sm:mr-3 md:mr-4 font-inter text-xs sm:text-sm md:text-base lg:text-[0.875rem] font-bold ${
                billingCycle === 'MONTHLY' ? 'text-white' : 'text-[#B8B8B8]'
              }`}>
                MONTHLY
              </span>
              <div className="relative">
                <button
                  onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'QUARTERLY' : 'MONTHLY')}
                  className="relative flex items-center w-10 h-5 sm:w-12 sm:h-6 md:w-14 md:h-7 lg:w-[3.125rem] lg:h-[1.5rem]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="26" viewBox="0 0 52 26" fill="none" className="w-full h-full">
                    <rect x="0.5" y="0.5" width="51" height="25" rx="12.5" fill="black" fillOpacity="0.4" stroke="white"/>
                    <path 
                      d={billingCycle === 'QUARTERLY' 
                        ? "M38.5 3.89999C43.766 3.89999 47.9998 7.99303 48 12.9996C48 18.0064 43.7661 22.1002 38.5 22.1002C33.2339 22.1002 29 18.0064 29 12.9996C29.0002 7.99303 33.234 3.89999 38.5 3.89999Z"
                        : "M13.5 3.89999C18.766 3.89999 22.9998 7.99303 23 12.9996C23 18.0064 18.7661 22.1002 13.5 22.1002C8.23386 22.1002 4 18.0064 4 12.9996C4.00022 7.99303 8.234 3.89999 13.5 3.89999Z"
                      } 
                      fill="white" 
                      stroke="white"
                    />
                  </svg>
                </button>
              </div>
              <span className={`ml-2 sm:ml-3 md:ml-4 font-inter text-xs sm:text-sm md:text-base lg:text-[0.875rem] font-bold ${
                billingCycle === 'QUARTERLY' ? 'text-white' : 'text-[#B8B8B8]'
              }`}>
                QUARTERLY
              </span>
              <div className="ml-2 py-1 rounded-full bg-white flex items-center justify-center w-8 h-3 sm:w-10 sm:h-4 md:w-12 md:h-4 lg:w-[3rem] lg:h-[1.0625rem]">
                <span className="text-black font-inter text-[0.375rem] sm:text-[0.4rem] md:text-[0.45rem] lg:text-[0.4375rem] font-bold">
                  SAVE 33%
                </span>
=======
      <div
        className="absolute font-[inter] inset-0 z-[-1]"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  max-w-6xl w-full items-start font-[inter] mx-auto">
          {plans.map((plan, index) => (
            <div key={plan._id || index} className="flex hover:border border-indigo-950 flex-col rounded-lg overflow-hidden h-auto">
            <div
        className="bg-[url('/src/assets/PaymentGradient1.png')] bg-cover bg-center bg-no-repeat 
                   rounded-md shadow-lg overflow-hidden flex flex-col w-full max-w-sm mx-auto" // Key changes here
    >
        {/* Plan Header */}
          <div
    className="w-full bg-[url('/src/assets/PaymentGradient2.png')] bg-cover bg-center bg-no-repeat my-3 mx-auto max-w-[340px] min-h-12 rounded-t-md flex items-center justify-center" // Key changes here for centering
>
    <h2 className="text-xl font-bold text-white">{plan.name}</h2>
</div>

        {/* Plan Price and Description */}
        <div className="p-6 bg-indigo-900/30 backdrop-blur-sm flex-grow">
            <div className="mb-6">
                <h3 className="text-5xl font-bold text-black">
                    ${billingCycle === 'monthly'
                        ? (plan.monthlyPrice || plan.price || 0)
                        : (
                            plan.quarterlyPrice ||
                            (plan.monthlyPrice ? Math.round(plan.monthlyPrice * 2) : 0) ||
                            (plan.price ? Math.round(plan.price * 2) : 0)
                        )}
                    <span className="text-sm font-medium ml-1">per startup / {billingCycle}</span>
                </h3>
                <p className="font-medium mt-1">{plan.description || `${plan.name} plan for startups`}</p>
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
>>>>>>> Payment
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-[0.96rem] mb-8 sm:mb-12 md:mb-16 lg:mb-20">
              {plans.map((plan, index) => (
                <div key={index} className="border border-[rgba(184,184,184,0.20)] bg-black rounded-lg flex flex-col min-h-[28rem] sm:min-h-[32rem] md:min-h-[36rem] lg:min-h-[38rem]">
                  {/* Main Content Container */}
                  <div
                    className="rounded-lg bg-cover bg-no-repeat bg-center p-4 sm:p-5 md:p-6 lg:p-6 mb-4 sm:mb-5 md:mb-6 lg:mb-6 min-h-[14rem] sm:min-h-[16rem] md:min-h-[18rem] lg:min-h-[17.0625rem] flex flex-col"
                    style={{
                      backgroundImage: `url(${PaymentGradient1})`,
                    }}
                  >
                    {/* Plan Name Header */}
                    <div 
                      className="flex items-center justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-6 rounded bg-cover bg-no-repeat bg-center h-10 sm:h-12 md:h-14 lg:h-[3.125rem] flex-shrink-0"
                      style={{
                        backgroundImage: `url(${PaymentGradient2})`,
                        backgroundSize: '100% auto',
                      }}
                    >
                      <h3 className="text-white font-inter text-sm sm:text-base md:text-lg lg:text-[1rem] font-semibold">
                        {plan.name}
                      </h3>
                    </div>
                    
                    {/* Price Section */}
                    <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 flex-grow">
                      <div className="text-black font-inter text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] font-bold inline-block mr-2">
                        {billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.quarterlyPrice}
                      </div>
                      <div className="text-black font-inter text-xs sm:text-sm md:text-base lg:text-[0.75rem] font-medium inline-block mb-2">
                        {plan.period}
                      </div>
                      <div className="text-black font-inter text-sm sm:text-base md:text-lg lg:text-[0.875rem] font-semibold mt-2">
                        {plan.description}
                      </div>
                    </div>

                    {/* Button */}
                    <button className="w-full rounded bg-black text-white font-inter text-sm sm:text-base md:text-lg lg:text-[0.875rem] font-semibold border-none cursor-pointer h-10 sm:h-12 md:h-14 lg:h-[3.125rem] flex-shrink-0">
                      {plan.buttonText}
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="ml-3 sm:ml-4 md:ml-5 lg:ml-5 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-3 pb-4 sm:pb-5 md:pb-6 lg:pb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white-400 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-[1.25rem] lg:h-[1.25rem] flex-shrink-0 mt-0.5"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white font-inter text-xs sm:text-sm md:text-base lg:text-[0.875rem] font-medium leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div>
              <h2 className="text-white font-inter text-xl sm:text-2xl md:text-3xl lg:text-[1.5rem] font-bold mb-6 sm:mb-7 md:mb-8 lg:mb-8">
                Compare tiers and features
              </h2>
              
              {comparisonData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6 sm:mb-7 md:mb-8 lg:mb-8">
                  <div 
                    className="rounded-[0.625rem] border border-[rgba(184,184,184,0.20)] bg-cover bg-no-repeat bg-center p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 min-h-fit overflow-x-auto"
                    style={{
                      backgroundImage: `url(${PaymentGradient3})`,
                    }}
                  >
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-3 sm:mb-4 min-w-[280px]">
                      <div className="text-white font-inter text-[0.6rem] sm:text-xs md:text-sm lg:text-lg xl:text-[1.25rem] font-semibold pr-1">
                        {category.category}
                      </div>
                      <div className="text-white font-inter text-[0.6rem] sm:text-xs md:text-sm lg:text-lg xl:text-[1.25rem] font-semibold text-center">
                        Starter
                      </div>
                      <div className="text-white font-inter text-[0.6rem] sm:text-xs md:text-sm lg:text-lg xl:text-[1.25rem] font-semibold text-center">
                        Launch
                      </div>
                      <div className="text-white font-inter text-[0.6rem] sm:text-xs md:text-sm lg:text-lg xl:text-[1.25rem] font-semibold text-center">
                        Scale
                      </div>
                    </div>
                    
                    <div className="h-[0.0625rem] bg-[rgba(184,184,184,0.20)] mb-4"></div>
                    
                    {/* Data Rows */}
                    <div className="min-w-[280px]">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4 py-1">
                            <div className="text-white font-inter text-[0.55rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-[1rem] font-medium pr-1 leading-tight sm:leading-normal">
                              {item.feature}
                            </div>
                            <div className={`font-inter text-[0.55rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-[1rem] font-medium text-center leading-tight sm:leading-normal ${
                              item.starter === 'No' ? 'text-[#E24848]' : 'text-white'
                            }`}>
                              {item.starter}
                            </div>
                            <div className={`font-inter text-[0.55rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-[1rem] font-medium text-center leading-tight sm:leading-normal ${
                              item.launch === 'No' ? 'text-[#E24848]' : 'text-white'
                            }`}>
                              {item.launch}
                            </div>
                            <div className={`font-inter text-[0.55rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-[1rem] font-medium text-center leading-tight sm:leading-normal ${
                              item.scale === 'No' ? 'text-[#E24848]' : 'text-white'
                            }`}>
                              {item.scale}
                            </div>
                          </div>
                          {itemIndex < category.items.length - 1 && (
                            <div className="h-[0.0625rem] bg-[rgba(184,184,184,0.20)] my-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment_Page;