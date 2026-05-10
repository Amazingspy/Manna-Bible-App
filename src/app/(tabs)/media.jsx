import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { db } from "../../utils/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";




// Generic fallback image
const DEFAULT_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCCjkFgFt43P__x0myzEKO7JfzOSSv8sRTY1miBTjMV7aOIFltbceGkygTgXUCYoCUo18nJbipVvQ1QE4tLMJLyPsqUWKpdY4svdLG5afENqxfN9svTJhzRqETUHdLGzRfOh3AGCHa1anOzbT5TBY15xZuhXCuCERyD3FOf5syJd0I05dSojxuXu1hfxAl3qLqr18RWmz5YLcx_uZMAXedgjbeStxiPkkj2JuoJwxg-hXf-VWJ2fwMkdT4kBbQQiuz2YVkSnPG5PHTm";
const BASE_URL = "https://manna-60059371341.development.catalystserverless.in/server/manna_function/";


const CATEGORIES = [
    { id: "All", icon: "movie", title: "All" },
    { id: "Tamil", icon: "translate", title: "Tamil" },
    { id: "English", icon: "language", title: "English" }
];




// --- Helper Components & Renders (Moved outside for stability) ---

const RenderHeader = ({ searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory, isDark, onFeaturedPress, featuredSeries }) => (
    <View className="bg-white dark:bg-background-dark pb-4 border-b border-slate-100 dark:border-slate-800">
        {/* Elegant Top Header */}
        <View className="px-6 py-4">
            <View className="flex-row items-center justify-between">
                {/* <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                    <MaterialIcons name="menu" size={24} color={isDark ? "#f1f5f9" : "#0f172a"} />
                </TouchableOpacity> */}
                <Text className="text-xl font-black tracking-tighter text-primary dark:text-white text-center w-full">
                    Manna Media
                </Text>
                {/* <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                    <MaterialIcons name="account-circle" size={24} color={isDark ? "#94a3b8" : "#64748b"} />
                </TouchableOpacity> */}
            </View>
        </View>

        {/* Modern Search */}
        <View className="px-6 py-2 pb-4 mt-4">
            <View className="flex-row items-center h-12 rounded-2xl border border-slate-100 bg-slate-100/30 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                <MaterialIcons name="search" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                <TextInput
                    placeholder="Search overviews (e.g. Genesis)"
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="ml-3 flex-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <MaterialIcons name="close" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                    </TouchableOpacity>
                )}
            </View>
        </View>

        {/* Categories */}
        <View className="mb-4 mt-6">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingLeft: 24, paddingRight: 24 }}
            >
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            className="items-center gap-2 active:scale-95"
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <View className={`h-16 w-16 items-center justify-center rounded-[1.5rem] border ${isActive
                                ? "border-primary bg-primary dark:border-accent dark:bg-accent"
                                : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                                }`}>
                                <MaterialIcons
                                    name={cat.icon}
                                    size={24}
                                    color={isActive ? "white" : (isDark ? "#94a3b8" : "#64748b")}
                                />
                            </View>
                            <Text className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-primary dark:text-accent" : "text-slate-500"
                                }`}>
                                {cat.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>

        {/* Featured Series */}
        <View>
            <Text className="px-6 mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-8">
                Featured Series
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={null}
                contentContainerStyle={{ gap: 16, paddingLeft: 24, paddingRight: 24 }}
            >
                {featuredSeries.map((series) => (
                    <TouchableOpacity
                        key={series.id}
                        className="relative w-64 aspect-[16/9] overflow-hidden rounded-[2rem] shadow-xl active:scale-95"
                        onPress={() => onFeaturedPress(series)}
                    >
                        <Image
                            source={{ uri: series.img }}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <View className="absolute inset-0 bg-black/40" />
                        <View className="absolute bottom-0 w-full p-4">
                            <View className="mb-2 flex-row items-center gap-2">
                                <View className="rounded-full bg-accent/90 px-2 py-0.5">
                                    <Text className="text-[8px] font-black uppercase tracking-widest text-white">Series</Text>
                                </View>
                            </View>
                            <Text className="text-xl font-black leading-tight text-white mb-1">
                                {series.title}
                            </Text>
                            <Text className="text-[10px] font-medium text-white/80" numberOfLines={1}>
                                {series.desc}
                            </Text>
                        </View>
                        <View className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl">
                            <MaterialIcons name="play-arrow" size={24} className="text-primary ml-1" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    </View>
);

const VideoItem = ({ item, onPress }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        className="mx-6 mt-4 mb-6"
        onPress={onPress}
    >
        <View className="flex-row items-center gap-5">
            <View className="h-24 w-32 overflow-hidden rounded-2xl shadow-sm bg-slate-200 dark:bg-slate-800">
                <Image source={{ uri: item.img }} className="h-full w-full object-cover" />
                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                    <MaterialIcons name="play-circle" size={32} color="white" />
                </View>
            </View>
            <View className="flex-1 justify-center">
                <Text className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {item.title}
                </Text>
                <Text className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {item.length} • {item.category}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

const RenderEmpty = ({ loading, searchQuery }) => (
    <View className="py-10 items-center justify-center">
        {loading ? (
            <ActivityIndicator size="large" color="#1a355b" />
        ) : (
            <>
                <MaterialIcons name="video-library" size={48} color="#e2e8f0" />
                <Text className="mt-4 text-center text-slate-400 font-bold">No overviews found matching "{searchQuery}"</Text>
            </>
        )}
    </View>
);



export default function MediaScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [videos, setVideos] = useState([]);
    const [featuredSeries, setFeaturedSeries] = useState([]);
    const [categories, setCategories] = useState(CATEGORIES);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Videos");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // --- Fetch Videos from Catalyst ---
                const vRes = await fetch(`${BASE_URL}videos`);
                const vJson = await vRes.json();
                console.log("[Catalyst] Videos Response:", vJson);
                
                if (vJson.videos) {
                    let bucketUrl = vJson.bucketUrl;
                    if (bucketUrl && !bucketUrl.endsWith('/')) bucketUrl += '/';

                    const mappedVideos = vJson.videos.map((v, index) => {
                        const fileName = v.key.split('/').pop();
                        const cleanTitle = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
                        
                        // Detect language from key path
                        let lang = "Tamil"; // Default
                        if (v.key.toLowerCase().includes('english/')) lang = "English";
                        if (v.key.toLowerCase().includes('tamil/')) lang = "Tamil";

                        const finalUrl = `${bucketUrl}${v.key}`;
                        return {
                            id: `video-${index}`,
                            title: cleanTitle,
                            url: finalUrl,
                            category: lang,
                            length: "Video",
                            img: DEFAULT_IMG,
                            desc: `Overview for ${cleanTitle}`,
                            key: v.key
                        };
                    });
                    setVideos(mappedVideos);
                }

                // --- Fetch Featured Series from Catalyst ---
                const fRes = await fetch(`${BASE_URL}feature-series`);
                const fJson = await fRes.json();
                
                if (fJson.featureSeries) {
                    let bucketUrl = fJson.bucketUrl;
                    if (bucketUrl && !bucketUrl.endsWith('/')) bucketUrl += '/';

                    const mappedSeries = fJson.featureSeries.map((s, index) => {
                        const fileName = s.key.split('/').pop();
                        const cleanTitle = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
                        
                        let lang = "Tamil"; // Default
                        if (s.key.toLowerCase().includes('english/')) lang = "English";
                        if (s.key.toLowerCase().includes('tamil/')) lang = "Tamil";

                        const finalUrl = `${bucketUrl}${s.key}`;
                        return {
                            id: `series-${index}`,
                            title: cleanTitle,
                            img: DEFAULT_IMG,
                            desc: `Series on ${cleanTitle}`,
                            url: finalUrl,
                            category: lang,
                            length: "Series",
                            key: s.key
                        };
                    });
                    setFeaturedSeries(mappedSeries);
                }
            } catch (err) {
                console.error("Catalyst Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredVideos = videos.filter((v) => {
        const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
        const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const filteredSeries = featuredSeries.filter((s) => {
        const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark pb-6">
            <View className="flex-1">
                <RenderHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    isDark={isDark}
                    onFeaturedPress={(item) => {
                        console.log("[Media] Featured Series Pressed:", item);
                        router.push({
                            pathname: '/video/player',
                            params: { 
                                ...item, 
                                url: encodeURIComponent(item.url),
                                description: item.desc 
                            }
                        });
                    }}
                    featuredSeries={featuredSeries}
                />

                <View className="mx-6 mt-6 mb-2 flex-row items-center rounded-3xl bg-slate-100 p-1.5 dark:bg-slate-800/60">
                    {['Videos', 'Bible Genealogy'].map((tab) => {
                        const isActive = tab === 'Videos';
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => {
                                    if (tab === 'Bible Genealogy') {
                                        router.push('/familytree');
                                    }
                                }}
                                className="flex-1 items-center justify-center rounded-2xl py-2.5"
                                style={{
                                    backgroundColor: isActive ? (isDark ? '#334155' : 'white') : 'transparent',
                                }}
                            >
                                <Text style={{ fontSize: 12, letterSpacing: 0.6, color: isActive ? (isDark ? '#ffffff' : '#0f172a') : '#64748b' }} className="font-black uppercase">
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View className="flex-1">
                    <View className="px-6 pt-4 pb-2">
                        <Text className="text-lg font-black text-slate-900 dark:text-white">
                            Video Overviews
                        </Text>
                    </View>
                    <FlatList
                        data={filteredVideos}
                        keyExtractor={(item) => item.id}
                        extraData={searchQuery}
                        renderItem={({ item }) => (
                            <VideoItem
                                item={item}
                                onPress={() => router.push({
                                    pathname: '/video/player',
                                    params: { 
                                        ...item, 
                                        url: encodeURIComponent(item.url),
                                        description: item.desc 
                                    }
                                })}
                            />
                        )}
                        ListEmptyComponent={<RenderEmpty loading={loading} searchQuery={searchQuery} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
