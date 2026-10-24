import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    Animated,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // npx expo install expo-linear-gradient
import { useColorScheme } from "nativewind";
import { logError } from "../../utils/logger";

// Used only as the fallback poster when the player screen opens
const DEFAULT_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCCjkFgFt43P__x0myzEKO7JfzOSSv8sRTY1miBTjMV7aOIFltbceGkygTgXUCYoCUo18nJbipVvQ1QE4tLMJLyPsqUWKpdY4svdLG5afENqxfN9svTJhzRqETUHdLGzRfOh3AGCHa1anOzbT5TBY15xZuhXCuCERyD3FOf5syJd0I05dSojxuXu1hfxAl3qLqr18RWmz5YLcx_uZMAXedgjbeStxiPkkj2JuoJwxg-hXf-VWJ2fwMkdT4kBbQQiuz2YVkSnPG5PHTm";
const BASE_URL = "https://manna-60059371341.development.catalystserverless.in/server/manna_function/";

const CATEGORIES = [
    { id: "All", icon: "apps", title: "All" },
    { id: "Tamil", icon: "translate", title: "Tamil" },
    { id: "English", icon: "language", title: "English" },
];

const PALETTES = [
    ["#1a355b", "#2f5d9b"],
    ["#7c2d12", "#f97316"],
    ["#134e4a", "#14b8a6"],
    ["#4c1d95", "#8b5cf6"],
    ["#831843", "#ec4899"],
    ["#0f172a", "#38bdf8"],
    ["#312e81", "#6366f1"],
    ["#14532d", "#22c55e"],
    ["#701a75", "#d946ef"],
    ["#78350f", "#eab308"],
    ["#1e293b", "#94a3b8"],
];
const paletteFor = (s = "") => PALETTES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTES.length];

const mapItems = (list, bucketUrl, prefix, kind) => {
    let base = bucketUrl || "";
    if (base && !base.endsWith("/")) base += "/";
    return list.map((v, index) => {
        const fileName = v.key.split("/").pop();
        const cleanTitle = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        const lower = v.key.toLowerCase();
        let lang = "Tamil";
        if (lower.includes("english/")) lang = "English";
        if (lower.includes("tamil/")) lang = "Tamil";
        return {
            id: `${prefix}-${index}`,
            title: cleanTitle,
            url: `${base}${v.key}`,
            category: lang,
            length: kind,
            img: null,
            desc: kind === "Series" ? `Series on ${cleanTitle}` : `Overview for ${cleanTitle}`,
            key: v.key,
        };
    });
};

// ---------- Small building blocks ----------

const Thumb = ({ item, icon = "menu-book" }) =>
    item.img ? (
        <Image source={{ uri: item.img }} style={StyleSheet.absoluteFill} resizeMode="cover" />
    ) : (
        <LinearGradient
            colors={paletteFor(item.title)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}
        >
            <MaterialIcons name={icon} size={56} color="rgba(255,255,255,0.18)" />
        </LinearGradient>
    );

const Skeleton = ({ style }) => {
    const { colorScheme } = useColorScheme();
    const opacity = useRef(new Animated.Value(0.4)).current;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [opacity]);
    return (
        <Animated.View
            style={[{ opacity, backgroundColor: colorScheme === "dark" ? "#1e293b" : "#e2e8f0" }, style]}
        />
    );
};

const SectionHeader = ({ title, count }) => (
    <View className="mb-3 mt-6 flex-row items-end justify-between px-6">
        <Text className="text-lg font-black text-slate-900 dark:text-white">{title}</Text>
        {typeof count === "number" && (
            <Text className="text-xs font-bold text-slate-400">{count} {count === 1 ? "item" : "items"}</Text>
        )}
    </View>
);

