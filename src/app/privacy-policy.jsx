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

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Welcome to Manna - The Bible Project. This application is created to help users
                    read, understand, and explore God's Word in Tamil and English through Bible
                    scriptures, study content, and overview videos.
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    We are committed to protecting your privacy and keeping data collection minimal.
                </Text>

                <Text className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    To provide a personalized experience and cloud synchronization, Manna now offers authentication options. We collect:
                </Text>

                <View className="mb-4 pl-4">
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Name and Profile Picture (provided by Google or entered manually)
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Email address (for account identification and security)
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Authentication Metadata (last login time, account creation date)
                    </Text>
                </View>

                <Text className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    The app may automatically process limited technical information required for app functionality, including:
                </Text>

                <View className="mb-6 pl-4">
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Device type and operating system
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • App performance and crash logs
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Language and locale settings
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Basic network and diagnostic information
                    </Text>
                </View>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    2. Cloud Sync and Preferences
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Your saved verses, bookmarks, and reading preferences are securely stored in the cloud (using Google Firebase) so that your library is accessible across any device where you log into your Manna account.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    3. How We Use Your Information
                </Text>
                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Your data is used strictly to enhance your app experience. We do not sell, rent, or share your personal information with third parties for marketing purposes.
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Any limited information processed by the app is used only for:
                </Text>

                <View className="mb-6 pl-4">
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Delivering Bible content
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Improving app stability and performance
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Maintaining saved preferences
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Ensuring proper app functionality
                    </Text>
                </View>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    4. Data Security
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    We use reasonable technical and organizational measures to help protect app data and communications. However, no electronic transmission or storage system can be guaranteed to be completely secure.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    5. Third-Party Services
                </Text>
                <Text className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    This application uses trusted third-party services to provide functionality and Bible content, including:
                </Text>

                <View className="mb-4 pl-4">
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • API.Bible for scripture content
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Google Firebase for Authentication and Cloud Database (Firestore)
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Zoho Catalyst for backend infrastructure and media storage
                    </Text>
                    <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">
                        • Expo framework services for app functionality
                    </Text>
                </View>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    These services may process limited technical information according to their own privacy policies.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    6. Children's Privacy
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Manna does not knowingly collect personal information from children under the age of 13.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    7. Account Data Rights
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Users have the right to access, update, or delete their account data at any time. If you wish to delete your account and all associated cloud-synced data, please contact our support team.
                </Text>

                {/* Section 8 */}
                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    8. Non-Commercial Purpose
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Manna - The Bible Project is developed primarily for spiritual, educational, and ministry purposes. The app is not intended for advertising, user profiling, or commercial data monetization.
                </Text>

                {/* Section 9 */}
                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    9. Bible Content and Copyright
                </Text>

                <Text className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Bible content and translations are provided through API.Bible and remain the property of their respective copyright owners. Video overview content is created for educational and spiritual purposes only.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    10. Changes to This Privacy Policy
                </Text>

                <Text className="mb-12 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    We may update this Privacy Policy from time to time. Any changes will be posted within the app and the policy will be updated in future. Continued use of the app after changes indicates acceptance of the new terms.
                </Text>

                <Text className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    11. Contact Information
                </Text>

                <Text className="mb-12 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    If you have any questions or concerns, please contact us at alex7358@cbcs@gmail.com.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
