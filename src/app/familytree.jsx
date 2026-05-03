import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import WebView from "react-native-webview";
import { genealogyHtml } from "../constants/genealogyHtml";

export default function FamilyTreeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'INFO') {
                setSelectedInfo({ name: data.name, desc: data.desc });
            }
        } catch (error) {
            console.log('Error parsing message from WebView', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f7f5f0] dark:bg-slate-900" edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Overlay */}
            <View className="absolute top-12 left-0 right-0 z-50 flex-row items-center justify-between px-6 pointer-events-box-none">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-12 w-12 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    <MaterialIcons name="arrow-back" size={24} color={isDark ? '#f8fafc' : '#0f172a'} />
                </TouchableOpacity>
                <View className="bg-white/90 dark:bg-slate-800/90 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Text className="text-slate-900 dark:text-slate-100 font-black uppercase tracking-widest text-xs">
                        Bible Genealogy
                    </Text>
                </View>
                <View className="w-12 h-12 pointer-events-none" />
            </View>

            {/* Interactive HTML Viewer */}
            <View className="flex-1 bg-[#f7f5f0] dark:bg-slate-900">
                {loading && (
                    <View className="absolute inset-0 z-10 items-center justify-center bg-[#f7f5f0] dark:bg-slate-900">
                        <ActivityIndicator size="large" color="#f97316" />
                        <Text className="text-slate-500 dark:text-slate-400 mt-4 font-bold text-xs uppercase tracking-widest">Loading Diagram...</Text>
                    </View>
                )}

                <WebView
                    originWhitelist={['*']}
                    source={{ html: genealogyHtml }}
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                    onLoadEnd={() => setLoading(false)}
                    scalesPageToFit={true}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    setBuiltInZoomControls={true}
                    setDisplayZoomControls={false}
                    onMessage={handleMessage}
                />
            </View>

            {selectedInfo && (
                <View className="absolute bottom-8 left-4 right-4 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xl border border-slate-200 dark:border-slate-700 flex-row justify-between items-start z-50">
                    <View className="flex-1 pr-4">
                        <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-1">{selectedInfo.name}</Text>
                        <Text className="text-slate-600 dark:text-slate-300 text-sm leading-5">{selectedInfo.desc}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => setSelectedInfo(null)}
                        className="bg-slate-100 dark:bg-slate-700 h-8 w-8 rounded-full items-center justify-center"
                    >
                        <MaterialIcons name="close" size={18} color={isDark ? '#cbd5e1' : '#475569'} />
                    </TouchableOpacity>
                </View>
            )}

            {!selectedInfo && (
                <View className="absolute bottom-12 left-0 right-0 items-center pointer-events-none">
                    <View className="bg-white/90 dark:bg-slate-800/90 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Text className="text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                            Pinch to zoom • Drag to pan • Tap for info
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
