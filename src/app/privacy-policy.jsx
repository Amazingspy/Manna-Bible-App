import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function PrivacyPolicyScreen() {
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
                    Privacy Policy
                </Text>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6 pt-6 pb-12">
                <Text className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                    Privacy Policy
                </Text>
                
                <Text className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Last updated: {new Date().toLocaleDateString()}
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    1. Information We Collect
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    We collect minimal information necessary to provide you with the best Bible reading experience. This may include your saved verses, highlights, and reading preferences, which are stored locally on your device or synced securely if you create an account.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    2. How We Use Your Information
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Your data is used strictly to enhance your app experience. We do not sell, rent, or share your personal information with third parties for marketing purposes.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    3. Data Security
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    We implement standard security measures to protect your data. All communication between the app and our servers is encrypted.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    4. Third-Party Services
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    We may use third-party services (like API.Bible) to fetch scriptures. These services may collect basic usage data subject to their own privacy policies.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    5. Contact Us
                </Text>
                <Text className="mb-12 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    If you have any questions about this Privacy Policy, please contact us at *********@mail.ccom.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
