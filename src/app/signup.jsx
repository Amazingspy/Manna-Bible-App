import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
    const { authenticateWithJwt } = useAuth();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        if (!email || !firstName) {
            Alert.alert("Input Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            // Using the new centralized JWT authentication helper
            await authenticateWithJwt(email, firstName, lastName);
            router.replace('/(tabs)');
        } catch (error) {
            console.error("Signup Error:", error);
            Alert.alert("Signup Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <ImageBackground
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7vsEivt7OV2iDCX2K0aCGVBOSRY6msEkot1aAC14ujGxDYX5LIVhbyIZS5sI1Fy2IWCCwJzmOoChB3ZUiZq8t-kNpH0ud6-p0tIupLQF4H6lvCsDu8jeyBGyaJ2YjokDM_D9Psi6OoXGHnv4Gq4BIMpxSXXvXUWlNLTSwiA7ASNaqrd6MAgg4VmkyLAeAXL5kCJ3axeH0fyBRTOEImMKMEjPPq4qmyEX7zcfprE5O2l36toDbaG1EI_T7y7MagTntxuI60zRn707" }}
                className="flex-1"
                resizeMode="cover"
            >
                <View className="flex-1 bg-[#1B365C]/85 backdrop-blur-3xl">
                    <SafeAreaView className="flex-1 px-8">
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            className="flex-1"
                        >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 40 }}>
                                {/* Branding */}
                                <View className="items-center mb-10">
                                    <View className="h-20 w-20 items-center justify-center rounded-[1.8rem] bg-white/10 backdrop-blur-2xl ring-1 ring-white/20 mb-4">
                                        <MaterialIcons name="bakery-dining" size={40} color="#FFD700" />
                                    </View>
                                    <Text className="text-4xl font-extrabold text-white tracking-tighter text-center">Join Manna</Text>
                                    <Text className="text-white/60 text-base mt-2 font-medium tracking-wide text-center px-4">Create your account to start receiving your daily bread.</Text>
                                </View>

                                {/* Form Container */}
                                <View className="bg-white/10 border border-white/20 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-2xl">
                                    <View className="gap-5">
                                        <View className="flex-row gap-4">
                                            <View className="flex-1">
                                                <Text className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1 mb-2">First Name</Text>
                                                <TextInput
                                                    className="bg-black/20 rounded-2xl border border-white/10 px-4 h-12 text-white font-medium"
                                                    placeholder="First Name"
                                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                                    value={firstName}
                                                    onChangeText={setFirstName}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Last Name</Text>
                                                <TextInput
                                                    className="bg-black/20 rounded-2xl border border-white/10 px-4 h-12 text-white font-medium"
                                                    placeholder="Last Name"
                                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                                    value={lastName}
                                                    onChangeText={setLastName}
                                                />
                                            </View>
                                        </View>

                                        <View>
                                            <Text className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Email Address</Text>
                                            <TextInput
                                                className="bg-black/20 rounded-2xl border border-white/10 px-4 h-14 text-white font-medium"
                                                placeholder="email@example.com"
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>

                                        <View>
                                            <Text className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Create Password</Text>
                                            <View className="flex-row items-center bg-black/20 rounded-2xl border border-white/10 px-4 h-14">
                                                <TextInput
                                                    className="flex-1 text-white font-medium"
                                                    placeholder="••••••••"
                                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                                    secureTextEntry={!showPassword}
                                                    value={password}
                                                    onChangeText={setPassword}
                                                />
                                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="rgba(255,255,255,0.4)" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={handleSignup}
                                            disabled={loading}
                                            className={`h-16 w-full items-center justify-center rounded-2xl shadow-2xl mt-4 ${loading ? 'bg-white/20' : 'bg-[#FFD700]'}`}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text className="text-slate-900 text-lg font-bold tracking-tight uppercase">Get Started</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Footer */}
                                <View className="mt-10 items-center">
                                    <TouchableOpacity onPress={() => router.push('/login')} className="flex-row items-center bg-white/5 px-6 py-3 rounded-full border border-white/10">
                                        <Text className="text-white/60 text-base font-medium">Already have an account? </Text>
                                        <Text className="text-[#FFD700] text-base font-bold">Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </View>
    );
}
