import { useEffect } from 'react';
import { useAuthStore } from '../store';

export const useAuth = () => {
  const {
    token,
    user,
    restaurantId,
    isAuthenticated,
    isLoading,
    initialize,
    login,
    logout,
    setRestaurantId,
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    token,
    user,
    restaurantId,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setRestaurantId,
  };
};

export default useAuth;
