import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: isDark ? '#f97316' : '#1a355b',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
                    paddingBottom: 24,
                    paddingTop: 12,
                    height: 80,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: isDark ? 0.2 : 0.05,
                    shadowRadius: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Read',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="menu-book" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="media"
                options={{
                    title: 'Videos',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="play-circle-outline" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="bookmark-border" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="settings" size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
