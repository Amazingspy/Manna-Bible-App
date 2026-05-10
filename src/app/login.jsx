import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import CustomAlert from '../components/CustomAlert';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { signIn, signInWithGoogleCredential } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '' });

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '558492053164-cr196kts60lqgh2fd88g97hrsol44ubk.apps.googleusercontent.com',
        androidClientId: '558492053164-cr196kts60lqgh2fd88g97hrsol44ubk.apps.googleusercontent.com',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        }
    }, [response]);

    const handleGoogleSignIn = async (idToken) => {
        setLoading(true);
        try {
            await signInWithGoogleCredential(idToken);
            router.replace('/(tabs)');
        } catch (error) {
            setAlertConfig({
                visible: true,
                title: "Login Failed",
                message: error.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(').', '')
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Input Error", "Please enter your email and password.");
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            router.replace('/(tabs)');
        } catch (error) {
            setAlertConfig({
                visible: true,
                title: "Login Failed",
                message: error.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(').', '')
            });
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
                <View className="flex-1 bg-[#1B365C]/80 backdrop-blur-3xl">
                    <SafeAreaView className="flex-1 px-8">
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            className="flex-1 justify-center"
                        >
                            {/* Branding */}
                            <View className="items-center mb-10">
                                <View className="h-24 w-24 items-center justify-center rounded-[2rem] bg-white/10 backdrop-blur-2xl ring-1 ring-white/20 mb-4">
                                    <MaterialIcons name="bakery-dining" size={48} color="#FFD700" />
                                </View>
                                <Text className="text-4xl font-extrabold text-white tracking-tighter">Welcome Back</Text>
                                <Text className="text-white/60 text-lg mt-1 font-medium tracking-wide">Continue your spiritual journey</Text>
                            </View>

                            {/* Glassmorphism Form Container */}
                            <View className="bg-white/10 border border-white/20 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-2xl">
                                <View className="gap-6">
                                    {/* Email Field */}
                                    <View>
                                        <Text className="text-white/80 text-sm font-bold uppercase tracking-widest ml-1 mb-2">Email Address</Text>
                                        <View className="flex-row items-center bg-black/20 rounded-2xl border border-white/10 px-4 h-14">
                                            <MaterialIcons name="alternate-email" size={20} color="rgba(255,255,255,0.4)" />
                                            <TextInput
                                                className="flex-1 ml-3 text-white font-medium"
                                                placeholder="Enter your email"
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>

                                    {/* Password Field */}
                                    <View>
                                        <Text className="text-white/80 text-sm font-bold uppercase tracking-widest ml-1 mb-2">Password</Text>
                                        <View className="flex-row items-center bg-black/20 rounded-2xl border border-white/10 px-4 h-14">
                                            <MaterialIcons name="lock-outline" size={20} color="rgba(255,255,255,0.4)" />
                                            <TextInput
                                                className="flex-1 ml-3 text-white font-medium"
                                                placeholder="Enter your password"
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                secureTextEntry={!showPassword}
                                                value={password}
                                                onChangeText={setPassword}
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="rgba(255,255,255,0.4)" />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity className="mt-3 items-end">
                                            <Text className="text-[#FFD700] text-xs font-bold tracking-widest">Forgot Password?</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Login Button */}
                                    <TouchableOpacity
                                        onPress={handleLogin}
                                        disabled={loading}
                                        className={`h-16 w-full items-center justify-center rounded-2xl shadow-2xl mt-4 ${loading ? 'bg-white/20' : 'bg-[#FFD700]'}`}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text className="text-slate-900 text-lg font-bold tracking-tight uppercase">Sign In</Text>
                                        )}
                                    </TouchableOpacity>

                                    {/* Google Sign In Button */}
                                    <TouchableOpacity
                                        onPress={() => promptAsync()}
                                        disabled={!request || loading}
                                        className={`h-16 w-full flex-row items-center justify-center rounded-2xl border border-white/20 bg-white/5 active:bg-white/10 ${(!request || loading) ? 'opacity-50' : ''}`}
                                    >
                                        <Ionicons name="logo-google" size={20} color="white" className="mr-3" />
                                        <Text className="text-white text-base font-bold tracking-tight ml-2">Continue with Google</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Footer */}
                            <View className="mt-10 items-center">
                                <View className="flex-row mb-6 items-center w-full">
                                    <View className="flex-1 h-[1px] bg-white/10" />
                                    <Text className="mx-4 text-white/30 text-xs font-bold tracking-[3px] uppercase">Or Join Now</Text>
                                    <View className="flex-1 h-[1px] bg-white/10" />
                                </View>
                                
                                <TouchableOpacity onPress={() => router.push('/signup')} className="flex-row items-center">
                                    <Text className="text-white/60 text-base font-medium">Don't have an account? </Text>
                                    <Text className="text-[#FFD700] text-base font-bold underline">Create Account</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </View>
            </ImageBackground>

            <CustomAlert 
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
            />
        </View>
    );
}
