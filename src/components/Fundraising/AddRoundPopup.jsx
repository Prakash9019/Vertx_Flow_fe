import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import rectangleImage from '../../assets/Rectangle 82.png';
import { usePermissions } from '../../hooks/usePermissions';
import API_KEY from '../../../key';
import Icon from "../../assets/info.svg"
// import { useState } from "react";

function AddRoundPopup({ isOpen, onClose, onNext }) {
  // console.log(isOpen, onClose, onNext);
  const { hasFullAccess, canCreate, userRole } = usePermissions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const [hoveredOption, setHoveredOption] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [inputAmount, setInputAmount] = useState("")
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)
  const [stepHistory, setStepHistory] = useState([1])
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [permissionError, setPermissionError] = useState(""); // NEW
  // Format number with US comma system
  const formatUSNumber = (num) => {
    const numStr = num.toString()
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  };

  function triggerConfetti() {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };
  
    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }
  
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  
  useEffect(() => {
    if (showSuccess) {
      triggerConfetti();
    }
  }, [showSuccess]);

  
  // Add this validation function after other utility functions
  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    
    // For HTML date input, the format is YYYY-MM-DD
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date instanceof Date && !isNaN(date) && date >= today;
  };
  // Update handleInputChange function
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (isAmountStep()) {
      const numericValue = value.replace(/[^0-9]/g, '');
      setInputAmount(numericValue);
      setShowValidationError(false);
    } else if (isDateStep()) {
      // For date input, store the YYYY-MM-DD format directly
      setInputAmount(value);
      setShowValidationError(false);
    } else {
      setInputAmount(value);
      setShowValidationError(false);
    }
  }  // Get validation error message
  const getValidationError = () => {
    if (!inputAmount) return ""
    
    if (isAmountStep()) {
      const amount = Number.parseInt(inputAmount)
      
      if (currentStep === 4) {
        // Step 4: Planning to raise amount
        const isBridgeRound = formData.isBridgeRound;
        if (isBridgeRound) {
          // Bridge round: $10,000 to $100,000
          if (amount < 10000) {
            return "Must be at least $10,000"
          }
          if (amount > 100000) {
            return "Cannot be greater than $100,000"
          }
        } else {
          // Primary round: $10,000 to $1,000,000
          if (amount < 10000) {
            return "Must be at least $10,000"
          }
          if (amount > 1000000) {
            return "Cannot be greater than $1,000,000"
          }
        }
      } else if (currentStep === 5) {
        // Step 5: Amount wired/committed - max $5,000,000
        if (amount < 0) {
          return "Cannot be negative"
        }
        if (amount > 5000000) {
          return "Cannot be greater than $5,000,000"
        }
      } else if (currentStep === 11) {
        // Step 11: Valuation Cap - general validation
        if (amount < 10000) {
          return "Must be at least $10,000"
        }
        if (amount > 100000000) {
          return "Cannot be greater than $100,000,000"
        }
      }
    } else if ([13, 14].includes(currentStep)) {
      // Percentage validations for discount and interest rates
      const percentage = Number.parseFloat(inputAmount)
      
      if (currentStep === 13) {
        // Discount Rate: 15% to 25%
        if (percentage < 15) {
          return "Must be at least 15%"
        }
        if (percentage > 25) {
          return "Cannot be greater than 25%"
        }
      } else if (currentStep === 14) {
        // Interest Rate: 4% to 8%
        if (percentage < 4) {
          return "Must be at least 4%"
        }
        if (percentage > 8) {
          return "Cannot be greater than 8%"
        }
      }
    } else if (currentStep === 15) {
      // Conversion Term: 12 to 14 months
      const months = Number.parseInt(inputAmount)
      if (months < 12) {
        return "Must be at least 12 months"
      }
      if (months > 14) {
        return "Cannot be greater than 14 months"
      }
    } else if (currentStep === 18) {
      // Target runway: 3 to 6 months
      const runway = Number.parseInt(inputAmount)
      if (runway < 3) {
        return "Must be at least 3 months"
      }
      if (runway > 6) {
        return "Cannot be greater than 6 months"
      }
    } else if (isDateStep()) {
      if (!isValidDate(inputAmount)) {
        return 'Please select a valid future date';
      }
    }
    return ""
  }  // Check if current step is valid for proceeding
  const isStepValid = () => {
    if (isInputStep()) {
      if (!inputAmount || inputAmount.trim() === "") {
        return false;
      }
      
      // Use the same validation logic as getValidationError
      const validationError = getValidationError();
      return validationError === "";
    } else if (isMultiSelectStep()) {
      return selectedMultiOptions.length > 0
    } else if (isPlanningStep()) {
      return true // Planning step doesn't require validation
    } else {
      return selectedOption !== ""
    }
  }// Define options for each step
  const getOptionsForStep = () => {
    switch (currentStep) {      case 1:
        return ["Yes", "No"]
      case 2:
        const baseOptions = ["Angel", "Pre-Seed", "Seed", "Series A", "Series B"];
        // For non-bridge rounds, filter out the previously selected round if any
        if (!formData.isBridgeRound && formData.lastPrimaryRoundType) {
          return baseOptions.filter(option => option !== formData.lastPrimaryRoundType);
        }
        return baseOptions;      case 3:
        // Get options based on whether it's a bridge round or not
        const lastRound = formData.lastPrimaryRoundType;
        
        if (formData.isBridgeRound) {
          // Bridge round options
          if (lastRound === "Angel") {
            return ["Angel 1 Bridge", "Angel 2 Bridge", "Angel 3 Bridge", "Angel 4 Bridge"]
          } else if (lastRound === "Pre-Seed") {
            return ["Pre-Seed 1 Bridge", "Pre-Seed 2 Bridge", "Pre-Seed 3 Bridge", "Pre-Seed 4 Bridge"]
          } else if (lastRound === "Seed") {
            return ["Seed 1 Bridge", "Seed 2 Bridge", "Seed 3 Bridge", "Seed 4 Bridge"]
          } else if (lastRound === "Series A") {
            return ["Series A 1 Bridge", "Series A 2 Bridge", "Series A 3 Bridge", "Series A 4 Bridge"]
          } else if (lastRound === "Series B") {
            return ["Series B 1 Bridge", "Series B 2 Bridge", "Series B 3 Bridge", "Series B 4 Bridge"]
          } else {
            return ["Bridge 1", "Bridge 2", "Bridge 3", "Bridge 4"]
          }        } else {
          // Non-bridge round options - show next round progression based on last primary round
          if (lastRound === "Angel") {
            return ["Pre-Seed", "Seed", "Series A", "Series B"]
          } else if (lastRound === "Pre-Seed") {
            return ["Seed", "Series A", "Series B"]
          } else if (lastRound === "Seed") {
            return ["Series A", "Series B"]
          } else if (lastRound === "Series A") {
            return ["Series B"]
          } else if (lastRound === "Series B") {
            return ["Series C"] // Or whatever comes after Series B
          } else {
            // Fallback for unknown last round
            return ["Pre-Seed", "Seed", "Series A", "Series B"]
          }
        }case 6:
        return ["To Be Determined", "Priced Round (Preferred)", "Priced Round (Common)", "Convertible Note", "SAFE"]
      case 7:
        const selectedInstrument = formData.fundraisingInstrument;
        if (selectedInstrument === "Convertible Note") {
          return ["Capped", "Uncapped"];
        } else if (selectedInstrument === "SAFE") {
          return ["Capped", "Uncapped"];
        } else {
          // Default to SAFE options
          return ["Capped", "Uncapped"];
        }
      case 8:
        return ["Yes", "No"]
      case 9:
        return ["Yes", "No"]
      case 12:
        return ["Pre-Money", "Post-Money"]
      case 16:
        return ["Accelerators", "Individual Angels"]
      case 17:
        return ["Accelerators", "Individual Angels"]
      default:
        return []
    }
  }  // Get question text for current step
  const getQuestionText = () => {
    switch (currentStep) {
      case 1:
        return "Are you raising a bridge or an extension round?"
      case 2:
        // Filter out the last primary round from options
        const isBridgeRound = formData.isBridgeRound;
        if (isBridgeRound) {
          return "What was the last primary round you raised?"
        } else {
          return "What was the last primary round you raised?"
        }
      case 3:
        const isBridge = formData.isBridgeRound;
        if (isBridge) {
          return "Which Bridge or Extension are you raising?"        } else {
          return "Which round are you raising?";
        }
      case 4:
        const isBridgeForAmount = formData.isBridgeRound;
        if (isBridgeForAmount) {
          return "How much money are you planning to raise for this bridge round?";
        } else {
          return "How much money are you planning to raise for this round?";
        }
      case 5:
        return "How much money has already been wired or committed?";
      case 6:
        return "What fundraising instrument do you plan to use?";
      case 7:
        const selectedInstrument = formData.fundraisingInstrument;
        if (selectedInstrument === "SAFE") {
          return "What type of SAFE do you plan to use?";
        } else if (selectedInstrument === "Convertible Note") {
          return "What type of Convertible Note do you plan to use?";
        } else if (selectedInstrument && selectedInstrument !== "To Be Determined") {
          return `What type of ${selectedInstrument} do you plan to use?`;
        } else {
          return "What type of SAFE do you plan to use?";
        }
      case 8:
        return "Has a lead investor formally committed?";
      case 9:
        return "Have you signed a term sheet?";
      case 10:
        return "When are you planning to close this round by?";
      case 11:
        return "Valuation Cap?";
      case 12:
        return "Valuation Cap Type?";
      case 13:
        return "Discount Rate?";
      case 14:
        return "Interest Rate?";
      case 15:
        return "Conversion Term";
      case 16:
        return "Planning to sell around NN% of your company at this round";
      case 17:
        return "What type of investors are you aiming to get into this round?";
      case 18:
        return "What is your target runway for this round?";
      default:
        return "";
    }
  };  // Get subheading text
  const getSubheadingText = () => {
    switch (currentStep) {
      case 4:
        const isBridgeRound = formData.isBridgeRound;
        
        if (isBridgeRound) {
          return "The average Bridge round amount is between $10,000 and $100,000"
        } else {
          return "The average round amount is between $10,000 and $1,000,000"
        }
      case 5:
        return "Do not include amounts that have been soft-committed, such as investors telling you a verbal 'yes' or 'maybe'. Maximum amount: $5,000,000"
      case 12:
        return "Post-Money is most common and is more investor-friendly."
      case 13:
        return "The most common discount value is 20%, but it typically ranges from 15% to 25%"
      case 14:
        return "Typically between 4% and 8%"
      case 15:
        return "Typically between 12 and 14 months"
      case 17:
        return "The usual Angel Bridge round primarily targets Individual Angels"
      case 18:
        return "The usual round should provide at least 3 to 6 months of runway"
      default:
        return ""
    }
  }

  // Get tooltip content for current step
  const getTooltipContent = () => {
    switch (currentStep) {      case 1:
        return "Answer 'Yes' if you're raising a bridge or extension round (smaller financing between main stages). Answer 'No' if you're raising a primary round (main funding stages like Angel, Pre-Seed, Seed, Series A, etc.)."
      case 3:
        return "Angel 1 Bridge means you're raising your first bridge round at the Angel stage. If you've already raised one, select the next number."
      case 6:
        return "This is the legal contract to issue and sell shares to investors"
      default:
        return ""
    }
  }

  // Determine if info icon should be shown
  const shouldShowInfoIcon = () => {
    return [1, 3, 6, 7, 11, 12, 13, 14, 15].includes(currentStep)
  }

  // Determine if this is an input step
  const isInputStep = () => {
    return [4, 5, 10, 11, 13, 14, 15, 18].includes(currentStep)
  }

  // Determine if this is an amount step (dollar input with number validation)
  const isAmountStep = () => {
    return [4, 5, 11].includes(currentStep)
  }

  // Determine if this is a date step
  const isDateStep = () => {
    return currentStep === 10
  }

  // Determine if this is a multi-select step
  const isMultiSelectStep = () => {
    return currentStep === 17
  }
  // Determine if this is the planning step
  const isPlanningStep = () => {
    return currentStep === 16
  }
  // Get the current round name for dynamic messages
  const getCurrentRoundName = () => {
    if (formData.isBridgeRound && formData.bridgeOrExtensionType) {
      return formData.bridgeOrExtensionType;
    } else if (!formData.isBridgeRound && formData.lastPrimaryRoundType) {
      // For non-bridge rounds, we need to determine the next round number
      // Since we don't have historical data, we'll use a default increment pattern
      const roundType = formData.lastPrimaryRoundType;
      
      // Generate a round number (in real app, this would come from backend)
      // For now, we'll use a simple pattern based on round type
      const roundNumbers = {
        'Angel': '2', // Assuming they've done Angel 1
        'Pre-Seed': '2',
        'Seed': '2', 
        'Series A': '2',
        'Series B': '2'
      };
      
      const roundNumber = roundNumbers[roundType] || '2';
      return `${roundType} ${roundNumber}`;
    }
    return "Round";
  }

  // Determine if dropdown should show
  const shouldShowDropdown = () => {
    return [1, 2, 3, 6, 7, 8, 9, 12, 17].includes(currentStep)
  }
  // Get dropdown height based on step
  const getDropdownHeight = () => {
    if (currentStep === 6) return "11rem"; // 5 options * 2.2rem each
    if (currentStep === 2 || currentStep === 3) return "11rem"; // 5 options each
    return "5.4375rem"
  }

  // Check if scrolling is needed
  const needsScrolling = () => {
    return [2, 3, 6].includes(currentStep)
  }

  // Get input symbol
  const getInputSymbol = () => {
    if (isAmountStep()) return "$"
    if ([13, 14].includes(currentStep)) return "%"
    return ""
  }
  // Get placeholder text
  const getPlaceholderText = () => {
    if (currentStep === 10) return "Select date"
    return ""
  }

  const options = getOptionsForStep()

  const handleOptionSelect = (option) => {
    if (isMultiSelectStep()) {
      setSelectedMultiOptions((prev) => {
        if (prev.includes(option)) {
          return prev.filter((item) => item !== option)
        } else {
          return [...prev, option]
        }
      })
    } else {
      setSelectedOption(option)
      setIsDropdownOpen(false)
    }
  }

  const removeMultiOption = (optionToRemove) => {
    setSelectedMultiOptions((prev) => prev.filter((item) => item !== optionToRemove))
  }

  const toggleDropdown = () => {
    if (!isInputStep() && !isPlanningStep()) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return null;
    // dateStr is already in YYYY-MM-DD format from HTML date input
    const date = new Date(dateStr);
    return date.toISOString();
  };

  // Add this function to get the auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    return token;
  };
  const handleNext = () => {
    // Check permissions before allowing any funding round creation
    if (!canCreate) {
      // alert('You do not have permission to create funding rounds. Please contact your founder for access.');
      setPermissionError("You do not have permission to create funding rounds. Please contact your founder for access.");
      setTimeout(() => setPermissionError(""), 3000); // Hide after 3s
      return;
    }
    
    // Validate current step before proceeding
    if (!isStepValid()) {
      if (isInputStep()) {
        setShowValidationError(true)
      }
      return
    }

    // Set button loading state for all steps except the final API submission
    if (currentStep !== 18) {
      setIsButtonLoading(true);
    }

    let currentStepLocalData = {}; // Use a local variable for current step's data
    const getFieldKeyForStep = (step) => {
      // This function maps step number to the backend field key
      // Ensure these keys match your backend model expectations (from FundingRound.js)
      switch (step) {
        case 1: return 'isBridgeRound';
        case 2: return 'lastPrimaryRoundType';
        case 3: return 'bridgeOrExtensionType';
        case 4: return 'plannedRaiseAmount';
        case 5: return 'amountWiredOrCommitted';        case 6: return 'fundraisingInstrument';
        case 7: return 'instrumentType';
        case 8: return 'isLeadInvestorCommitted';
        case 9: return 'isTermSheetSigned';
        case 10: return 'plannedCloseDate';
        case 11: return 'valuationCap';
        case 12: return 'valuationCapType';
        case 13: return 'discountRate';
        case 14: return 'interestRate';
        case 15: return 'conversionTerm';
        case 16: // Assuming step 16 & 17 both contribute to targetInvestorTypes
        case 17: return 'targetInvestorTypes';
        case 18: return 'targetRunway';
        default: return `step${step}_unmapped_data`; // Fallback key for unmapped steps
      }
    };

    const fieldKey = getFieldKeyForStep(currentStep);
    let valueForStep;

    if (isInputStep()) {
      // For amount, discount, interest rate steps, parse as float
      if (isAmountStep() || [13, 14].includes(currentStep)) {
        valueForStep = parseFloat(String(inputAmount).replace(/,/g, '')) || null; // Use null if parsing fails
      } else {
        valueForStep = inputAmount; // Keep as string for dates, terms, runway etc.
      }
    } else if (isMultiSelectStep()) { // Step 17
      valueForStep = selectedMultiOptions;    } else { // Dropdown single select steps (1,2,3,6,7,8,9,12,16)
      if (currentStep === 1) {
        // Step 1: Handle "Yes" (bridge/extension) vs "No" (primary round)
        valueForStep = selectedOption === 'Yes';
      } else if (selectedOption === 'Yes') {
        valueForStep = true;
      } else if (selectedOption === 'No') {
        valueForStep = false;
      } else {
        valueForStep = selectedOption;
      }
    }
    currentStepLocalData[fieldKey] = valueForStep;

    // Special handling for targetInvestorTypes if steps 16 and 17 are additive or conditional
    // This example assumes step 17 is the definitive multi-select for targetInvestorTypes.
    // If step 16 is also for targetInvestorTypes and is single-select, you might need to combine them.
    // For simplicity now, step 17's multi-select will overwrite step 16 if both use 'targetInvestorTypes'.
    // If step 16 should be a separate field, assign it a unique key in getFieldKeyForStep.

    const updatedFormData = { ...formData, ...currentStepLocalData };
    setFormData(updatedFormData);

    // When reaching the last step (18)
    if (currentStep === 18) {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const token = getAuthToken();
        
        // Prepare the data for API submission
        const apiData = {
          isBridgeRound: updatedFormData.isBridgeRound,
          lastPrimaryRoundType: updatedFormData.lastPrimaryRoundType,
          bridgeOrExtensionType: updatedFormData.bridgeOrExtensionType,
          plannedRaiseAmount: parseFloat(updatedFormData.plannedRaiseAmount),
          amountWiredOrCommitted: parseFloat(updatedFormData.amountWiredOrCommitted),          fundraisingInstrument: updatedFormData.fundraisingInstrument,
          instrumentType: updatedFormData.instrumentType,
          // Make sure these required fields are always included
          isLeadInvestorCommitted: updatedFormData.isLeadInvestorCommitted ?? false,
          isTermSheetSigned: updatedFormData.isTermSheetSigned ?? false,
          plannedCloseDate: formatDateForAPI(updatedFormData.plannedCloseDate),
          valuationCap: updatedFormData.valuationCap ? parseFloat(updatedFormData.valuationCap) : undefined,
          valuationCapType: updatedFormData.valuationCapType,
          discountRate: updatedFormData.discountRate ? parseFloat(updatedFormData.discountRate) : undefined,
          interestRate: updatedFormData.interestRate ? parseFloat(updatedFormData.interestRate) : undefined,
          conversionTerm: updatedFormData.conversionTerm,
          targetInvestorTypes: updatedFormData.targetInvestorTypes,
          targetRunway: updatedFormData.targetRunway
        };

        // Make the API call
        fetch(`${API_KEY}/api/funding-rounds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(apiData)
        })
        .then(async response => {
          // console.log('API Response Status:', response.status); // Log response status
          // console.log('API Response Headers:', Object.fromEntries(response.headers.entries())); // Log headers
          
          let data;
          const contentType = response.headers.get("content-type");
          // console.log('Content-Type:', contentType); // Log content type
          
          try {
            const text = await response.text();
            // console.log('Raw response:', text); // Log raw response
            
            if (contentType && contentType.indexOf("application/json") !== -1) {
              data = JSON.parse(text);
            } else {
              throw new Error(`Invalid response format. Status: ${response.status}, Content-Type: ${contentType}, Body: ${text}`);
            }
          } catch (error) {
            console.error('Error parsing response:', error);
            throw error;
          }
          
          if (!response.ok) {
            throw new Error(data.message || data.error || data.msg || 'Failed to create funding round');
          }
          return data;
        })
        .then(data => {
          setIsLoading(false);
          setShowSuccess(true);
      setTimeout(() => {
            if (onNext) {
              onNext(data);
            }
          }, 3000);
        })
        .catch(error => {
          console.error('Detailed error:', error); // Debug log
          setIsLoading(false);
          setError(error.message || 'An error occurred while creating the funding round');
        });
      } catch (error) {
        setIsLoading(false);
        setError(error.message);
        console.error('Error in handleNext:', error);
      }      return;
    }    
      // Handle special flow for round type selection (step 1)
    if (currentStep === 1) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        if (selectedOption === "No") {
          // Skip step 3 (bridge/extension type) for primary rounds
          setCurrentStep(2)
        } else {
          // Go to step 2 for bridge/extension rounds
          setCurrentStep(2)
        }
        setSelectedOption("")
      }, 800);
    } else if (currentStep === 2) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        if (formData.isBridgeRound) {
          // Go to step 3 for bridge/extension rounds
          setCurrentStep(3)
        } else {
          // Skip step 3 for primary rounds
          setCurrentStep(4)
        }
        setSelectedOption("")
      }, 800);
    } else if (currentStep === 3) {
      // Bridge/extension type selection - always go to step 4 next
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(4)
        setSelectedOption("")
      }, 800);
    } else if (currentStep === 4) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(5)
        setInputAmount("")
      }, 800);
    }    // Handle special flow for fundraising instrument selection
    if (currentStep === 6) {
      setTimeout(() => {
        setIsButtonLoading(false);
        if (selectedOption === "To Be Determined") {
          // Skip directly to date for "To Be Determined"
          setStepHistory([...stepHistory, currentStep])
          setCurrentStep(10)
          setSelectedOption("")
        } else if (selectedOption === "SAFE" || selectedOption === "Convertible Note") {
          // Go through instrument-specific flow for both SAFE and Convertible Note
          setStepHistory([...stepHistory, currentStep])
          setCurrentStep(7)
          setSelectedOption("")
        } else {
          // For other instruments (Priced Round), go to step 8
          setStepHistory([...stepHistory, currentStep])
          setCurrentStep(8)
          setSelectedOption("")
        }
      }, 800);
    } else if (currentStep === 5) {
      // After step 5 (amount wired/committed), go to step 6 (fundraising instrument)
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(6)
        setInputAmount("")
      }, 800);
    } else if (currentStep === 7) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(8)
        setSelectedOption("")
      }, 800);
    } else if (currentStep === 8) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(9)
        setSelectedOption("")
      }, 800);    } else if (currentStep === 9) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(10)
        setSelectedOption("")
      }, 800);
    } else if (currentStep === 10) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        // Check if fundraising instrument is "To Be Determined"
        if (formData.fundraisingInstrument === "To Be Determined") {
          // Skip valuation cap questions and go directly to investor types
          setCurrentStep(17)
        } else {
          // Normal flow - go to step 11 (valuation cap)
          setCurrentStep(11)
        }
        setInputAmount("")
      }, 800);
    } else if (currentStep === 15) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(16)
        setInputAmount("")
      }, 800);
    } else if (currentStep === 16) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(17)
      }, 800);
    } else if (currentStep < 18) {
      setTimeout(() => {
        setIsButtonLoading(false);
        setStepHistory([...stepHistory, currentStep])
        setCurrentStep(currentStep + 1)

        if (!isInputStep() && !isMultiSelectStep() && !isPlanningStep()) {
          setSelectedOption("")
        } else if (isInputStep()) {
          setInputAmount("")
        } else if (isMultiSelectStep()) {
          setSelectedMultiOptions([])
        }
      }, 800);
    }

    setIsDropdownOpen(false)
    setShowValidationError(false)
  }

  const handleBack = () => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory]
      newHistory.pop()
      const previousStep = newHistory[newHistory.length - 1]

      setStepHistory(newHistory)
      setCurrentStep(previousStep)
      setSelectedOption("")
      setInputAmount("")
      setSelectedMultiOptions([])
      setIsDropdownOpen(false)
      setShowValidationError(false)
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  const validationError = getValidationError()
  const shouldShowError = showValidationError && (validationError || !inputAmount)

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black" style={{ opacity: 0.7 }}></div>

         <div
          className="relative flex flex-col items-center justify-center"
          style={{
            width: "43.75rem",
            height: "35rem",
            backgroundImage: `url(${rectangleImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: "40rem",
              height: "6.5rem",
              borderRadius: "0.3125rem",
              background: "rgba(0, 0, 0, 0.76)",
            }}
          >
            <div
              className="animate-spin rounded-full border-b-2 border-white"
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
            ></div>            <span
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 400,
                marginLeft: "1.38rem",
              }}
            >
              Opening a New {getCurrentRoundName()}...
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black" style={{ opacity: 0.7 }}></div>

        <div
          className="relative flex flex-col items-center justify-center"
          style={{
            width: "43.75rem",
            height: "35rem",
            backgroundImage: `url(${rectangleImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer hover:opacity-80"
            style={{
              top: "2rem",
              right: "2rem",
              width: "2rem",
              height: "2rem",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M8.40002 25.6717L6.39502 23.6001L13.9617 16.0001L6.39502 8.33339L8.40002 6.26172L16.0334 13.9284L23.6 6.26172L25.605 8.33339L18.0384 16.0001L25.605 23.6001L23.6 25.6717L16.0334 18.0051L8.40002 25.6717Z"
                fill="white"
              />
            </svg>
          </button>

        

          <div className="text-center relative z-10">            <h2
              style={{
                width: "30.75rem",
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "3rem",
                fontWeight: 500,
                margin: "0 auto",
              }}
            >
              {getCurrentRoundName()} is now live.
            </h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Permission Error Notification */}
      {permissionError && (
        <div className="fixed top-4 right-4 z-[100] transition-all duration-1000 ease-in-out translate-x-0 opacity-100">
          <div className="max-w-xs sm:max-w-sm md:max-w-md whitespace-pre-line rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
            <span className="text-white font-inter text-sm sm:text-base font-medium">{permissionError}</span>
          </div>
        </div>
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Dimmed background overlay */}
        <div className="absolute inset-0 bg-black" style={{ opacity: 0.7 }} onClick={onClose}></div>
  
        <div
          className="relative flex flex-col items-center justify-center"
          style={{
            width: "43.75rem",
            height: "35rem",
            backgroundImage: `url(${rectangleImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Header text */}
          <div className="text-center" style={{ paddingTop: "2.0rem" }}>
            <h2
              className="text-white"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              Let's open a new round.
            </h2>
            <p
              style={{
                color: "#B8B8B8",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "0.75rem",
                fontWeight: 500,
                maxWidth: "25rem",
                margin: "0 auto",
                marginTop: "0.25rem",
                lineHeight: "1.1",
              }}
            >
              Your startup stage will update automatically after opening the round. You can review and edit round details
              anytime.
            </p>
          </div>
  
          {/* Main container */}
          <div
            style={{
              width: "40rem",
              height: "14.625rem",
              borderRadius: "0.3125rem",
              background: "rgba(0, 0, 0, 0.76)",
              position: "relative",
              marginTop: "1.87rem",
            }}
          >
            {/* Question section */}
            <div style={{ paddingTop: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
              {isPlanningStep() ? (
                /* Planning Step Layout */
                <div className="flex flex-col items-center justify-center text-center" style={{ height: "8rem" }}>
                  <h3
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {getQuestionText()}
                  </h3>
  
                  <div className="flex gap-4">
                    <button
                      className="flex items-center justify-center"
                      style={{
                        width: "15.625rem",
                        height: "2.1875rem",
                        background: "#305FC4",
                        borderRadius: "0.125rem",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={Icon}
                        alt="icon"
                        style={{ marginRight: "0.44rem", width: "16px", height: "16px" }}
                      />
                      <span
                        style={{
                          color: "#FFF",
                          textAlign: "center",
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        Show me how it is calculated
                      </span>
                    </button>
  
                    <button
                      className="flex items-center justify-center"
                      style={{
                        width: "15.625rem",
                        height: "2.1875rem",
                        background: "#5F248D",
                        borderRadius: "0.125rem",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          color: "#FFF",
                          textAlign: "center",
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        Fair Dilution
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Step Layout */
                <>
                  <div className="flex items-center relative">
                    <h3
                      style={{
                        color: "#FFF",
                        fontFamily: "Inter",
                        fontSize: "1rem",
                        fontWeight: 500,
                        marginRight: "0.5rem",
                      }}
                    >
                      {getQuestionText()}
                    </h3>
                    {shouldShowInfoIcon() && (
                      <div
                        className="relative inline-block"
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          flexShrink: 0,
                        }}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <img
                          src="../src/assets/info.svg"
                          alt="info"
                          className="w-full h-full object-contain cursor-pointer"
                        />
  
                        {showTooltip && getTooltipContent() && (
                          <div
                            className="absolute z-[9999] pointer-events-none"
                            style={{
                              top: "calc(100% - 1.1rem)", // position below the element
                              transform: "translateX(15%)", // align left with triggering element
                              width: "10.3125rem",
                              maxWidth: "10.3125rem",
                              background: "#0F0E16",
                              borderRadius: "0.25rem",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              wordBreak: "break-word",
                            }}
                          >
                            <div
                              style={{
                                color: "#B8B8B8",
                                fontFamily: "Inter",
                                fontSize: "0.5rem",
                                fontWeight: 400,
                                padding: "0.81rem 1rem",
                                lineHeight: "1.2",
                              }}
                            >
                              {getTooltipContent()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
  
                  {/* Subheading */}
                  {getSubheadingText() && (
                    <p
                      style={{
                        color: "#B8B8B8",
                        fontFamily: "Inter",
                        fontSize: "0.625rem",
                        fontWeight: 300,
                        marginTop: "0.38rem",
                      }}
                    >
                      {getSubheadingText()}
                    </p>
                  )}
  
                  {/* Input or Dropdown Container */}
                  <div className="relative" style={{ marginTop: getSubheadingText() ? "0.75rem" : "1rem" }}>
                    {/* Main Container */}
                    <div
                      onClick={toggleDropdown}
                      className={`${!isInputStep() ? "cursor-pointer" : ""} relative rounded-[0.125rem] bg-[rgba(255,255,255,0.11)] px-4 py-2`}
                      style={{
                        width: "33.75rem",
                        height: "2.25rem",
                      }}
                    >
                      <div className="flex items-center justify-between h-full">
                        {isInputStep() ? (
                          /* Input Field */
                          <div className="flex items-center w-full">
                            {getInputSymbol() && (
                              <span
                                style={{
                                  color: isInputFocused || inputAmount ? "#FFF" : "#656565",
                                  fontFamily: "Inter",
                                  fontSize: "0.75rem",
                                  fontWeight: isInputFocused || inputAmount ? 500 : 400,
                                  marginRight: "0.25rem",
                                }}
                              >
                                {getInputSymbol()}
                              </span>
                            )}                            <input
                              type={isDateStep() ? "date" : "text"}                              value={
                                isDateStep() ? inputAmount : 
                                isAmountStep() && inputAmount
                                  ? formatUSNumber(Number.parseInt(inputAmount))
                                  : inputAmount
                              }
                              onChange={handleInputChange}
                              onFocus={() => setIsInputFocused(true)}
                              onBlur={() => setIsInputFocused(false)}
                              className="bg-transparent text-white outline-none flex-1"
                              style={{
                                color: "#FFF",
                                fontFamily: "Inter",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                              placeholder={getPlaceholderText()}
                            />
                          </div>
                        ) : (
                          /* Dropdown Display */
                          <>
                            <div className="flex items-center flex-wrap gap-1 flex-1">
                              {isMultiSelectStep() && selectedMultiOptions.length > 0 ? (
                                selectedMultiOptions.map((option) => (
                                  <div
                                    key={option}
                                    className="flex items-center"
                                    style={{
                                      borderRadius: "0.125rem",
                                      background: "#5F248D",
                                      padding: "0.25rem 0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#FFF",
                                        fontFamily: "Inter",
                                        fontSize: "0.625rem",
                                        fontWeight: 400,
                                        marginRight: "0.25rem",
                                      }}
                                    >
                                      {option}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        removeMultiOption(option)
                                      }}
                                      style={{
                                        width: "0.5rem",
                                        height: "0.5rem",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="8"
                                        height="8"
                                        viewBox="0 0 8 8"
                                        fill="none"
                                      >
                                        <path
                                          d="M2.10011 6.23333L1.78345 5.9L3.67511 4L1.78345 2.08333L2.10011 1.75L4.00845 3.66667L5.90011 1.75L6.21678 2.08333L4.32511 4L6.21678 5.9L5.90011 6.23333L4.00845 4.31667L2.10011 6.23333Z"
                                          fill="white"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span
                                  style={{
                                    color: selectedOption || selectedMultiOptions.length > 0 ? "#FFF" : "#656565",
                                    fontFamily: "Inter",
                                    fontSize: "0.75rem",
                                    fontWeight: selectedOption || selectedMultiOptions.length > 0 ? 500 : 400,
                                  }}
                                >
                                  {isMultiSelectStep() ? "Select options..." : selectedOption || "Select option..."}
                                </span>
                              )}
                            </div>
  
                            {/* Vertical line */}
                            <div
                              className="absolute top-1/2 transform -translate-y-1/2"
                              style={{
                                right: "2.5rem",
                                width: "1px",
                                height: "1rem",
                                backgroundColor: "#656565",
                              }}
                            ></div>
  
                            {/* Dropdown icon */}
                            <div
                              className="absolute top-1/2 transform -translate-y-1/2 pointer-events-none"
                              style={{ right: "0.6rem" }}
                            >
                              <svg
                                style={{
                                  width: "1.5rem",
                                  height: "1.5rem",
                                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                                  transition: "transform 0.2s ease",
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M12.025 14.95L6.375 9.29998L7.325 8.34998L12.025 13.05L16.725 8.34998L17.675 9.29998L12.025 14.95Z"
                                  fill="#656565"
                                />
                              </svg>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
  
                    {/* Validation Error */}
                    {isInputStep() && shouldShowError && (
                      <p
                        style={{
                          color: "#FC4141",
                          fontFamily: "Inter",
                          fontSize: "0.625rem",
                          fontWeight: 300,
                          marginTop: "0.75rem",
                        }}
                      >
                        {!inputAmount ? "This field is required" : validationError}
                      </p>
                    )}                    {/* Dropdown Container */}
                    {shouldShowDropdown() && isDropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 dropdown-container"
                        style={{
                          width: "33.75rem",
                          height: getDropdownHeight(),
                          borderRadius: "0.125rem",
                          background: "#000",
                          overflowY: needsScrolling() ? "scroll" : "visible",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                          zIndex: 9999,
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div style={{ height: "100%" }}>
                          {options.map((option, index) => (
                            <div
                              key={option}
                              onClick={() => handleOptionSelect(option)}
                              onMouseEnter={() => setHoveredOption(option)}
                              onMouseLeave={() => setHoveredOption("")}
                              className="cursor-pointer flex items-center px-4 transition-colors duration-150"
                              style={{
                                width: hoveredOption === option ? "33.625rem" : "100%",
                                height: "2rem",
                                background: hoveredOption === option ? "#33005C" : "transparent",
                                marginTop: index === 0 ? "0.71875rem" : "0.4375rem",
                              }}
                            >
                              {/* Checkbox for multi-select */}
                              {isMultiSelectStep() && (
                                <div 
                                  className="mr-2"
                                  style={{
                                    width: '1rem',
                                    height: '1rem',
                                    border: '1px solid #656565',
                                    borderRadius: '2px',
                                    background: selectedMultiOptions.includes(option) ? '#FFF' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  {selectedMultiOptions.includes(option) && (
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                      <path d="M1 4L3 6L7 2" stroke="#000" strokeWidth="1.5" fill="none"/>
                                    </svg>
                                  )}
                                </div>
                              )}
                              <span
                                style={{
                                  color: "#FFF",
                                  fontFamily: "Inter",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              >
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
  
            {/* Buttons - positioned on right side */}
            <div
              className="flex justify-end items-center gap-2"
              style={{ position: "absolute", right: "4.3rem", bottom: "2.19rem" }}
            >
              <button
                onClick={handleBack}
                disabled={isButtonLoading || isLoading}
                className="text-black transition-colors hover:bg-gray-500"
                style={{
                  width: "5rem",
                  height: "2rem",
                  background: "rgba(255, 255, 255, 0.20)",
                  borderRadius: "0.125rem",
                  cursor: (isButtonLoading || isLoading) ? 'not-allowed' : 'pointer',
                  opacity: (isButtonLoading || isLoading) ? 0.6 : 1
                }}
              >
                <span
                  style={{
                    width: "2.125rem",
                    height: "0.9375rem",
                    flexShrink: 0,
                    color: "#0F0E16",
                    textAlign: "center",
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Back
                </span>
              </button>
  
              <button
                onClick={handleNext}
                disabled={isButtonLoading || isLoading}
                className="transition-colors hover:bg-gray-100"
                style={{
                  width: "5rem",
                  height: "2rem",
                  borderRadius: "0.125rem",
                  background: (isButtonLoading || isLoading) ? "#ccc" : "#FFF",
                  cursor: (isButtonLoading || isLoading) ? 'not-allowed' : 'pointer',
                }}
              >
                {isButtonLoading ? (
                  <div
                    style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid #666',
                      borderTop: '2px solid #000',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto'
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: "2.125rem",
                      height: "0.9375rem",
                      color: "#000",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Next
                  </span>
                )}
              </button>
            </div>
          </div>
  
          {/* Bottom text */}
          <div className="text-center" style={{ marginTop: "2.12rem" }}>
            <p
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "0.75rem",
                fontWeight: 400,
                maxWidth: "26.5rem",
                margin: "0 auto",
                lineHeight: "1.1",
              }}
            >
              Not sure how to structure your round? Let an expert help.{" "}
              <span
                className="underline cursor-pointer hover:text-gray-200"
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Book a free call
              </span>{" "}
              to see if you qualify for our premium services.
            </p>
          </div>
          
          {/* Error display */}
          {error && (
            <div 
              style={{
                position: 'absolute',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(252, 65, 65, 0.9)',
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                color: '#FFF',
                fontFamily: 'Inter',
                fontSize: '0.875rem',
                maxWidth: '80%',
                textAlign: 'center'
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .dropdown-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </>
  )
}
export default AddRoundPopup;