const FeaturedCard = React.memo(({ item, width, onPress }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{ width, height: width * 0.6 }}
        className="overflow-hidden rounded-[28px] bg-slate-200 dark:bg-slate-800"
    >
        <Thumb item={item} icon="auto-stories" />
        <LinearGradient
            colors={["transparent", "rgba(2,6,23,0.9)"]}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: "25%" }}
        />
        <View className="absolute bottom-4 left-4 right-4">
            <View className="mb-2 self-start rounded-full bg-accent px-2.5 py-1">
                <Text className="text-[9px] font-black uppercase tracking-widest text-white">
                    {item.category} • Series
                </Text>
            </View>
            {/* Fixed lineHeight keeps Tamil glyphs from being clipped */}
            <Text numberOfLines={2} style={{ fontSize: 18, lineHeight: 27 }} className="font-black text-white">
                {item.title}
            </Text>
        </View>
        <View className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-white/95">
            <MaterialIcons name="play-arrow" size={24} color="#1a355b" />
        </View>
    </TouchableOpacity>
));

const VideoCard = React.memo(({ item, onPress }) => (
    <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="mx-6 mb-3 flex-row items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50"
    >
        <View className="h-20 w-28 overflow-hidden rounded-2xl">
            <Thumb item={item} />
            <View className="flex-1 items-center justify-center bg-black/10">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-white/90">
                    <MaterialIcons name="play-arrow" size={22} color="#1a355b" />
                </View>
            </View>
        </View>
        <View className="flex-1">
            <Text numberOfLines={2} style={{ fontSize: 15, lineHeight: 23 }} className="font-bold text-slate-900 dark:text-white">
                {item.title}
            </Text>
            <View className="mt-2 flex-row items-center gap-2">
                <View className="rounded-full bg-primary/10 px-2.5 py-1 dark:bg-white/10">
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-slate-300">
                        {item.category}
                    </Text>
                </View>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.length}</Text>
            </View>
        </View>
        <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
    </TouchableOpacity>
));

const VideoSkeletons = () => (
    <View>
        {[0, 1, 2, 3].map((i) => (
            <View key={i} className="mx-6 mb-3 flex-row items-center gap-4 rounded-3xl p-3">
                <Skeleton style={{ height: 80, width: 112, borderRadius: 16 }} />
                <View className="flex-1 gap-2">
                    <Skeleton style={{ height: 14, width: "85%", borderRadius: 7 }} />
                    <Skeleton style={{ height: 14, width: "55%", borderRadius: 7 }} />
                </View>
            </View>
        ))}
    </View>
);

const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => (
    <View className="items-center px-10 py-14">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <MaterialIcons name={icon} size={30} color="#94a3b8" />
        </View>
        <Text className="text-center text-base font-black text-slate-800 dark:text-slate-100">{title}</Text>
        {!!subtitle && <Text className="mt-1 text-center text-sm text-slate-400">{subtitle}</Text>}
        {!!actionLabel && (
            <TouchableOpacity onPress={onAction} className="mt-5 rounded-full bg-primary px-6 py-3 active:opacity-80">
                <Text className="text-sm font-bold text-white">{actionLabel}</Text>
            </TouchableOpacity>
        )}
    </View>
);

// ---------- Screen ----------

