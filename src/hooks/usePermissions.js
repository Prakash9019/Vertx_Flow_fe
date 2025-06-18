import { useState, useEffect } from 'react';
import axios from 'axios';
import API_KEY from '../../key';

export const usePermissions = () => {
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    checkUserPermissions();
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
    } finally {
      setLoading(false);
    }
  };
  return {
    userRole,
    permissions,
    hasFullAccess,
    loading,
    isFounder: userRole === 'founder',
    isCofounder: userRole === 'cofounder',
    canCreate: hasFullAccess,
    canEdit: hasFullAccess,
    canDelete: hasFullAccess,
    canView: hasFullAccess,
    canUpload: hasFullAccess,
    canEvaluate: hasFullAccess
  };
};
