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

        const inAuthGroup = segments[0] === '(tabs)';

        if (!isAuthenticated && inAuthGroup) {
            // Redirect to Welcome if not authenticated and trying to access tabs
            router.replace('/');
        } else if (isAuthenticated && (segments[0] === 'login' || segments[0] === 'signup' || segments[0] === undefined)) {
            // Redirect to tabs if authenticated and on auth screens or root
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
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SavedProvider>
                    <AuthProvider>
                        <InitialLayout />
                    </AuthProvider>
                </SavedProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
