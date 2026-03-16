import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-primary/10 bg-background-light/80 px-4 py-4 dark:bg-background-dark/80">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity className="-ml-1 items-center justify-center p-1">
                        <MaterialIcons name="arrow-back" size={24} className="text-primary dark:text-slate-100" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Settings
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text className="text-base font-semibold text-primary dark:text-slate-100 px-2">
                        Done
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 pb-28">
                {/* Account Section */}
                <View className="mt-6">
                    <Text className="mb-2 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                        Account
                    </Text>
                    <View className="border-y border-primary/5 bg-white dark:bg-slate-800/50">
                        <TouchableOpacity className="flex-row items-center gap-4 p-4 active:bg-primary/5">
                            <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/5">
                                <Image
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZIy9gJiH3Fd9N4k2yxDoAnHy5jAt_O0nfATBHoVAY6VwdI4IMFiq17K1-lhn1dFRpgFiAYTF6JpXyxDEAwhdSNgyrRwgVDmvzMISvLfcY205xlJ_N8u1Kjgi_Jv0SZ6NpbFCFJWJyGt8buadxj90ZA4S6MlKxRVDKh7KT7XI7znUDROLaCVHnTopreeG_TDyOjF-uWF7cPXf3eWytJAxJOKn7xZDbqrjkYiGo9RUpFaH0WIyr8wVC2yiCNhFdeulW4BOfh8ClZB0f" }}
                                    className="h-full w-full object-cover"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-slate-900 dark:text-white">
                                    Samuel Richards
                                </Text>
                                <Text className="text-sm text-slate-500 dark:text-slate-400">
                                    samuel.richards@email.com
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} className="text-slate-400" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App Settings Section */}
                <View className="mt-8">
                    <Text className="mb-2 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                        App Settings
                    </Text>
                    <View className="border-y border-primary/5 bg-white dark:bg-slate-800/50">

                        <TouchableOpacity className="flex-row items-center justify-between border-b border-primary/5 p-4 active:bg-primary/5">
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="language" size={24} className="text-primary/70 dark:text-slate-300" />
                                <Text className="font-semibold text-slate-900 dark:text-slate-100">Language</Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <Text className="text-sm text-slate-500">English</Text>
                                <MaterialIcons name="chevron-right" size={20} className="text-slate-400" />
                            </View>
                        </TouchableOpacity>

                        <View className="flex-row items-center justify-between border-b border-primary/5 p-4">
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="dark-mode" size={24} className="text-primary/70 dark:text-slate-300" />
                                <Text className="font-semibold text-slate-900 dark:text-slate-100">Dark Mode</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setIsDarkMode(!isDarkMode)}
                                className={`h-6 w-12 rounded-full px-1 justify-center transition-all ${isDarkMode ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}
                            >
                                <View className={`h-4 w-4 rounded-full bg-white shadow-sm transition-all ${isDarkMode ? "self-end" : "self-start"}`} />
                            </TouchableOpacity>
                        </View>

                        <View className="p-4">
                            <View className="mb-4 flex-row items-center gap-3">
                                <MaterialIcons name="format-size" size={24} className="text-primary/70 dark:text-slate-300" />
                                <Text className="font-semibold text-slate-900 dark:text-slate-100">Text Size</Text>
                            </View>
                            <View className="flex-row items-center gap-4 px-2">
                                <Text className="text-xs font-medium text-slate-400">A</Text>
                                <View className="relative flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 justify-center">
                                    <View className="absolute left-0 h-full w-1/2 rounded-full bg-primary dark:bg-accent" />
                                    <View className="absolute left-1/2 h-[18px] w-[18px] -translate-x-[9px] rounded-full border-2 border-white bg-primary shadow-md dark:border-slate-800" />
                                </View>
                                <Text className="text-xl font-medium text-slate-400">A</Text>
                            </View>
                        </View>

                    </View>
                </View>

                {/* Support Section */}
                <View className="mt-8">
                    <Text className="mb-2 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                        Support
                    </Text>
                    <View className="border-y border-primary/5 bg-white dark:bg-slate-800/50">
                        <TouchableOpacity className="flex-row items-center justify-between border-b border-primary/5 p-4 active:bg-primary/5">
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="verified-user" size={24} className="text-primary/70 dark:text-slate-300" />
                                <Text className="font-semibold text-slate-900 dark:text-slate-100">Privacy Policy</Text>
                            </View>
                            <MaterialIcons name="open-in-new" size={20} className="text-slate-400" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-primary/5">
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="info" size={24} className="text-primary/70 dark:text-slate-300" />
                                <Text className="font-semibold text-slate-900 dark:text-slate-100">About</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} className="text-slate-400" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sign Out & Version */}
                <View className="mt-10 px-6 space-y-6">
                    <TouchableOpacity className="mx-auto w-full max-w-xs rounded-xl border border-red-200 bg-white py-3.5 shadow-sm active:scale-95 dark:border-red-900/30 dark:bg-slate-800/30">
                        <Text className="text-center font-bold text-red-600 dark:text-red-400">
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                    <View className="pt-2 items-center">
                        <Text className="text-xs font-medium uppercase tracking-widest text-slate-400">
                            Manna Version 4.12.0
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
