import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

export default function VideoPlaybackScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // Extract parameters passed from the media list
    const { id, title, url, description, category, img, length } = params;

    const player = useVideoPlayer({
        uri: url,
        useCaching: true,
        metadata: {
            title: title || 'Manna Video',
            artist: 'Manna Bible App'
        }
    }, (player) => {
        player.loop = false;
        player.play();
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    const { status } = useEvent(player, 'statusChange', { status: player.status });

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this Bible overview: ${title}\n${url}`,
                title: title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-background-dark border-b border-slate-100 dark:border-slate-800">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5"
                >
                    <MaterialIcons name="arrow-back" size={24} className="text-slate-900 dark:text-white" />
                </TouchableOpacity>
                
                <Text className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Book Overview
                </Text>
                
                <TouchableOpacity 
                    onPress={handleShare}
                    className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5"
                >
                    <MaterialIcons name="share" size={22} className="text-slate-900 dark:text-white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Video Player */}
                <View className="w-full aspect-video bg-black shadow-lg relative overflow-hidden">
                    <VideoView
                        style={{ flex: 1 }}
                        player={player}
                        contentFit="contain"
                        allowsFullscreen
                        allowsPictureInPicture
                    />
                    
                    {/* Loading Indicator */}
                    {status === 'loading' && (
                        <View className="absolute inset-0 items-center justify-center bg-black/40">
                            <ActivityIndicator size="large" color="#ffffff" />
                        </View>
                    )}
                </View>

                {/* Content Info */}
                <View className="p-6">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-4">
                            <Text className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                {title}
                            </Text>
                            <Text className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-primary dark:text-accent">
                                {category} • {length}
                            </Text>
                        </View>
                        <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5">
                            <MaterialIcons name="bookmark-outline" size={24} className="text-slate-400" />
                        </TouchableOpacity>
                    </View>

                    <Text className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                        {description || "Explore the divine narrative and historical context of this sacred text. This series provides a comprehensive overview designed to deepen your understanding of God's redemptive plan throughout history."}
                    </Text>

                    {/* CTA Button */}
                    <TouchableOpacity 
                        className="mt-8 flex-row items-center justify-center bg-primary dark:bg-accent h-14 rounded-2xl shadow-lg active:scale-[0.98]"
                        onPress={() => {}}
                    >
                        <MaterialIcons name="menu-book" size={20} color="white" />
                        <Text className="ml-3 text-base font-black text-white">Read {title.split(' ')[0]} Chapter 1</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full mt-10 mb-8" />

                    {/* Next in Series */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-lg font-black text-slate-900 dark:text-white">Next in Series</Text>
                        <TouchableOpacity>
                            <Text className="text-sm font-bold text-primary dark:text-accent">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Horizontal Recommendations (Placeholders) */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                        {[1, 2, 3].map(i => (
                            <View key={i} className="w-56 mb-10">
                                <View className="h-32 w-full rounded-3xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800">
                                    <Image 
                                        source={{ uri: img || 'https://lh3.googleusercontent.com/...' }} 
                                        className="h-full w-full object-cover"
                                    />
                                    <View className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                                        <Text className="text-[10px] font-bold text-white uppercase tracking-tighter">12:45</Text>
                                    </View>
                                </View>
                                <Text className="mt-3 text-sm font-black text-slate-900 dark:text-white leading-tight" numberOfLines={2}>
                                    The Context of {title} - Part {i + 1}
                                </Text>
                                <Text className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Manna Basics
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
