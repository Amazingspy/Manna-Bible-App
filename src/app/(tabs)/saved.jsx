import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, Share } from "react-native";
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
                    <View className="w-10" />
                </View>
            </View>

            <FlatList
                ListHeaderComponent={
                    <View>
                        {/* Header Section */}
                        <View className="px-6 pb-6 pt-12">
                            <View className="flex-row items-center justify-between mb-4">
                                <View>
                                    <Text className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                                        Saved
                                    </Text>
                                    <Text className="mt-1 text-sm font-medium text-slate-500">
                                        Your personal library
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <MaterialIcons name="search" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                                <TextInput
                                    placeholder="Search your saved verses..."
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

                        <Text className="px-6 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            {displayVerses.length > 0 ? "Saved Verses" : (searchQuery ? "No matches found" : "Your library is empty")}
                        </Text>
                    </View>
                }
                data={displayVerses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
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
                }
                renderItem={({ item: verse }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => console.log("Selected Verse Data:", verse)}
                        className="mx-6 mb-6 rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900/40"
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
                )}
            />
        </SafeAreaView>
    );
}
