import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import api from './api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navigation, setNavigation] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);

        if (token && !isTokenExpired(token)) {
          setIsAuthenticated(true);
        } else if (refreshToken && !isTokenExpired(refreshToken)) {
          const refreshed = await refreshToken();
          if (refreshed) {
            setIsAuthenticated(true);
          } else {
            await logout();
          }
        } else {
          await logout(); 
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; 
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) return false;

      const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
      const { access } = response.data;

      await AsyncStorage.setItem(ACCESS_TOKEN, access);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  const login = async (token) => {
    await AsyncStorage.setItem(ACCESS_TOKEN, token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
    setIsAuthenticated(false);
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, setNavigation }}>
      {children}
    </AuthContext.Provider>
  );
};
