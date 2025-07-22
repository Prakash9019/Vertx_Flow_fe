import { useState, useEffect } from 'react';
import axios from 'axios';
import API_KEY from '../../key';
import { usePermissionNotification } from './usePermissionNotification';

export const usePermissions = () => {
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [canUsePdfEvaluation, setCanUsePdfEvaluation] = useState(false);
  const { showPermissionDenied } = usePermissionNotification();

  useEffect(() => {
    checkUserPermissions();
    checkSubscription();
  }, []);

  const checkUserPermissions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const response = await axios.get(`${API_KEY}/api/auth/founder`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const { role, permissions: userPermissions } = response.data;
        setUserRole(role);
        setPermissions(userPermissions);
        
        // Determine if user has full access
        if (role === 'founder') {
          setHasFullAccess(true);
        } else if (role === 'cofounder' && userPermissions && userPermissions.fullAccess) {
          setHasFullAccess(true);
        } else {
          setHasFullAccess(false);
        }
      }
    } catch (error) {
      console.error('Error checking user permissions:', error);
      setHasFullAccess(false);
    } finally {      setLoading(false);
    }
  };

  // Check user's subscription status
  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // console.log('Checking subscription status...');
        const response = await axios.get(`${API_KEY}/api/payment/subscription`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // console.log('Subscription response:', response.data);
        const { subscription, hasSubscription } = response.data;
        
        if (hasSubscription && subscription && subscription.planName) {
          // console.log(`Active subscription found: ${subscription.planName}`);
          setSubscriptionPlan(subscription.planName);
          
          // Check if user can use PDF evaluation (Launch or Scale plans)
          const canUseEval = ['Launch', 'Scale'].includes(subscription.planName);
          // console.log(`Can use PDF evaluation: ${canUseEval}`);
          setCanUsePdfEvaluation(canUseEval);
        } else {
          // console.log('No active subscription found or subscription is not valid');
          setSubscriptionPlan(null);
          setCanUsePdfEvaluation(false);
        }
      } else {
        // console.log('No auth token found, cannot check subscription');
        setSubscriptionPlan(null);
        setCanUsePdfEvaluation(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionPlan(null);
      setCanUsePdfEvaluation(false);
    }
  };

  const checkPermissionWithNotification = (action = null, customMessage = null) => {
    if (!hasFullAccess) {
      const message = customMessage || 
        (action ? `You don't have permission to ${action}` : "You don't have access from founder");
      showPermissionDenied(message);
      return false;
    }
    return true;
  };
  return {
    userRole,
    permissions,
    hasFullAccess,
    loading,
    subscriptionPlan,
    isFounder: userRole === 'founder',
    isCofounder: userRole === 'cofounder',
    canCreate: hasFullAccess,
    canEdit: hasFullAccess,
    canDelete: hasFullAccess,
    canView: hasFullAccess,
    canUpload: hasFullAccess,
    canEvaluate: hasFullAccess && canUsePdfEvaluation, // Now requires both role permission and subscription
    canUsePdfEvaluation,
    checkPermissionWithNotification,
    checkSubscription // Expose this so components can refresh subscription status
  };
};