export default function MediaScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const { width } = useWindowDimensions();
    const cardW = Math.min(width * 0.78, 340);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [videos, setVideos] = useState([]);
    const [featuredSeries, setFeaturedSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setError(false);
            const [vRes, fRes] = await Promise.all([
                fetch(`${BASE_URL}videos`),
                fetch(`${BASE_URL}feature-series`),
            ]);
            const [vJson, fJson] = await Promise.all([vRes.json(), fRes.json()]);
            if (vJson.videos) setVideos(mapItems(vJson.videos, vJson.bucketUrl, "video", "Video"));
            if (fJson.featureSeries) setFeaturedSeries(mapItems(fJson.featureSeries, fJson.bucketUrl, "series", "Series"));
        } catch (err) {
            logError("MediaScreen", "fetchData → Catalyst API", err);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    const q = searchQuery.trim().toLowerCase();
    const filteredVideos = useMemo(
        () => videos.filter((v) => (selectedCategory === "All" || v.category === selectedCategory) && v.title.toLowerCase().includes(q)),
        [videos, selectedCategory, q]
    );
    const filteredSeries = useMemo(
        () => featuredSeries.filter((s) => (selectedCategory === "All" || s.category === selectedCategory) && s.title.toLowerCase().includes(q)),
        [featuredSeries, selectedCategory, q]
    );

    const openPlayer = useCallback(
        (item) =>
            router.push({
                pathname: "/video/player",
                params: {
                    ...item,
                    img: item.img || DEFAULT_IMG, // params must be strings, and the player expects a poster
                    url: encodeURIComponent(item.url),
                    description: item.desc,
                },
            }),
        [router]
    );

    const listHeader = (
        <View>
            {/* Featured */}
            {(loading || filteredSeries.length > 0) && (
                <>
                    <SectionHeader title="Featured Series" />
                    {loading ? (
                        <View className="flex-row gap-4 px-6">
                            <Skeleton style={{ width: cardW, height: cardW * 0.6, borderRadius: 28 }} />
                            <Skeleton style={{ width: cardW, height: cardW * 0.6, borderRadius: 28 }} />
                        </View>
                    ) : (
                        <FlatList
                            horizontal
                            data={filteredSeries}
                            keyExtractor={(s) => s.id}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={cardW + 16}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: 24 }}
                            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                            renderItem={({ item }) => (
                                <FeaturedCard item={item} width={cardW} onPress={() => openPlayer(item)} />
                            )}
                        />
                    )}
                </>
            )}

            {/* Genealogy entry (it's a destination, not a tab, so it's a card now) */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push("/familytree")}
                className="mx-6 mt-8 flex-row items-center gap-4 rounded-3xl bg-primary p-4 dark:bg-slate-800"
            >
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <MaterialIcons name="account-tree" size={26} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-black text-white">Bible Genealogy</Text>
                    <Text className="mt-0.5 text-xs text-white/70">Explore the family trees of the Bible</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            <SectionHeader title="Video Overviews" count={loading ? undefined : filteredVideos.length} />
        </View>
    );

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white dark:bg-background-dark">
            {/* Fixed top: title, search, language chips (always reachable while scrolling) */}
            <View className="mt-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                <View className="px-6 pb-3 pt-2">
                    <Text className="text-xl font-black tracking-tighter text-primary text-center dark:text-white">Manna Media</Text>
                    {/* <Text className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Watch, learn and grow in the Word
                    </Text> */}
                </View>

                <View className="px-6">
                    <View className="h-12 flex-row items-center rounded-2xl border border-slate-100 bg-slate-100/50 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                        <MaterialIcons name="search" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                        <TextInput
                            placeholder="Search overviews (e.g. Genesis)"
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            returnKeyType="search"
                            className="ml-3 flex-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={10}>
                                <MaterialIcons name="close" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View className="mt-3 flex-row gap-2 px-6">
                    {CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.id)}
                                activeOpacity={0.8}
                                className={`h-9 flex-row items-center gap-1.5 rounded-full border px-4 ${active
                                    ? "border-primary bg-primary dark:border-accent dark:bg-accent"
                                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                                    }`}
                            >
                                <MaterialIcons name={cat.icon} size={16} color={active ? "white" : isDark ? "#94a3b8" : "#64748b"} />
                                <Text className={`text-xs font-bold ${active ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                                    {cat.title}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <FlatList
                data={loading || error ? [] : filteredVideos}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={listHeader}
                renderItem={({ item }) => <VideoCard item={item} onPress={() => openPlayer(item)} />}
                ListEmptyComponent={
                    loading ? (
                        <VideoSkeletons />
                    ) : error ? (
                        <EmptyState
                            icon="wifi-off"
                            title="Couldn't load videos"
                            subtitle="Check your internet connection and try again."
                            actionLabel="Retry"
                            onAction={() => {
                                setLoading(true);
                                fetchData();
                            }}
                        />
                    ) : (
                        <EmptyState
                            icon="video-library"
                            title={q ? "No matches found" : "No videos yet"}
                            subtitle={q ? `Nothing matches "${searchQuery}". Try another word or language.` : "New overviews will appear here."}
                        />
                    )
                }
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" colors={["#f97316"]} />}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                initialNumToRender={8}
                windowSize={7}
            />
        </SafeAreaView>
    );
}