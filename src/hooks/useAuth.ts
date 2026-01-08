import { useEffect } from 'react';
import { useAuthStore } from '../store';

export const useAuth = () => {
  const {
    accessToken,
    refreshToken,
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
    accessToken,
    refreshToken,
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
