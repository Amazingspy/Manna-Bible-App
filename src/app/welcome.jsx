import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
                {/* Top Bar */}
                <View className="flex-row items-center justify-between px-4 py-4">
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-primary/5">
                        <MaterialIcons name="menu" size={24} className="text-primary dark:text-slate-100" />
                    </TouchableOpacity>
                    <Text className="text-xl font-extrabold tracking-tight text-primary dark:text-slate-100">
                        Manna
                    </Text>
                    <View className="h-10 w-10" />
                </View>

                {/* Hero Image Section */}
                <View className="px-5 py-2">
                    <View className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7vsEivt7OV2iDCX2K0aCGVBOSRY6msEkot1aAC14ujGxDYX5LIVhbyIZS5sI1Fy2IWCCwJzmOoChB3ZUiZq8t-kNpH0ud6-p0tIupLQF4H6lvCsDu8jeyBGyaJ2YjokDM_D9Psi6OoXGHnv4Gq4BIMpxSXXvXUWlNLTSwiA7ASNaqrd6MAgg4VmkyLAeAXL5kCJ3axeH0fyBRTOEImMKMEjPPq4qmyEX7zcfprE5O2l36toDbaG1EI_T7y7MagTntxuI60zRn707" }}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* Gradient Overlay using absolute View and semi-transparent background color (Native tailwind gradient support is limited, using simple dark overlay) */}
                        <View className="absolute inset-0 bg-black/40" />
                        <View className="absolute bottom-0 left-0 right-0 p-8">
                            <View className="mb-4 self-start rounded-full bg-accent/90 px-4 py-1.5 backdrop-blur-md">
                                <Text className="text-[10px] font-bold uppercase tracking-widest text-white">
                                    Today's Reflection
                                </Text>
                            </View>
                            <Text className="text-2xl font-light italic leading-snug text-white">
                                "Give us this day our daily bread..."
                            </Text>
                            <Text className="mt-2 text-xs font-bold uppercase tracking-widest text-white/60">
                                Matthew 6:11
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Brand Branding */}
                <View className="items-center px-8 pt-10 pb-8 text-center">
                    <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-primary/5 dark:bg-primary/20">
                        <MaterialIcons name="bakery-dining" size={48} className="text-accent" />
                    </View>
                    <Text className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                        Manna
                    </Text>
                    <Text className="mt-2 text-xl font-bold tracking-tight text-primary dark:text-accent">
                        Your Daily Bread of Life
                    </Text>
                    <Text className="mt-4 text-center text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                        Experience spiritual nourishment every day with curated scriptures and guided reflections.
                    </Text>
                </View>

                {/* Action Buttons */}
                <View className="mt-auto w-full px-8 pb-10 pt-8 gap-4">
                    <TouchableOpacity
                        onPress={() => router.replace("/(tabs)")}
                        className="flex h-16 w-full items-center justify-center rounded-2xl bg-primary shadow-lg active:scale-95"
                    >
                        <Text className="text-lg font-bold text-white">Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex h-16 w-full items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 active:scale-95">
                        <Text className="text-lg font-bold text-primary dark:text-slate-100">Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="mt-4 items-center justify-center">
                        <Text className="text-sm font-medium text-slate-400">
                            New here? <Text className="font-bold text-accent underline">Join the community</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Features Footer */}
                <View className="flex-row items-center justify-around px-8 pb-12">
                    <TouchableOpacity className="items-center gap-2">
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                            <MaterialIcons name="menu-book" size={24} className="text-slate-400" />
                        </View>
                        <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Read</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center gap-2">
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                            <MaterialIcons name="self-improvement" size={24} className="text-slate-400" />
                        </View>
                        <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Meditate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center gap-2">
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                            <MaterialIcons name="groups" size={24} className="text-slate-400" />
                        </View>
                        <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Share</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
