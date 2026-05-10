import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function TermsAndConditionsScreen() {
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
                    Terms & Conditions
                </Text>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6 pt-6 pb-12">
                <Text className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                    Terms and Conditions
                </Text>

                <Text className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Last updated: {new Date().toLocaleDateString()}
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    By using Manna - The Bible Project, you agree to the following terms and conditions. Please read them carefully.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    1. Use of Content
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    The Bible text and translations provided in this app are for personal, spiritual, and educational use. All scriptures are provided through API.Bible and remain the property of their respective copyright holders.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    2. User Conduct
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    You agree to use the app in a manner consistent with its purpose—to read and study God's Word. You may not use the app for any commercial purposes or in any way that violates the rights of others.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    3. User Accounts and Security
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    To access personalized features like cloud-synced saved verses, you must create an account. You are responsible for maintaining the security of your account and for all activities that occur under your account. We reserve the right to suspend accounts that violate our terms or mission.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    4. Intellectual Property
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    The Manna brand, logo, and custom app design are the property of Manna - The Bible Project. You may not reproduce or distribute these elements without explicit permission.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    5. Disclaimer of Warranties
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    The app is provided "as is" without any warranties. While we strive to provide accurate content and a stable experience, we cannot guarantee that the app will always be error-free or uninterrupted.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    6. Limitation of Liability
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Manna - The Bible Project shall not be liable for any damages arising from your use or inability to use the application.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    7. Changes to Terms
                </Text>
                <Text className="mb-12 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    We reserve the right to modify these terms at any time. Your continued use of the app after changes are made constitutes your acceptance of the new terms.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    8. Contact
                </Text>
                <Text className="mb-12 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    If you have questions regarding these terms, please reach out to us at alex7358@cbcs@gmail.com.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
