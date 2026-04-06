import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

const API_BASE = 'https://manna-60059371341.development.catalystserverless.in/server/manna_function';


// Mock Data for Featured Series
const FEATURED_SERIES = [
    {
        id: "s1",
        title: "Wisdom Literature",
        desc: "Explore the heart of Ecclesiastes & Job.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5S0EumXpQ830fo8DzkldEaiah6_QmINki6pwfyoz3LLlFIYFQxG2bTSipkdvjwooCjqyOJSuSYSEuscMwWIGKAjOkSL8RMWGq6_vNRGKgl8WhBw_4DqZp05uMgFueoV42TQf9SE01FGhmwZxquowl2kMkcu9lwmZcyt9Va4L4OqZ0GHKeEtcW8pVdSK_kJeVf9q_TVZ19DCfaUVj6rDL71IppmlIJ132c-j1PanApS3yN1m9HXWJk8HAe3-h60wnTdpvF90TmsibN"
    },
    {
        id: "s2",
        title: "The Royal Priest",
        desc: "Discover humanity's calling to rule with God.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSxL_WsfjA7JNfBJDhyzWok_XhEGJN8mqEZ2yK-kalzyUj_YTSZW80K0fXTRT53VrRyM7mMLdTvQHhk8EcBDrXtLvZJlQteUb6_7pvkVk23leQOxjq7_YbuWr29g-6uquOmDv2UbrmuNivMcD7_fe_EExCxy2xiJXZIb_qGBMvOBStX0s-9dyix5xJV56_0M_Pe5aWZh8WQ_Lm6HBaqwuvg3Ur7blKr7A-3J9tpZK9aMdNTgTuGwck3d60g67zpTtczGl0GZ-WOGem"
    },
    {
        id: "s3",
        title: "Sabbath",
        desc: "The pattern of trusting God's provision.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCjkFgFt43P__x0myzEKO7JfzOSSv8sRTY1miBTjMV7aOIFltbceGkygTgXUCYoCUo18nJbipVvQ1QE4tLMJLyPsqUWKpdY4svdLG5afENqxfN9svTJhzRqETUHdLGzRfOh3AGCHa1anOzbT5TBY15xZuhXCuCERyD3FOf5syJd0I05dSojxuXu1hfxAl3qLqr18RWmz5YLcx_uZMAXedgjbeStxiPkkj2JuoJwxg-hXf-VWJ2fwMkdT4kBbQQiuz2YVkSnPG5PHTm"
    }
];

// Generic fallback image
const DEFAULT_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCCjkFgFt43P__x0myzEKO7JfzOSSv8sRTY1miBTjMV7aOIFltbceGkygTgXUCYoCUo18nJbipVvQ1QE4tLMJLyPsqUWKpdY4svdLG5afENqxfN9svTJhzRqETUHdLGzRfOh3AGCHa1anOzbT5TBY15xZuhXCuCERyD3FOf5syJd0I05dSojxuXu1hfxAl3qLqr18RWmz5YLcx_uZMAXedgjbeStxiPkkj2JuoJwxg-hXf-VWJ2fwMkdT4kBbQQiuz2YVkSnPG5PHTm";


const CATEGORIES = [
    { id: "All", icon: "movie", title: "All" },
    { id: "Torah", icon: "auto-stories", title: "Torah" },
    { id: "History", icon: "history-edu", title: "History" },
    { id: "Wisdom", icon: "psychology", title: "Wisdom" },
    { id: "Prophets", icon: "campaign", title: "Prophets" },
    { id: "Gospel", icon: "menu-book", title: "Gospels" },
    { id: "Letters", icon: "mail", title: "Letters" }
];





// --- Helper Components & Renders (Moved outside for stability) ---

const RenderHeader = ({ searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory }) => (
    <View className="bg-white dark:bg-background-dark pb-4 border-b border-slate-100 dark:border-slate-800">
        {/* Elegant Top Header */}
        <View className="px-6 py-4">
            <View className="flex-row items-center justify-between">
                <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                    <MaterialIcons name="menu" size={24} className="text-slate-900 dark:text-slate-100" />
                </TouchableOpacity>
                <Text className="text-xl font-black tracking-tighter text-primary dark:text-white">
                    Manna Media
                </Text>
                <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                    <MaterialIcons name="account-circle" size={24} className="text-slate-400 dark:text-slate-500" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Modern Search */}
        <View className="px-6 py-2 pb-4 mt-4">
            <View className="flex-row items-center h-12 rounded-2xl border border-slate-100 bg-slate-100/30 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                <MaterialIcons name="search" size={20} className="text-slate-400" />
                <TextInput
                    placeholder="Search overviews (e.g. Genesis)"
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="ml-3 flex-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <MaterialIcons name="close" size={20} className="text-slate-400" />
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
                                    color={isActive ? "white" : "#94a3b8"}
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
                {FEATURED_SERIES.map((series) => (
                    <View key={series.id} className="relative w-64 aspect-[16/9] overflow-hidden rounded-[2rem] shadow-xl">
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
                        <TouchableOpacity className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl active:scale-90">
                            <MaterialIcons name="play-arrow" size={24} className="text-primary ml-1" />
                        </TouchableOpacity>
                    </View>
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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState(CATEGORIES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE}/videos`)
            .then(res => res.json())
            .then(response => {
                const data = response.videos || [];
                const bucketUrl = response.bucketUrl || "https://biblevideos-development.zohostratus.in";
                const uniqueCategories = new Set(["All"]);

                const mappedVideos = data.map(obj => {
                    const parts = obj.key ? obj.key.split('/') : ['Other'];
                    const folder = parts.length > 1 ? parts[0] : 'Other';
                    const filename = parts[parts.length - 1].replace(/_/g, ' ').replace('.mp4', '');

                    if (folder !== "All" && folder !== "Other") {
                        uniqueCategories.add(folder);
                    }

                    // Construct object URL explicitly using bucket URL + encoded key
                    const constructedUrl = `${bucketUrl}/${encodeURI(obj.key)}`;

                    return {
                        id: obj.key,
                        title: filename,
                        length: (obj.size / (1024 * 1024)).toFixed(1) + " MB",
                        category: folder,
                        img: DEFAULT_IMG,
                        url: constructedUrl
                    };
                });

                setVideos(mappedVideos);

                const dynamicCategories = Array.from(uniqueCategories).map(catName => {
                    const existing = CATEGORIES.find(c => c.id === catName);
                    return existing || { id: catName, icon: "folder", title: catName };
                });
                setCategories(dynamicCategories);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load videos from Catalyst:", err);
                setLoading(false);
            });
    }, []);

    const filteredVideos = videos.filter((v) => {
        const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
        const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark pb-6">
            <View className="flex-1">
                <FlatList
                    data={filteredVideos}
                    keyExtractor={(item) => item.id}
                    extraData={searchQuery}
                    ListHeaderComponent={
                        <RenderHeader
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    }
                    renderItem={({ item }) => (
                        <VideoItem
                            item={item}
                            onPress={() => router.push({
                                pathname: '/video/player',
                                params: { ...item }
                            })}
                        />
                    )}
                    ListEmptyComponent={<RenderEmpty loading={loading} searchQuery={searchQuery} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            </View>
        </SafeAreaView>
    );
}
