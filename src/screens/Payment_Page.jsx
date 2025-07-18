import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Galaxy from "../assets/Galaxy.png";
import PaymentGradient1 from '../assets/PaymentGradient1.png'; 
import PaymentGradient2 from '../assets/PaymentGradient2.png'; 
import PaymentGradient3 from '../assets/PaymentGradient3.png';

const Payment_Page = () => {
  const [billingCycle, setBillingCycle] = useState('QUARTERLY');

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
    }
  ];

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

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div
          style={{
            minHeight: '100vh',
            backgroundImage: `url(${Galaxy})`,
            backgroundAttachment: 'fixed', // Keeps the image fixed on scroll
            backgroundSize: '100% 100%',   // Stretch horizontally only
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center', // Align at the top
          }}
        >
          {/* Background texture/pattern */}
          <div className="absolute inset-0  opacity-50"></div>
          
          <div className="relative z-10 px-7 py-16">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-white text-center font-bold mb-6" style={{ fontFamily: 'Inter', fontSize: '2rem', fontWeight: '700' }}>
                Start Fundraising Today. Level Up Anytime.
              </h1>
              <p className="text-center mb-4" style={{ color: '#B8B8B8', fontFamily: 'Inter', fontSize: '0.875rem', fontWeight: '400' }}>
                Every founder's journey is different, start where you are, unlock what you need. Grow with Vertx.
              </p>
              <p className="text-center" style={{ color: '#B8B8B8', fontFamily: 'Inter', fontSize: '0.875rem', fontWeight: '400' }}>
                Designed for Founders. Built for Outcomes.
              </p>
              <p className="text-center mt-2" style={{ color: '#FFF', fontFamily: 'Inter', fontSize: '0.875rem', fontWeight: '600' }}>
                (For Incubators, Accelerators, Universities, Enterprises,{' '}
                <span className="cursor-pointer" style={{ color: '#CF94FF', fontFamily: 'Inter', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'underline' }}>
                  sign up here
                </span>
                )
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center mb-12">
              <span className={`mr-4`} style={{ 
                color: billingCycle === 'MONTHLY' ? '#FFF' : '#B8B8B8',
                fontFamily: 'Inter',
                fontSize: '0.875rem',
                fontWeight: '700'
              }}>
                MONTHLY
              </span>
              <div className="relative">
                <button
                  onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'QUARTERLY' : 'MONTHLY')}
                  className="relative flex items-center"
                  style={{ 
                    width: '3.125rem',
                    height: '1.5rem'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="26" viewBox="0 0 52 26" fill="none">
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
              <span className={`ml-4`} style={{ 
                color: billingCycle === 'QUARTERLY' ? '#FFF' : '#B8B8B8',
                fontFamily: 'Inter',
                fontSize: '0.875rem',
                fontWeight: '700'
              }}>
                QUARTERLY
              </span>
              {/* Always show SAVE 33% since both options are discounted */}
              <div className="ml-2  py-1 rounded" style={{ 
                width: '3rem',
                height: '1.0625rem',
                borderRadius: '6.25rem',
                background: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ 
                  color: '#000',
                  fontFamily: 'Inter',
                  fontSize: '0.4375rem',
                  fontWeight: '700'
                }}>
                  SAVE 33%
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="mb-16" style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.96rem'
            }}>
              {plans.map((plan, index) => (
                <div key={index} style={{
                  height: '38rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(184, 184, 184, 0.20)',
                  background: '#000',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Main Content Container */}
                  <div
                    style={{
                      height: '17.0625rem',
                      borderRadius: '0.5rem',
                      backgroundImage: `url(${PaymentGradient1})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      padding: '1.5rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {/* Plan Name Header */}
                    <div style={{
                      height: '3.125rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      borderRadius: '0.25rem',
                      backgroundImage: `url(${PaymentGradient2})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '100% auto', // Stretches horizontally only
                      backgroundPosition: 'center'
                    }}>
                      <h3 style={{
                        color: '#FFF',
                        fontFamily: 'Inter',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {plan.name}
                      </h3>
                    </div>
                    
                    {/* Price Section */}
                    <div className="mb-6">
                      <div style={{
                        color: '#000',
                        fontFamily: 'Inter',
                        fontSize: '2.25rem',
                        fontWeight: '700',
                        display: 'inline-block',
                        marginRight: '0.5rem'
                      }}>
                        {billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.quarterlyPrice}
                      </div>
                      <div style={{
                        color: '#000',
                        fontFamily: 'Inter',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}>
                        {plan.period}
                      </div>
                      <div style={{
                        color: '#000',
                        fontFamily: 'Inter',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginTop: '0.5rem'
                      }}>
                        {plan.description}
                      </div>
                    </div>

                    {/* Button */}
                    <button style={{
                      width: '100%',
                      height: '3.125rem',
                      borderRadius: '0.25rem',
                      background: '#000',
                      color: '#FFF',
                      fontFamily: 'Inter',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      {plan.buttonText}
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="ml-5 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white-400 mr-3"
                          style={{
                            width: '1.25rem',
                            height: '1.25rem'
                          }}
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <span style={{
                          color: '#FFF',
                          fontFamily: 'Inter',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
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
              <h2 style={{
                color: '#FFF',
                fontFamily: 'Inter',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '2rem'
              }}>
                Compare tiers and features
              </h2>
              
              {comparisonData.map((category, categoryIndex) => {
                const getContainerHeight = () => {
                  switch(categoryIndex) {
                    case 0: return '21.4375rem';
                    case 1: 
                    case 2: return '15.125rem';
                    case 3:
                    case 4: return '12.5rem';
                    case 5: return '9.0625rem';
                    default: return '21.4375rem';
                  }
                };

                return (
                  <div key={categoryIndex} className="mb-8">
                    <div style={{
                      height: getContainerHeight(),
                      borderRadius: '0.625rem',
                      border: '1px solid rgba(184, 184, 184, 0.20)',
                      backgroundImage: `url(${PaymentGradient3})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      padding: '1.5rem'
                    }}>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div style={{
                          color: '#FFF',
                          fontFamily: 'Inter',
                          fontSize: '1.25rem',
                          fontWeight: '600'
                        }}>
                          {category.category}
                        </div>
                        <div style={{
                          color: '#FFF',
                          fontFamily: 'Inter',
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          Starter
                        </div>
                        <div style={{
                          color: '#FFF',
                          fontFamily: 'Inter',
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          Launch
                        </div>
                        <div style={{
                          color: '#FFF',
                          fontFamily: 'Inter',
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          Scale
                        </div>
                      </div>
                      
                      <div style={{
                        height: '0.0625rem',
                        background: 'rgba(184, 184, 184, 0.20)',
                        margin: '0 0 1rem 0'
                      }}></div>
                      
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <div className="grid grid-cols-4 gap-4 py-1">
                            <div style={{
                              color: '#FFF',
                              fontFamily: 'Inter',
                              fontSize: '1rem',
                              fontWeight: '500'
                            }}>
                              {item.feature}
                            </div>
                            <div style={{
                              color: item.starter === 'No' ? '#E24848' : '#FFF',
                              fontFamily: 'Inter',
                              fontSize: '1rem',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}>
                              {item.starter}
                            </div>
                            <div style={{
                              color: item.launch === 'No' ? '#E24848' : '#FFF',
                              fontFamily: 'Inter',
                              fontSize: '1rem',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}>
                              {item.launch}
                            </div>
                            <div style={{
                              color: item.scale === 'No' ? '#E24848' : '#FFF',
                              fontFamily: 'Inter',
                              fontSize: '1rem',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}>
                              {item.scale}
                            </div>
                          </div>
                          {itemIndex < category.items.length - 1 && (
                            <div style={{
                              height: '0.0625rem',
                              background: 'rgba(184, 184, 184, 0.20)',
                              margin: '0.5rem 0'
                            }}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment_Page;