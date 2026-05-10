import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as WebBrowser from 'expo-web-browser';

export default function AboutScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark">
            {/* Header */}
            <View className="flex-row items-center border-b border-slate-100 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-background-dark/80">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                >
                    <MaterialIcons name="arrow-back" size={24} color={isDark ? "white" : "#0f172a"} />
                </TouchableOpacity>
                <Text className="text-xl font-black text-slate-900 dark:text-white">
                    About App
                </Text>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6 pt-6 pb-12">
                <View className="items-center mb-8">
                    <View className="h-24 w-24 items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-800 shadow-sm mb-4">
                        <Image
                            source={require("../../assets/images/logo-gold.png")}
                            className="h-16 w-16"
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="text-3xl font-black text-slate-900 dark:text-white">Manna</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Version 1.2.0 • Secure & Personal</Text>
                </View>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 text-center px-4">
                    "Man shall not live by bread alone, but by every word that proceeds from the mouth of God."
                </Text>

                <View className="h-[1px] bg-slate-100 dark:bg-slate-800 mb-8" />

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    Our Mission
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
                    Manna is dedicated to providing a beautiful, personalized, and distraction-free environment for exploring the Word of God. We use secure authentication to ensure your spiritual journey—including your saved verses and media preferences—is portable and private across all your devices.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    Privacy First
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
                    We believe your spiritual life is private. Our transition to an account-based system is designed strictly to improve your experience through cloud syncing. We collect only the essential info needed for your account and never share your data.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    Features
                </Text>
                <View className="mb-6 pl-4">
                    <Text className="mb-2 text-base text-slate-600 dark:text-slate-300">• Bilingual Support (Tamil & English)</Text>
                    <Text className="mb-2 text-base text-slate-600 dark:text-slate-300">• Secure Google & Email Authentication</Text>
                    <Text className="mb-2 text-base text-slate-600 dark:text-slate-300">• Cloud-Synced Saved Verses</Text>
                    <Text className="mb-2 text-base text-slate-600 dark:text-slate-300">• Video Overviews and Study Guides</Text>
                </View>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    The Team
                </Text>
                <Text className="mb-12 text-base leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
                    This project is a labor of love developed for the spiritual nourishment of the believers and with Support, Strength of God above all. We are constantly working to improve the experience and add more valuable study resources.
                </Text>

                <Text className="mb-8 text-[10px] font-bold leading-relaxed text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Bible content powered by{" "}
                    <Text
                        className="text-blue-500 dark:text-blue-400 underline"
                        onPress={() => WebBrowser.openBrowserAsync('https://api.bible/')}
                    >
                        API.Bible
                    </Text>.{"\n"}
                    Scripture quotations are subject to respective publisher copyrights.
                </Text>

                <View className="items-center mb-12">
                    <Text className="text-slate-300 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                        © 2024 Manna - The Bible Project
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
