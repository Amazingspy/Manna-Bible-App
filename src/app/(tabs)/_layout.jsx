import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { Animated, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_BG = { dark: '#0f172a', light: '#ffffff' };

const TAB_META = {
    index: { label: 'Read', icon: 'menu-book', iconActive: 'menu-book' },
    media: { label: 'Media', icon: 'play-circle-outline', iconActive: 'play-circle-filled' },
    saved: { label: 'Saved', icon: 'bookmark-border', iconActive: 'bookmark' },
    settings: { label: 'Settings', icon: 'settings', iconActive: 'settings' },
};

function TabItem({ focused, meta, onPress, onLongPress, activeBg, inactiveColor, label }) {
    const anim = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: focused ? 1 : 0,
            useNativeDriver: false,
            damping: 18,
            stiffness: 150,
            mass: 0.8,
        }).start();
    }, [focused, anim]);

    // Flex stays balanced across all 4 items so no icon gets squeezed out
    const flex = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.4],
    });

    const labelOpacity = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    return (
        <Animated.View style={{ flex, height: '100%' }}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
                style={styles.touch}
            >
                {/* Active Pill rendered safely inside the tab bounds */}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.activePill,
                        {
                            backgroundColor: activeBg,
                            opacity: anim,
                        },
                    ]}
                />

                <View style={styles.row}>
                    <MaterialIcons
                        name={focused ? meta.iconActive : meta.icon}
                        size={22}
                        color={focused ? '#ffffff' : inactiveColor}
                    />

                    {focused && (
                        <Animated.View
                            style={[
                                styles.labelContainer,
                                {
                                    opacity: labelOpacity,
                                },
                            ]}
                        >
                            <Text numberOfLines={1} style={styles.label}>
                                {meta.label}
                            </Text>
                        </Animated.View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

function FloatingTabBar({ state, descriptors, navigation }) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    if (keyboardVisible) return null;

    const activeBg = isDark ? '#f97316' : '#1a355b';

    return (
        <View
            style={{
                backgroundColor: isDark ? SCREEN_BG.dark : SCREEN_BG.light,
                paddingHorizontal: 16,
                paddingTop: 8,
                paddingBottom: Math.max(insets.bottom, 12),
            }}
        >
            <View
                style={[
                    styles.bar,
                    {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        shadowColor: isDark ? '#000000' : '#1a355b',
                    },
                ]}
            >
                {state.routes.map((route, index) => {
                    const meta = TAB_META[route.name];
                    if (!meta) return null;

                    const focused = state.index === index;
                    const { options } = descriptors[route.key];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({ type: 'tabLongPress', target: route.key });
                    };

                    return (
                        <TabItem
                            key={route.key}
                            focused={focused}
                            meta={meta}
                            label={options.title || meta.label}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            activeBg={activeBg}
                            inactiveColor={isDark ? '#94a3b8' : '#64748b'}
                        />
                    );
                })}
            </View>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <FloatingTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" options={{ title: 'Read' }} />
            <Tabs.Screen name="media" options={{ title: 'Videos' }} />
            <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        paddingHorizontal: 4,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 10,
    },
    touch: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    activePill: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        marginVertical: 4,
        marginHorizontal: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    labelContainer: {
        marginLeft: 6,
    },
    label: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});