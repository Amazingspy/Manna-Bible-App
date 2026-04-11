import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            // Check if AsyncStorage is available to prevent crash
            if (AsyncStorage) {
                const authDataSerialized = await AsyncStorage.getItem('@MannaAuth');
                if (authDataSerialized) {
                    const _authData = JSON.parse(authDataSerialized);
                    setUser(_authData);
                }
            }
        } catch (error) {
            console.warn('AsyncStorage is not available. Using in-memory state.', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        setUser(userData);
        try {
            if (AsyncStorage) {
                await AsyncStorage.setItem('@MannaAuth', JSON.stringify(userData));
            }
        } catch (error) {
            console.warn('Failed to persist auth data', error);
        }
    };

    const logout = async () => {
        setUser(null);
        try {
            if (AsyncStorage) {
                await AsyncStorage.removeItem('@MannaAuth');
            }
        } catch (error) {
            console.warn('Failed to remove auth data', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
