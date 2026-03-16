import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark">
            {/* Clean Header */}
            <View className="border-b border-slate-100 bg-white/80 dark:border-slate-800 dark:bg-background-dark/80">
                <View className="flex-row items-center justify-between px-6 py-4">
                    <Text className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                        Settings
                    </Text>
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                        <MaterialIcons name="close" size={20} className="text-slate-900 dark:text-white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Profile Card (Premium Style) */}
                <View className="mt-8 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                    <View className="flex-row items-center gap-5">
                        <View className="h-20 w-20 overflow-hidden rounded-3xl border-4 border-slate-50 shadow-sm dark:border-slate-800">
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZIy9gJiH3Fd9N4k2yxDoAnHy5jAt_O0nfATBHoVAY6VwdI4IMFiq17K1-lhn1dFRpgFiAYTF6JpXyxDEAwhdSNgyrRwgVDmvzMISvLfcY205xlJ_N8u1Kjgi_Jv0SZ6NpbFCFJWJyGt8buadxj90ZA4S6MlKxRVDKh7KT7XI7znUDROLaCVHnTopreeG_TDyOjF-uWF7cPXf3eWytJAxJOKn7xZDbqrjkYiGo9RUpFaH0WIyr8wVC2yiCNhFdeulW4BOfh8ClZB0f" }}
                                className="h-full w-full"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                Samuel Richards
                            </Text>
                            <Text className="text-sm font-medium text-slate-400">
                                Pro Member • Since 2023
                            </Text>
                        </View>
                        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5">
                            <MaterialIcons name="edit" size={18} className="text-slate-400" />
                        </TouchableOpacity>
                    </View>
                </View>

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
                                    onPress={() => setIsDarkMode(!isDarkMode)}
                                    className={`h-7 w-12 rounded-full px-1 justify-center ${isDarkMode ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
                                >
                                    <View className={`h-5 w-5 rounded-full bg-white shadow-sm ${isDarkMode ? "self-end" : "self-start"}`} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity className="flex-row items-center justify-between p-5">
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="translate" size={20} className="text-slate-400" />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">App Language</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="text-sm font-bold text-slate-400">English</Text>
                                    <MaterialIcons name="chevron-right" size={20} className="text-slate-300" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Support Section */}
                    <View>
                        <Text className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Support & Legal
                        </Text>
                        <View className="overflow-hidden rounded-3xl border border-slate-50 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20">
                            <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-white dark:border-slate-800">
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="help-outline" size={20} className="text-slate-400" />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">Help Center</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} className="text-slate-300" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center justify-between p-5">
                                <View className="flex-row items-center gap-4">
                                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                                        <MaterialIcons name="policy" size={20} className="text-slate-400" />
                                    </View>
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">Privacy Policy</Text>
                                </View>
                                <MaterialIcons name="open-in-new" size={18} className="text-slate-300" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sign Out */}
                    <TouchableOpacity className="mt-4 flex-row h-16 w-full items-center justify-center rounded-2xl border border-red-50 bg-red-50/30 active:bg-red-50 dark:border-red-900/10 dark:bg-red-900/5">
                        <Text className="text-lg font-black tracking-tight text-red-500">Sign Out</Text>
                    </TouchableOpacity>

                    <View className="items-center pt-4">
                        <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                            Manna • Version 4.12.0
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
