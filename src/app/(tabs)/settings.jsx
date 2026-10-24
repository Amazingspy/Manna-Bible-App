import React, { useState, useRef, useEffect } from "react";
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Switch
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import { useAuth } from "../../context/AuthContext";
import CustomAlert from "../../components/CustomAlert";
import { logError } from "../../utils/logger";

function SettingRow({ icon, iconColor, title, value, onPress, isLast = false }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className={`flex-row items-center justify-between p-4 ${!isLast ? "border-b border-slate-100 dark:border-slate-800/60" : ""
                    }`}
            >
                <View className="flex-row items-center gap-3.5">
                    <View
                        style={{ backgroundColor: `${iconColor}15` }}
                        className="h-10 w-10 items-center justify-center rounded-2xl"
                    >
                        <MaterialIcons name={icon} size={20} color={iconColor} />
                    </View>
                    <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {title}
                    </Text>
                </View>

                <View className="flex-row items-center gap-2">
                    {value && (
                        <Text className="text-sm font-medium text-slate-400 dark:text-slate-500">
                            {value}
                        </Text>
                    )}
                    <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function SettingsScreen() {
    const router = useRouter();
    const { colorScheme, setColorScheme } = useColorScheme();
    const { user, logout } = useAuth();
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '' });
    const isDarkMode = colorScheme === 'dark';

    // Ref to guard async state updates after unmount during logout navigation
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleLogout = () => {
        setAlertConfig({
            visible: true,
            title: "Sign Out",
            message: "Are you sure you want to sign out? Your saved verses will remain synced to your account.",
            type: 'confirm',
            confirmText: "Sign Out",
            onConfirm: async () => {
                if (isMounted.current) {
                    setAlertConfig((prev) => ({ ...prev, visible: false }));
                }
                try {
                    await logout();
                    router.replace('/login');
                } catch (error) {
                    logError('SettingsScreen', 'handleLogout → logout', error);
                    if (isMounted.current) {
                        setAlertConfig({
                            visible: true,
                            title: 'Logout Failed',
                            message: `${error.message} (code: ${error.code ?? '-'})`,
                            type: 'error'
                        });
                    }
                }
            }
        });
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-slate-50/50 dark:bg-background-dark">
            {/* Header */}
            <View className="border-b border-slate-200/60 bg-white/90 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-900/80">
                <Text className="text-center text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Settings
                </Text>
            </View>

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Profile Card */}
                {user && (
                    <View className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
                        <View className="flex-row items-center gap-4">
                            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/20 dark:bg-amber-400/10">
                                <Text className="text-2xl font-black text-amber-600 dark:text-amber-400">
                                    {user.displayName ? user.displayName[0].toUpperCase() : 'M'}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-slate-900 dark:text-white">
                                    {user.displayName || 'Manna User'}
                                </Text>
                                <Text className="text-xs font-medium text-slate-400">
                                    {user.email}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Appearance Group */}
                <View className="mt-8">
                    <Text className="mb-2.5 ml-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Appearance
                    </Text>
                    <View className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3.5">
                                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10">
                                    <MaterialIcons name="dark-mode" size={20} color="#3b82f6" />
                                </View>
                                <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">
                                    Dark Mode
                                </Text>
                            </View>

                            <Switch
                                value={isDarkMode}
                                onValueChange={() => setColorScheme(isDarkMode ? "light" : "dark")}
                                trackColor={{ false: "#e2e8f0", true: "#2563eb" }}
                                thumbColor="#ffffff"
                            />
                        </View>
                    </View>
                </View>

                {/* Support & Legal Group */}
                <View className="mt-6">
                    <Text className="mb-2.5 ml-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Support & Legal
                    </Text>
                    <View className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
                        <SettingRow
                            icon="info-outline"
                            iconColor="#6366f1"
                            title="About App"
                            onPress={() => router.push("/about")}
                        />
                        <SettingRow
                            icon="description"
                            iconColor="#8b5cf6"
                            title="Terms & Conditions"
                            onPress={() => router.push("/terms-and-conditions")}
                        />
                        <SettingRow
                            icon="policy"
                            iconColor="#ec4899"
                            title="Privacy Policy"
                            isLast
                            onPress={() => router.push("/privacy-policy")}
                        />
                    </View>
                </View>

                {/* Sign Out Button */}
                {user && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleLogout}
                        className="mt-8 h-14 w-full flex-row items-center justify-center rounded-2xl border border-red-200/60 bg-red-500/10 active:bg-red-500/20 dark:border-red-900/30 dark:bg-red-900/20"
                    >
                        <MaterialIcons name="logout" size={20} color="#ef4444" style={{ marginRight: 8 }} />
                        <Text className="text-base font-bold text-red-500">Sign Out</Text>
                    </TouchableOpacity>
                )}

                {/* App Version Footer */}
                <View className="items-center pt-8">
                    <Text className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-300 dark:text-slate-600">
                        Manna • Version 1.1.0
                    </Text>
                </View>
            </ScrollView>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                confirmText={alertConfig.confirmText}
                onConfirm={alertConfig.onConfirm}
                onClose={() => {
                    if (isMounted.current) {
                        setAlertConfig((prev) => ({ ...prev, visible: false }));
                    }
                }}
            />
        </SafeAreaView>
    );
}