import '../global.css';
import { Stack, useSegments, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SavedProvider } from '../context/SavedContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

function InitialLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const isAuthScreen = segments[0] === 'login' || segments[0] === 'signup';
        const isWelcomeScreen = segments.length === 0 || segments[0] === '';
        const isPublicScreen = ['about', 'terms-and-conditions', 'privacy-policy'].includes(segments[0]);

        if (!isAuthenticated && !isWelcomeScreen && !isAuthScreen && !isPublicScreen) {
            // Redirect to Welcome if not authenticated and trying to access private screens
            router.replace('/');
        } else if (isAuthenticated && (isWelcomeScreen || isAuthScreen)) {
            // Redirect to tabs if authenticated and on welcome or auth screens
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, isLoading, segments]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#1B365C]">
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" options={{ presentation: 'modal' }} />
            <Stack.Screen name="signup" options={{ presentation: 'modal' }} />
            <Stack.Screen name="about" options={{ presentation: 'modal' }} />
            <Stack.Screen name="terms-and-conditions" options={{ presentation: 'modal' }} />
            <Stack.Screen name="privacy-policy" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <SavedProvider>
                        <InitialLayout />
                    </SavedProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
