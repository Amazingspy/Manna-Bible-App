import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Header */}
            <View className="flex-row items-center border-b border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <TouchableOpacity className="h-10 w-10 items-center justify-center">
                    <MaterialIcons name="arrow-back" size={24} className="text-slate-700 dark:text-slate-300" />
                </TouchableOpacity>
                <Text className="flex-1 pr-10 text-center text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                    Saved Items
                </Text>
            </View>

            {/* Search Bar */}
            <View className="bg-white px-4 py-4 dark:bg-slate-900">
                <View className="flex-row h-12 w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <View className="items-center justify-center pl-4">
                        <MaterialIcons name="search" size={20} className="text-slate-400 dark:text-slate-500" />
                    </View>
                    <TextInput
                        placeholder="Search saved verses or chapters"
                        placeholderTextColor="#94a3b8"
                        className="flex-1 px-3 text-base text-slate-900 dark:text-slate-100 h-full"
                    />
                </View>
            </View>

            {/* Filters */}
            <View className="flex-row gap-2 border-b border-slate-100 bg-white px-4 pb-4 pt-0 dark:border-slate-800 dark:bg-slate-900">
                <TouchableOpacity className="h-9 items-center justify-center rounded-full bg-primary px-6 shadow-sm">
                    <Text className="text-sm font-semibold tracking-wide text-white">All</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-9 items-center justify-center rounded-full bg-slate-100 px-6 active:bg-slate-200 dark:bg-slate-800 dark:active:bg-slate-700">
                    <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">Verses</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-9 items-center justify-center rounded-full bg-slate-100 px-6 active:bg-slate-200 dark:bg-slate-800 dark:active:bg-slate-700">
                    <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">Chapters</Text>
                </TouchableOpacity>
            </View>

            {/* Saved Content List */}
            <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>
                <Text className="px-1 text-base font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                    Recent Highlights
                </Text>

                {/* Verse Item 1: Yellow */}
                <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-[13px] font-bold uppercase tracking-widest text-primary dark:text-slate-300">
                            John 3:16
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <View className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                            <MaterialIcons name="more-vert" size={20} className="text-slate-400 dark:text-slate-600" />
                        </View>
                    </View>
                    <View className="relative">
                        <View className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-yellow-400" />
                        <Text className="pl-4 text-base italic leading-relaxed text-slate-700 dark:text-slate-300">
                            "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
                        </Text>
                    </View>
                    <View className="mt-4 flex-row items-center justify-between border-t border-slate-50 pt-3 dark:border-slate-800">
                        <Text className="text-xs text-slate-400">Saved 2 days ago</Text>
                        <View className="flex-row gap-4">
                            <MaterialIcons name="share" size={18} className="text-slate-400" />
                            <MaterialIcons name="delete" size={18} className="text-slate-400" />
                        </View>
                    </View>
                </View>

                {/* Verse Item 2: Green */}
                <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-[13px] font-bold uppercase tracking-widest text-primary dark:text-slate-300">
                            Psalm 23:1
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <View className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            <MaterialIcons name="more-vert" size={20} className="text-slate-400 dark:text-slate-600" />
                        </View>
                    </View>
                    <View className="relative">
                        <View className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-emerald-400" />
                        <Text className="pl-4 text-base italic leading-relaxed text-slate-700 dark:text-slate-300">
                            "The Lord is my shepherd; I shall not want."
                        </Text>
                    </View>
                    <View className="mt-4 flex-row items-center justify-between border-t border-slate-50 pt-3 dark:border-slate-800">
                        <Text className="text-xs text-slate-400">Saved 1 week ago</Text>
                        <View className="flex-row gap-4">
                            <MaterialIcons name="share" size={18} className="text-slate-400" />
                            <MaterialIcons name="delete" size={18} className="text-slate-400" />
                        </View>
                    </View>
                </View>

                {/* Chapter Item: Blue */}
                <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <View className="mb-3 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="auto-stories" size={20} className="text-primary dark:text-slate-400" />
                            <Text className="text-[13px] font-bold uppercase tracking-widest text-primary dark:text-slate-300">
                                Romans 8
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <View className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                            <MaterialIcons name="more-vert" size={20} className="text-slate-400 dark:text-slate-600" />
                        </View>
                    </View>
                    <Text numberOfLines={2} className="px-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Life Through the Spirit. There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit...
                    </Text>
                    <View className="mt-4 flex-row items-center justify-between border-t border-slate-50 pt-3 dark:border-slate-800">
                        <Text className="text-xs font-medium text-slate-400">Full Chapter Bookmark</Text>
                        <View className="flex-row gap-4">
                            <MaterialIcons name="share" size={18} className="text-slate-400" />
                            <MaterialIcons name="delete" size={18} className="text-slate-400" />
                        </View>
                    </View>
                </View>

                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
}
