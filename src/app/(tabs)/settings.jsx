import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';

import { useColorScheme } from "nativewind";
import { useAuth } from "../../context/AuthContext";
import CustomAlert from "../../components/CustomAlert";

export default function SettingsScreen() {
    const router = useRouter();
    const { colorScheme, setColorScheme } = useColorScheme();
    const { user, logout } = useAuth();
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '' });
    const isDarkMode = colorScheme === 'dark';
    const ContactMail = "amazingspidey348@gmail.com";

    const handleLogout = async () => {
        setAlertConfig({
            visible: true,
            title: "Sign Out",
            message: "Are you sure you want to sign out? Your saved verses will remain synced to your account.",
            type: 'confirm',
            confirmText: "Sign Out",
            onConfirm: async () => {
                setAlertConfig({ ...alertConfig, visible: false });
                try {
                    await logout();
                    router.replace('/');
                } catch (error) {
                    setTimeout(() => {
                        setAlertConfig({
                            visible: true,
                            title: "Logout Failed",
                            message: error.message,
                            type: 'error'
                        });
                    }, 500);
                }
            }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark">
            {/* Clean Header */}
            <View className="border-b border-slate-100 bg-white/80 dark:border-slate-800 dark:bg-background-dark/80">
                <View className="flex-row items-center justify-center px-6 py-4">
                    <Text className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                        Settings
                    </Text>
                    {/* <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                        <MaterialIcons name="close" size={20} color={isDarkMode ? "white" : "#0f172a"} />
                    </TouchableOpacity> */}
                </View>
            </View>

            <ScrollView className="flex-1 px-6">
                {user && (
                    <View className="mt-8 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                        <View className="flex-row items-center gap-5">
                            <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#FFD700] shadow-sm">
                                <Text className="text-3xl font-black text-slate-900">
                                    {user.displayName ? user.displayName[0] : 'M'}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {user.displayName || 'Manna User'}
                                </Text>
                                <Text className="text-sm font-medium text-slate-400">
                                    {user.email}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Settings Groups */}
                <View className="mt-10 gap-8 pb-32">

                    {/* Appearance Section */}
                    <View>
                        <Text className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Appearance
                        </Text>
                        <View className="overflow-hidden rounded-3xl border border-slate-50 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20">
                            <View className="flex-row items-center justify-between p-5 border-b border-white dark:border-slate-800">
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="dark-mode" size={20} color="#0A84FF" />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">Dark Mode</Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => setColorScheme(isDarkMode ? "light" : "dark")}
                                    className={`h-7 w-12 rounded-full px-1 justify-center ${isDarkMode ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
                                >
                                    <View className={`h-5 w-5 rounded-full bg-white shadow-sm ${isDarkMode ? "self-end" : "self-start"}`} />
                                </TouchableOpacity>
                            </View>

                            {/* <TouchableOpacity className="flex-row items-center justify-between p-5">
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="translate" size={20} color={isDarkMode ? "#94a3b8" : "#64748b"} />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">App Language</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="text-sm font-bold text-slate-400">English</Text>
                                    <MaterialIcons name="chevron-right" size={20} color={isDarkMode ? "#475569" : "#cbd5e1"} />
                                </View>
                            </TouchableOpacity> */}
                        </View>
                    </View>

                    {/* Support Section */}
                    <View>
                        <Text className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Support & Legal
                        </Text>
                        <View className="overflow-hidden rounded-3xl border border-slate-50 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20">

                            <TouchableOpacity
                                onPress={() => router.push("/about")}
                                className="flex-row items-center justify-between p-5 border-b border-white dark:border-slate-800"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="info-outline" size={20} color={isDarkMode ? "#94a3b8" : "#64748b"} />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">About App</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color={isDarkMode ? "#475569" : "#cbd5e1"} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/terms-and-conditions")}
                                className="flex-row items-center justify-between p-5 border-b border-white dark:border-slate-800"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="description" size={20} color={isDarkMode ? "#94a3b8" : "#64748b"} />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">Terms & Conditions</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color={isDarkMode ? "#475569" : "#cbd5e1"} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/privacy-policy")}
                                className="flex-row items-center justify-between p-5"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="policy" size={20} color={isDarkMode ? "#94a3b8" : "#64748b"} />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">Privacy Policy</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color={isDarkMode ? "#475569" : "#cbd5e1"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {user && (
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="mt-4 flex-row h-16 w-full items-center justify-center rounded-2xl border border-red-50 bg-red-50/30 active:bg-red-50 dark:border-red-900/10 dark:bg-red-900/5"
                        >
                            <Text className="text-lg font-black tracking-tight text-red-500">Sign Out</Text>
                        </TouchableOpacity>
                    )}

                    <View className="items-center pt-4">
                        <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                            Manna • Version 1.1.0
                        </Text>
                    </View>
                </View>

            </ScrollView>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                confirmText={alertConfig.confirmText}
                onConfirm={alertConfig.onConfirm}
                onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
            />
        </SafeAreaView>
    );
}
