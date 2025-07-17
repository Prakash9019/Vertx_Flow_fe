import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundStars from "../../assets/backgroundPay.png";
import starryBg from "../../assets/starry-sky.png";

const Payment_Page = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Define plans directly in state
  const [plans, setPlans] = useState([
    { 
      _id: "1", 
      name: "Starter", 
      monthlyPrice: 9,
      quarterlyPrice: 6,
      description: "Perfect for idea stage projects.",
      features: [
        "Investor database",
        "Fundraising",
        "Customized one pager", 
        "Standard support"
      ]
    },
    { 
      _id: "2", 
      name: "Launch", 
      monthlyPrice: 29,
      quarterlyPrice: 19,
      description: "Ideal for pre-seed startups.",
      features: [
        "Everything in Starter +",
        "Access complete pitch reports",
        "Access investor outreach",
        "Access one pager analytics",
        "Everything in fundraising",
        "Access flash",
        "Priority support"
      ]
    },
    { 
      _id: "3", 
      name: "Scale", 
      monthlyPrice: 49,
      quarterlyPrice: 33,
      description: "Ideal for revenue generating startups.",
      features: [
        "Everything in Launch +",
        "Evaluate with high usage limits",
        "Mock pitching with high usage",
        "Generate unlimited pitch decks",
        "Investor outreach with high usage",
        "Flash with high usage limits",
        "Access early features",
        "1:1 Support"
      ]
    }
  ]);
  
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
  
  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/payments/plans');
      const data = await response.json();
      
      if (data && data.plans) {
        // Transform API response to match our format
        const formattedPlans = data.plans.map((plan, index) => ({
          _id: (index + 1).toString(),
          name: plan.name,
          monthlyPrice: plan.price,
          quarterlyPrice: Math.round(plan.price * 0.67), // 33% discount
          description: plan.features[0], // First feature is the description
          features: plan.features.slice(1) // Rest are actual features
        }));
        
        setPlans(formattedPlans);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Failed to load plans. Using default plans.");
      // Keep default plans
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has existing subscription
  const [userSubscription, setUserSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const checkSubscription = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/payments/subscription', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
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
      const response = await fetch('http://localhost:5000/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.payments) {
          setPaymentHistory(data.payments);
        }
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
    }
  };
  
  // Plan gradients for styling
  const planGradients = {
    "Starter": "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
    "Launch": "linear-gradient(135deg, #4b2d83 0%, #1a7972 100%)",
    "Scale": "linear-gradient(135deg, #5a3b9c 0%, #23a59e 100%)"
  };

  const getCurrentPrice = (plan) => {
    return billingCycle === "quarterly" ? plan.quarterlyPrice : plan.monthlyPrice;
  };
  
  const getTotalAmount = (plan) => {
    // For quarterly, multiply by 3 months
    return billingCycle === "quarterly" ? plan.quarterlyPrice * 3 : plan.monthlyPrice;
  };
  
  // Handle subscription with Razorpay integration
  const handleSubscription = async (plan) => {
    const price = getCurrentPrice(plan);
    
    // Check if user is logged in - use authToken which is what GoogleAuthCallback sets
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      alert("Please log in to continue with your subscription");
      navigate('/login');
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Create order via API
      const orderResponse = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: plan.name,
          billingCycle
        })
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }
      
      const orderData = await orderResponse.json();
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
            
            // First call the test-verify endpoint to record the payment
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(verifyData)
            });
            
            if (!verifyResponse.ok) {
              throw new Error('Failed to verify payment with server');
            }
            
            const verifyResult = await verifyResponse.json();
            console.log('Payment verified:', verifyResult);
            
            // Refresh subscription data
            await checkSubscription();
            
            setProcessingPayment(false);
            alert(`Subscription for ${plan.name} plan activated successfully! Valid until ${new Date(verifyResult.subscription.expiryDate).toLocaleDateString()}`);
            navigate('/homepage');
          } catch (error) {
            console.error('Error verifying payment:', error);
            setProcessingPayment(false);
            alert(`Payment processed but there was an issue updating your subscription. Please contact support.`);
            navigate('/homepage');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || "",
          email: localStorage.getItem('userEmail') || ""
        },
        theme: {
          color: "#6b46c1"
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
            console.log("Payment modal closed");
          }
        }
      };
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      setProcessingPayment(false);
      alert("Payment gateway error. Please try again later.");
    }
  };

  const getButtonText = (planName) => {
    switch(planName) {
      case "Starter": return "Try Vertx";
      case "Launch": return "Start Fundraising";
      case "Scale": return "Master Fundraising";
      default: return "Get Started";
    }
  };

  return (
    <div 
      className="w-full bg-black text-white"
      style={{
        height: 'auto',
        backgroundImage: `url(${backgroundStars})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Start Fundraising Today. Level Up Anytime.
          </h1>
          <p className="text-base text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto">
            Every founder's journey is different, start where you are, unlock what you need. Grow with Vertx.<br />
            <span className="font-semibold">Designed for Founders. Built for Outcomes.</span>
          </p>
          <p className="text-sm">
            (For Incubators, Accelerators, Universities, Enterprises,{' '}
            <a href="#" className="text-purple-400 underline hover:text-purple-300 transition-colors">
              sign up here
            </a>
            )
          </p>
        </div>

        {/* Current Subscription Info (if exists) */}
        {userSubscription && (
          <div className="max-w-4xl mx-auto mb-8 p-4 border border-purple-500 rounded-lg bg-black/50">
            <h2 className="text-xl font-bold mb-2">Your Current Subscription</h2>
            <div className="flex justify-between items-center">
              <div>
                <p><span className="font-semibold">Plan:</span> {userSubscription.planName}</p>
                <p><span className="font-semibold">Expires:</span> {new Date(userSubscription.expiryDate).toLocaleDateString()}</p>
              </div>
              <button 
                className="text-sm underline text-purple-400 hover:text-purple-300"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide Payment History' : 'View Payment History'}
              </button>
            </div>
            
            {/* Payment History */}
            {showHistory && paymentHistory.length > 0 && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-2">Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Plan</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment, idx) => (
                        <tr key={idx} className="border-b border-gray-800">
                          <td className="py-2">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                          <td className="py-2">{payment.planName}</td>
                          <td className="py-2">${payment.amount/100} {payment.currency}</td>
                          <td className="py-2">{payment.invoiceNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <span className={`font-bold text-sm ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}>
            MONTHLY
          </span>
          <label className="relative inline-block w-14 h-7 cursor-pointer">
            <input
              type="checkbox"
              checked={billingCycle === "quarterly"}
              onChange={() => {
                const newCycle = billingCycle === "monthly" ? "quarterly" : "monthly";
                setBillingCycle(newCycle);
                console.log(`Billing cycle changed to ${newCycle}`);
              }}
              className="opacity-0 w-0 h-0"
            />
            <span className="absolute inset-0 bg-gray-600 border-2 border-white rounded-full transition-all duration-300 ease-in-out">
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                  billingCycle === "quarterly" ? "translate-x-7" : ""
                }`}
              />
            </span>
          </label>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-sm ${billingCycle === "quarterly" ? "text-white" : "text-gray-400"}`}>
              QUARTERLY
            </span>
            <span className="bg-white text-black text-xs px-3 py-1 rounded-full font-bold">
              SAVE 33%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-full text-center text-xl">Loading plans...</p>
            ) : error ? (
              <p className="col-span-full text-center text-red-400 text-xl">{error}</p>
            ) : (
              plans.map((plan, idx) => (
                <div
                  key={plan._id || idx}
                  className="relative rounded-lg overflow-hidden"
                  style={{ 
                    background: '#000000',
                    border: '1px solid rgba(184, 184, 184, 0.2)',
                    borderRadius: '8px',
                    width: '320px',
                    height: '608px',
                    margin: '0 auto',
                    position: 'relative'
                  }}
                >
                  {/* Plan Header - Top Section with Starry Background */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '273px',
                      backgroundImage: `url(${starryBg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px'
                    }}
                  >
                    {/* Plan Name Box */}
                    <div 
                      style={{
                        position: 'absolute',
                        width: '296.43px',
                        height: '50px',
                        left: '11px',  /* 276px - 265px = 11px */
                        top: '13px',   /* 375px - 362px = 13px */
                      }}
                    >
                      <div 
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${starryBg})`,
                          backgroundSize: 'cover',
                          border: '1px solid rgba(184, 184, 184, 0.13)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span style={{
                          fontFamily: 'Inter',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '16px',
                          lineHeight: '19px',
                          color: '#FFFFFF'
                        }}>
                          {plan.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '251.43px',
                      height: '65px',
                      left: '23px', /* 288px - 265px = 23px */
                      top: '98px'  /* 460px - 362px = 98px */
                    }}
                  >
                    <div style={{
                      fontFamily: 'Inter',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      fontSize: '36px',
                      lineHeight: '44px',
                      color: '#FFFFFF'
                    }}>
                      ${getCurrentPrice(plan)}
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        marginLeft: '5px'
                      }}>
                        per startup {billingCycle === "quarterly" ? "/ month (billed quarterly)" : "/ month"}
                      </span>
                    </div>
                    
                    <p style={{
                      fontFamily: 'Inter',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#FFFFFF',
                      marginTop: '10px'
                    }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '296px',
                      height: '50px',
                      left: '11px', /* 276px - 265px = 11px */
                      top: '206px'  /* 568px - 362px = 206px */
                    }}
                  >
                    <button
                      style={{
                        width: '100%',
                        height: '100%',
                        background: '#000000',
                        borderRadius: '4px',
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#FFFFFF',
                        border: processingPayment ? '1px solid rgba(184, 184, 184, 0.3)' : '1px solid rgba(184, 184, 184, 0.5)',
                        opacity: processingPayment ? 0.7 : 1,
                        cursor: processingPayment ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => handleSubscription(plan)}
                      disabled={processingPayment}
                    >
                      {processingPayment ? 'Processing...' : getButtonText(plan.name)}
                    </button>
                  </div>

                  {/* Features Section */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '280px',
                      left: '20px',
                      top: '280px',
                      bottom: '20px',
                      overflowY: 'auto'
                    }}
                  >
                    {plan.features.map((feature, i) => (
                      <div 
                        key={i} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}
                      >
                        <svg
                          style={{
                            width: '16px',
                            height: '16px',
                            marginRight: '10px',
                            color: '#FFFFFF',
                            flexShrink: 0
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span style={{
                          fontFamily: 'Inter',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '17px',
                          color: '#FFFFFF'
                        }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment_Page;