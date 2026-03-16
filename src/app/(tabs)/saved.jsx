import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark">
            {/* Elegant Header */}
            <View className="border-b border-slate-100 bg-white/90 px-6 py-4 dark:border-slate-800 dark:bg-background-dark/90">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                        <MaterialIcons name="arrow-back" size={24} className="text-slate-900 dark:text-slate-100" />
                    </TouchableOpacity>
                    <Text className="text-xl font-black tracking-tighter text-primary dark:text-white">
                        Saved Items
                    </Text>
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                        <MaterialIcons name="filter-list" size={20} className="text-slate-400 dark:text-slate-500" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Modern Search */}
                <View className="px-6 py-6">
                    <View className="flex-row items-center h-14 rounded-2xl border border-slate-100 bg-slate-100/30 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                        <MaterialIcons name="search" size={20} className="text-slate-400" />
                        <TextInput
                            placeholder="Search your library..."
                            placeholderTextColor="#94a3b8"
                            className="ml-3 flex-1 text-base font-medium text-slate-900 dark:text-slate-100"
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
                        Recent Highlights
                    </Text>

                    {/* Premium Verse Card 1 */}
                    <View className="rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-2">
                                <View className="h-2 w-2 rounded-full bg-yellow-400" />
                                <Text className="text-xs font-black uppercase tracking-widest text-primary dark:text-accent">John 3:16</Text>
                            </View>
                            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5">
                                <MaterialIcons name="share" size={16} className="text-slate-400" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xl font-serif italic leading-relaxed text-slate-900 dark:text-white">
                            "For God so loved the world, that he gave his only begotten Son..."
                        </Text>
                        <View className="mt-6 flex-row items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800">
                            <Text className="text-[10px] font-bold text-slate-300">Added Sep 12, 2024</Text>
                            <TouchableOpacity>
                                <MaterialIcons name="delete-outline" size={18} color="#f87171" opacity={0.6} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Premium Verse Card 2 */}
                    <View className="rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-2">
                                <View className="h-2 w-2 rounded-full bg-emerald-400" />
                                <Text className="text-xs font-black uppercase tracking-widest text-primary dark:text-accent">Psalm 23:1</Text>
                            </View>
                            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5">
                                <MaterialIcons name="share" size={16} className="text-slate-400" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xl font-serif italic leading-relaxed text-slate-900 dark:text-white">
                            "The Lord is my shepherd; I shall not want."
                        </Text>
                        <View className="mt-6 flex-row items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800">
                            <Text className="text-[10px] font-bold text-slate-300">Added Oct 1, 2024</Text>
                            <TouchableOpacity>
                                <MaterialIcons name="delete-outline" size={18} color="#f87171" opacity={0.6} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
