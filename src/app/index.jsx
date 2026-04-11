import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <ImageBackground
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7vsEivt7OV2iDCX2K0aCGVBOSRY6msEkot1aAC14ujGxDYX5LIVhbyIZS5sI1Fy2IWCCwJzmOoChB3ZUiZq8t-kNpH0ud6-p0tIupLQF4H6lvCsDu8jeyBGyaJ2YjokDM_D9Psi6OoXGHnv4Gq4BIMpxSXXvXUWlNLTSwiA7ASNaqrd6MAgg4VmkyLAeAXL5kCJ3axeH0fyBRTOEImMKMEjPPq4qmyEX7zcfprE5O2l36toDbaG1EI_T7y7MagTntxuI60zRn707" }}
                className="flex-1"
                resizeMode="cover"
            >
                <View className="flex-1 bg-black/40">
                    <SafeAreaView className="flex-1 px-8 py-12">
                        {/* Branding Section */}
                        <View className="flex-1 items-center justify-center">
                            <View className="mb-6 h-36 w-36 items-center justify-center rounded-[3rem] bg-white/10 backdrop-blur-3xl ring-1 ring-white/20 overflow-hidden">
                                <Image 
                                    source={require("../../assets/images/logo-gold.png")} 
                                    className="h-full w-full"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-7xl font-black tracking-tighter text-white">
                                Manna
                            </Text>
                            <Text className="mt-2 text-xl font-medium tracking-widest uppercase text-white/80">
                                Your Daily Bread
                            </Text>
                        </View>

                        {/* Quote Box (Glassmorphism) */}
                        <View className="mb-12 rounded-[2rem] border border-white/25 bg-white/20 p-8 backdrop-blur-xl">
                            <MaterialIcons name="format-quote" size={32} color="rgba(255, 255, 255, 0.4)" />
                            <Text className="text-lg font-bold italic leading-snug text-white">
                                "I am the living bread that came down from heaven."
                            </Text>
                            <Text className="text-md font-bold italic leading-snug text-white">
                                "நானே வானத்திலிருந்திறங்கின ஜீவ அப்பம்."
                            </Text>
                            <View className="mt-4 flex-row items-center border-t border-white/10 pt-4">
                                <View className="h-1 w-8 rounded-full bg-accent" />
                                <Text className="ml-3 text-sm font-bold uppercase tracking-widest text-white/100">
                                    John(யோவான்) 6:51
                                </Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="gap-4 w-full">
                            <TouchableOpacity
                                onPress={() => router.push("/signup")}
                                activeOpacity={0.6}
                                className="h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#FFD700] shadow-2xl active:scale-95"
                            >
                                <Text className="text-lg font-bold tracking-tight text-slate-900">Get Started</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/login")}
                                className="h-16 w-full items-center justify-center rounded-2xl border border-white/60 bg-white/10 backdrop-blur-md active:scale-95"
                                activeOpacity={0.6}>
                                <Text className="text-lg font-bold text-white">Sign In</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Disclaimer/Footer */}
                        <Text className="mt-8 text-center text-[10px] font-medium uppercase tracking-widest text-white/40">
                            v4.12.0 • Spiritual Nourishment
                        </Text>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </View>
    );
}
