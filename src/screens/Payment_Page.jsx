import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundPay from '../assets/backgroundPay.jpg';

const Payment_Page = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full items-start">
        {/* Starter Plan */}
        <div className="flex flex-col rounded-lg overflow-hidden">
          <div className="bg-blue-900 p-4 text-center">
            <h2 className="text-xl font-bold text-white">Starter</h2>
          </div>
          <div className="p-6 bg-indigo-900/30 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-5xl font-bold text-white">$9 <span className="text-sm font-normal ml-1">per startup / month</span></h3>
              <p className="text-white mt-1">Perfect for idea stage projects.</p>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold">
              Try Vertx
            </button>
          </div>
          
          {/* Features - Black Box */}
          <div className="bg-black p-6 max-h-64 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="space-y-4">
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Investor database</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Fundraising</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Customized one pager</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Standard support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Plan */}
        <div className="flex flex-col rounded-lg overflow-hidden h-auto">
          <div className="bg-blue-900 p-4 text-center">
            <h2 className="text-xl font-bold text-white">Launch</h2>
          </div>
          <div className="p-6 bg-indigo-900/30 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-5xl font-bold text-white">$29 <span className="text-sm font-normal ml-1">per startup / month</span></h3>
              <p className="text-white mt-1">Ideal for pre-seed startups.</p>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold">
              Start Fundraising
            </button>
          </div>
          
          {/* Features - Black Box */}
          <div className="bg-black p-6 max-h-64 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="space-y-3">
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Everything in Starter +</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access complete pitch reports</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access investor outreach</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access one pager analytics</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Everything in fundraising</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access flash</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scale Plan */}
        <div className="flex flex-col rounded-lg overflow-hidden">
          <div className="bg-blue-900 p-4 text-center">
            <h2 className="text-xl font-bold text-white">Scale</h2>
          </div>
          <div className="p-6 bg-indigo-900/30 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-5xl font-bold text-white">$49 <span className="text-sm font-normal ml-1">per startup / month</span></h3>
              <p className="text-white mt-1">Ideal for revenue generating startups.</p>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold">
              Master Fundraising
            </button>
          </div>
          
          {/* Features - Black Box */}
          <div className="bg-black p-6 max-h-64 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="space-y-4">
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Everything in Premium +</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Evaluate with high usage limits</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Mock pitching with high usage</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Generate unlimited pitch decks</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Investor outreach with high usage</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Flash with high usage limits</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access early features</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>1:1 Support</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment_Page;