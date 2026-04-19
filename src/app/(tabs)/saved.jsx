import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSaved } from "../../context/SavedContext";
import { useColorScheme } from "nativewind";

export default function SavedScreen() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { savedVerses, removeVerse } = useSaved();
    const [searchQuery, setSearchQuery] = useState("");

    const handleShare = async (verse) => {
        try {

            await Share.share({
                message: `${verse.reference}\n\n"${verse.text}"\n\nShared via Manna Bible App`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const displayVerses = savedVerses.filter((verse) =>
        verse.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark">
            {/* Elegant Header */}
            <View className="border-b border-slate-100 bg-white/90 px-6 py-4 dark:border-slate-800 dark:bg-background-dark/90">
                <View className="flex-row items-center justify-between">
                    <View className="h-10 w-10 overflow-hidden rounded-full items-center justify-center bg-slate-50 dark:bg-white/5">
                        <MaterialIcons name="bookmarks" size={20} color={isDark ? "#f97316" : "#0f172a"} />
                    </View>
                    <Text className="text-xl font-black tracking-tighter text-primary dark:text-white">
                        My Library
                    </Text>
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                        <MaterialIcons name="filter-list" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Modern Search */}
                <View className="px-6 py-6">
                    <View className="flex-row items-center h-14 rounded-2xl border border-slate-100 bg-slate-100/30 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                        <MaterialIcons name="search" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                        <TextInput
                            placeholder="Search your library..."
                            placeholderTextColor="#94a3b8"
                            className="ml-3 flex-1 text-base font-medium text-slate-900 dark:text-slate-100"
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                        />
                    </View>
                </View>

                {/* Categories Tab (Premium Pills) */}
                <View className="px-6 flex-row gap-3 mb-8">
                    <TouchableOpacity className="rounded-2xl bg-primary px-6 py-3 shadow-lg shadow-primary/20">
                        <Text className="text-xs font-black uppercase tracking-widest text-white">All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/30">
                        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">Verses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/30">
                        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">Notes</Text>
                    </TouchableOpacity>
                </View>

                {/* Saved Items List */}
                <View className="px-6 gap-6 pb-32">
                    <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        {displayVerses.length > 0 ? "Saved Verses" : (searchQuery ? "No matches found" : "Your library is empty")}
                    </Text>

                    {displayVerses.map((verse) => (
                        <TouchableOpacity
                            key={verse.id}
                            activeOpacity={0.9}
                            onPress={() => console.log("Selected Verse Data:", verse)}
                            className="rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900/40"
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center gap-2">
                                    <View className="h-2 w-2 rounded-full bg-accent" />
                                    <Text className="text-xs font-black uppercase tracking-widest text-primary dark:text-accent">
                                        {verse.reference}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleShare(verse)}
                                    className="h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5"
                                >
                                    <MaterialIcons name="share" size={18} color={isDark ? "#94a3b8" : "#64748b"} />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-xl font-serif italic leading-relaxed text-slate-900 dark:text-white">
                                "{verse.text}"
                            </Text>
                            <View className="mt-6 flex-row items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800">
                                <Text className="text-[10px] font-bold text-slate-300">
                                    {verse.version || "NIV"} • {new Date(verse.savedAt).toLocaleDateString()}
                                </Text>
                                <TouchableOpacity onPress={() => removeVerse(verse.id)}>
                                    <MaterialIcons name="delete-outline" size={20} color="#f87171" opacity={0.6} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {displayVerses.length === 0 && (
                        <View className="py-20 items-center justify-center opacity-30">
                            <MaterialIcons 
                                name={searchQuery ? "search-off" : "bookmark-border"} 
                                size={64} 
                                color={isDark ? "#475569" : "#94a3b8"} 
                            />
                            <Text className="mt-4 text-sm font-bold text-slate-400 text-center px-10">
                                {searchQuery 
                                    ? `No matches found for "${searchQuery}"` 
                                    : "Save your favorite verses to see them here."
                                }
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
