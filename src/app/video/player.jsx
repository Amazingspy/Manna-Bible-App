import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

export default function VideoPlaybackScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Extract parameters and decode the URL specifically
    const { title, url: encodedUrl, description, category, img, length, allVideos: allVideosRaw } = params;
    const url = encodedUrl ? decodeURIComponent(encodedUrl) : '';
    const nextVideos = allVideosRaw ? JSON.parse(allVideosRaw) : [];

    // Log the constructed URL to show it's being used directly
    console.log(`[Playback] Using Zoho URL: ${url}`);

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

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing || false });
    const { status, error } = useEvent(player, 'statusChange', { status: player.status });

    // Track state changes and potential errors
    useEffect(() => {
        if (status === 'error') {
            console.error(`[VideoPlayer Error] Failed to load source: ${url}`);
            console.error(`[VideoPlayer Error Details]`, error);
        }
        if (status === 'readyToPlay') {
            console.log(`[VideoPlayer] Source is ready: ${title}`);
        }
    }, [status, error, url, title]);

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
                {/* Video Player - Accessing URL directly */}
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
                    {/* <TouchableOpacity
                        className="mt-8 flex-row items-center justify-center bg-primary dark:bg-accent h-14 rounded-2xl shadow-lg active:scale-[0.98]"
                        onPress={() => { }}
                    >
                        <MaterialIcons name="menu-book" size={20} color="white" />
                        <Text className="ml-3 text-base font-black text-white">Read {title?.split(' ')[0]} Chapter 1</Text>
                    </TouchableOpacity> */}

                    {/* Scripture Reference */}
                    <View className="mt-8">
                        <Text className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Scripture Reference</Text>
                        <View className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex-row items-center justify-between">
                            <View className="flex-row items-center justify-center w-full">
                                <MaterialIcons name="menu-book" size={20} className="text-primary dark:text-accent" />
                                <Text className="ml-3 text-base font-bold text-slate-900 dark:text-white">{title.split(':')[0]} 1 - {length.includes('MB') ? '50' : 'End'}</Text>
                            </View>
                            {/* <TouchableOpacity>
                                <MaterialIcons name="chevron-right" size={24} className="text-slate-300" />
                            </TouchableOpacity> */}
                        </View>
                    </View>

                    {/* Key Themes */}
                    <View className="mt-8">
                        <Text className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Key Themes</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['Divine Creation', 'Human Agency', 'Covenant', 'Restoration'].map((theme, i) => (
                                <View key={i} className="bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/5">
                                    <Text className="text-xs font-bold text-slate-600 dark:text-slate-300">#{theme.replace(' ', '')}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Divider */}
                    {/* <View className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full mt-10 mb-8" /> */}

                    {/* Next in Series - Real Data */}
                    {/* {nextVideos.length > 0 && (
                        <View className="mb-10">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-lg font-black text-slate-900 dark:text-white">Next in Series</Text>
                                <TouchableOpacity>
                                    <Text className="text-sm font-bold text-primary dark:text-accent">View All</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                                {nextVideos.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        className="w-56"
                                        onPress={() => router.push({
                                            pathname: '/video/player',
                                            params: {
                                                ...item,
                                                url: encodeURIComponent(item.url),
                                                allVideos: allVideosRaw // Pass the list forward
                                            }
                                        })}
                                    >
                                        <View className="h-32 w-full rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800">
                                            <Image
                                                source={{ uri: item.img }}
                                                className="h-full w-full"
                                                style={{ resizeMode: 'cover' }}
                                            />
                                            <View className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                                                <Text className="text-[10px] font-bold text-white uppercase tracking-tighter">{item.length}</Text>
                                            </View>
                                        </View>
                                        <Text className="mt-3 text-sm font-black text-slate-900 dark:text-white leading-tight" numberOfLines={2}>
                                            {item.title}
                                        </Text>
                                        <Text className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {item.category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )} */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
