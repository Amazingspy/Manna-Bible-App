import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { FlatList, ScrollView, Share, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // npx expo install expo-linear-gradient
import * as Clipboard from "expo-clipboard";
import { useSaved } from "../../context/SavedContext";
import { useColorScheme } from "nativewind";
import { logError } from "../../utils/logger";

// Each book gets a consistent accent color so the library feels alive and scannable
const ACCENTS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#eab308", "#14b8a6"];
const accentFor = (id = "") => ACCENTS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % ACCENTS.length];

const bookNameOf = (verse) => (verse.reference || "").replace(/\s+\d+:\d+$/, "");
const timeOf = (verse) => +new Date(verse.savedAt) || 0;

const formatSaved = (value) => {
    const t = new Date(value);
    if (isNaN(t)) return "";
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const days = Math.round((startOfDay(new Date()) - startOfDay(t)) / 86400000);
    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return t.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const IconButton = ({ name, onPress, color, size = 18 }) => (
    <TouchableOpacity
        onPress={onPress}
        hitSlop={8}
        activeOpacity={0.6}
        className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5"
    >
        <MaterialIcons name={name} size={size} color={color} />
    </TouchableOpacity>
);

const VerseCard = React.memo(({ verse, isDark, onCopy, onShare, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = (verse.text || "").length > 170;
    const iconColor = isDark ? "#94a3b8" : "#64748b";

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => isLong && setExpanded((e) => !e)}
            className="mx-6 mb-4 flex-row overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
        >
            <View style={{ width: 5, backgroundColor: accentFor(verse.bookId) }} />
            <View className="flex-1 p-5">
                <View className="mb-3 flex-row items-center justify-between">
                    <Text className="flex-1 pr-3 text-xs font-black uppercase tracking-widest text-primary dark:text-accent" numberOfLines={1}>
                        {verse.reference}
                    </Text>
                    <View className="rounded-full bg-primary/10 px-2.5 py-1 dark:bg-white/10">
                        <Text className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-slate-300">
                            {verse.version || "NIV"}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={expanded ? undefined : 4}
                    style={{ fontSize: 17, lineHeight: 28 }}
                    className="font-serif text-slate-800 dark:text-slate-100"
                >
                    {verse.text}
                </Text>

                {isLong && (
                    <Text className="mt-2 text-xs font-bold text-primary dark:text-accent">
                        {expanded ? "Show less" : "Read more"}
                    </Text>
                )}

                <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-[11px] font-semibold text-slate-400">{formatSaved(verse.savedAt)}</Text>
                    <View className="flex-row items-center gap-2">
                        <IconButton name="content-copy" color={iconColor} size={16} onPress={() => onCopy(verse)} />
                        <IconButton name="share" color={iconColor} onPress={() => onShare(verse)} />
                        <IconButton name="delete-outline" color="#f87171" onPress={() => onDelete(verse)} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

export default function SavedScreen() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const { savedVerses, removeVerse, saveVerse } = useSaved();

    const [searchQuery, setSearchQuery] = useState("");
    const [bookFilter, setBookFilter] = useState("All");
    const [newestFirst, setNewestFirst] = useState(true);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    useEffect(() => () => clearTimeout(toastTimer.current), []);

    const showToast = useCallback((message, action) => {
        clearTimeout(toastTimer.current);
        setToast({ message, action });
        toastTimer.current = setTimeout(() => setToast(null), action ? 4500 : 1800);
    }, []);

    const handleShare = useCallback(async (verse) => {
        try {
            await Share.share({
                message: `${verse.reference}\n\n"${verse.text}"\n\nShared via Manna Bible App`,
            });
        } catch (error) {
            logError("SavedScreen", "handleShare", error);
        }
    }, []);

    const handleCopy = useCallback(async (verse) => {
        try {
            await Clipboard.setStringAsync(`"${verse.text}"\n\n — ${verse.reference}`);
            showToast("Verse copied");
        } catch (error) {
            logError("SavedScreen", "handleCopy", error);
        }
    }, [showToast]);

    const handleDelete = useCallback((verse) => {
        removeVerse(verse.id);
        showToast("Verse removed", { label: "Undo", run: () => saveVerse(verse) });
    }, [removeVerse, saveVerse, showToast]);

    // Books that actually exist in the library, for the filter chips
    const books = useMemo(() => {
        const map = new Map();
        savedVerses.forEach((v) => {
            if (!map.has(v.bookId)) map.set(v.bookId, bookNameOf(v));
        });
        return [...map.entries()].map(([id, name]) => ({ id, name }));
    }, [savedVerses]);

    // If the last verse of a filtered book is deleted, fall back to "All"
    const activeBook = books.some((b) => b.id === bookFilter) ? bookFilter : "All";
    const q = searchQuery.trim().toLowerCase();

    const displayVerses = useMemo(() => {
        const list = savedVerses.filter(
            (v) =>
                (activeBook === "All" || v.bookId === activeBook) &&
                ((v.reference || "").toLowerCase().includes(q) || (v.text || "").toLowerCase().includes(q))
        );
        return list.sort((a, b) => (newestFirst ? timeOf(b) - timeOf(a) : timeOf(a) - timeOf(b)));
    }, [savedVerses, activeBook, q, newestFirst]);

    // One saved verse to reflect on, stable for the whole day
    const dailyVerse = useMemo(() => {
        if (savedVerses.length === 0) return null;
        return savedVerses[Math.floor(Date.now() / 86400000) % savedVerses.length];
    }, [savedVerses]);

    const showHero = !!dailyVerse && !q && activeBook === "All";
    const iconColor = isDark ? "#94a3b8" : "#64748b";

    const listHeader = (
        <View>
            {showHero && (
                <View className="mx-6 mb-2 mt-5 overflow-hidden rounded-[28px]">
                    <LinearGradient
                        colors={isDark ? ["#0f2441", "#1a355b"] : ["#1a355b", "#2f5d9b"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ padding: 22 }}
                    >
                        <View className="mb-3 flex-row items-center gap-2">
                            <MaterialIcons name="auto-awesome" size={14} color="#fdba74" />
                            <Text className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-200">
                                Reflect on today
                            </Text>
                        </View>
                        <Text numberOfLines={5} style={{ fontSize: 19, lineHeight: 30 }} className="font-serif text-white">
                            {dailyVerse.text}
                        </Text>
                        <View className="mt-4 flex-row items-center justify-between">
                            <Text className="flex-1 pr-3 text-xs font-black uppercase tracking-widest text-white/80" numberOfLines={1}>
                                {dailyVerse.reference}
                            </Text>
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => handleCopy(dailyVerse)}
                                    className="h-9 w-9 items-center justify-center rounded-full bg-white/15"
                                >
                                    <MaterialIcons name="content-copy" size={16} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleShare(dailyVerse)}
                                    className="h-9 w-9 items-center justify-center rounded-full bg-white/15"
                                >
                                    <MaterialIcons name="share" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            )}

            {savedVerses.length > 0 && (
                <View className="mb-3 mt-5 flex-row items-center justify-between px-6">
                    <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        {displayVerses.length} {displayVerses.length === 1 ? "verse" : "verses"}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setNewestFirst((n) => !n)}
                        className="flex-row items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800"
                    >
                        <MaterialIcons name="swap-vert" size={14} color={iconColor} />
                        <Text className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {newestFirst ? "Newest" : "Oldest"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white dark:bg-background-dark">
            {/* Fixed top: title, search, book filters */}
            <View className="mt-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                <View className="flex-row items-center justify-between px-6 pb-3 pt-2">
                    <View className="flex-1">
                        <Text className="text-3xl font-black tracking-tighter text-primary text-center dark:text-white">My Library</Text>
                        {/* <Text className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            Verses you saved to revisit
                        </Text> */}
                    </View>
                    <View className="flex-row items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-2">
                        <MaterialIcons name="bookmark" size={16} color="#f97316" />
                        <Text className="text-sm font-black text-orange-500">{savedVerses.length}</Text>
                    </View>
                </View>

                <View className="px-6">
                    <View className="h-12 flex-row items-center rounded-2xl border border-slate-100 bg-slate-100/50 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                        <MaterialIcons name="search" size={20} color={iconColor} />
                        <TextInput
                            placeholder="Search your saved verses..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            returnKeyType="search"
                            className="ml-3 flex-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={10}>
                                <MaterialIcons name="close" size={20} color={iconColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {books.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-3"
                        contentContainerStyle={{ gap: 8, paddingHorizontal: 24 }}
                    >
                        {[{ id: "All", name: "All" }, ...books].map((b) => {
                            const active = activeBook === b.id;
                            return (
                                <TouchableOpacity
                                    key={b.id}
                                    onPress={() => setBookFilter(b.id)}
                                    activeOpacity={0.8}
                                    className={`h-9 items-center justify-center rounded-full border px-4 ${active
                                        ? "border-primary bg-primary dark:border-accent dark:bg-accent"
                                        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                                        }`}
                                >
                                    <Text className={`text-xs font-bold ${active ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                                        {b.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}
            </View>

            <FlatList
                data={displayVerses}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={listHeader}
                renderItem={({ item }) => (
                    <VerseCard
                        verse={item}
                        isDark={isDark}
                        onCopy={handleCopy}
                        onShare={handleShare}
                        onDelete={handleDelete}
                    />
                )}
                ListEmptyComponent={
                    <View className="items-center px-10 py-16">
                        <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <MaterialIcons
                                name={q ? "search-off" : "bookmark-border"}
                                size={38}
                                color={isDark ? "#64748b" : "#94a3b8"}
                            />
                        </View>
                        <Text className="text-center text-lg font-black text-slate-800 dark:text-slate-100">
                            {q ? "No matches found" : "Your library is empty"}
                        </Text>
                        <Text className="mt-2 text-center text-sm leading-6 text-slate-400">
                            {q
                                ? `Nothing matches "${searchQuery}". Try another word or reference.`
                                : "Press and hold a verse in the reader, then tap the bookmark to save it here."}
                        </Text>
                    </View>
                }
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* Toast with optional Undo */}
            {toast && (
                <View
                    style={{ position: "absolute", left: 24, right: 24, bottom: 24 }}
                    className="flex-row items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 shadow-2xl dark:bg-slate-700"
                >
                    <Text className="text-sm font-semibold text-white">{toast.message}</Text>
                    {toast.action && (
                        <TouchableOpacity
                            onPress={() => {
                                toast.action.run();
                                clearTimeout(toastTimer.current);
                                setToast(null);
                            }}
                            hitSlop={10}
                        >
                            <Text className="text-sm font-black uppercase tracking-wider text-orange-400">{toast.action.label}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}