import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VERSIONS = ["NIV", "ESV", "KJV", "NLT"];

export default function ReaderScreen() {
    const [activeVersion, setActiveVersion] = useState("NIV");

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark">
            {/* Elegant Header */}
            <View className="border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-background-dark">
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                        <MaterialIcons name="menu" size={24} className="text-slate-900 dark:text-slate-100" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-xl font-black tracking-tighter text-primary dark:text-slate-100">
                            Manna
                        </Text>
                        <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            The Bread of Life
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                            <MaterialIcons name="search" size={24} className="text-slate-900 dark:text-slate-100" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="mx-auto w-full max-w-2xl px-6">

                    {/* Chapter Navigation Card */}
                    <View className="mt-8 mb-6 overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                        <View className="p-6">
                            <View className="flex-row items-start justify-between">
                                <View>
                                    <Text className="text-base font-bold uppercase tracking-widest text-primary dark:text-accent">
                                        Genesis
                                    </Text>
                                    <Text className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                                        Chapter 1
                                    </Text>
                                    <Text className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        The Story of Creation
                                    </Text>
                                </View>
                                <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 active:scale-95">
                                    <MaterialIcons name="edit-notifications" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Version Selector (Glassmorphism inspired) */}
                    <View className="mb-8 flex-row h-12 items-center rounded-2xl border border-slate-100 bg-slate-100/50 p-1.5 dark:border-slate-800 dark:bg-slate-800/50">
                        {VERSIONS.map((v) => (
                            <TouchableOpacity
                                key={v}
                                onPress={() => setActiveVersion(v)}
                                className={`flex-1 items-center justify-center rounded-xl h-full ${activeVersion === v ? "bg-white shadow-sm dark:bg-primary" : ""
                                    }`}
                            >
                                <Text
                                    className={`text-xs font-black uppercase tracking-widest ${activeVersion === v
                                        ? "text-primary dark:text-white"
                                        : "text-slate-400 dark:text-slate-500"
                                        }`}
                                >
                                    {v}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Reader Controls Panel (Floating & Elegant) */}
                    <View className="mb-10 flex-row items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5">
                                <MaterialIcons name="format-color-text" size={20} className="text-slate-500 dark:text-slate-300" />
                            </TouchableOpacity>
                            <View className="flex-row items-center gap-3">
                                <Text className="text-xs font-bold text-slate-400">A</Text>
                                <View className="h-1 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <View className="h-full w-2/3 rounded-full bg-primary" />
                                </View>
                                <Text className="text-xl font-bold text-slate-900 dark:text-white">A</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="flex-row items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 dark:bg-white">
                            <MaterialIcons name="headphones" size={18} className="text-white dark:text-slate-900" />
                            <Text className="text-xs font-black uppercase tracking-tight text-white dark:text-slate-900">Audio</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Scripture Content */}
                    <View className="gap-10 pb-20">
                        <View>
                            <Text className="text-2xl font-serif italic leading-[1.6] text-slate-900 dark:text-white">
                                <Text className="text-xs font-black not-italic tracking-widest text-primary dark:text-accent">1 </Text>
                                In the beginning God created the heavens and the earth.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-2xl font-serif italic leading-[1.6] text-slate-900 dark:text-white">
                                <Text className="text-xs font-black not-italic tracking-widest text-primary dark:text-accent">2 </Text>
                                Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-2xl font-serif italic leading-[1.6] text-slate-900 dark:text-white">
                                <Text className="text-xs font-black not-italic tracking-widest text-primary dark:text-accent">3 </Text>
                                And God said, <Text className="rounded border-b-2 border-yellow-200 bg-yellow-50 px-1 dark:border-yellow-900/50 dark:bg-yellow-900/20">“Let there be light,”</Text> and there was light.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-2xl font-serif italic leading-[1.6] text-slate-900 dark:text-white">
                                <Text className="text-xs font-black not-italic tracking-widest text-primary dark:text-accent">4 </Text>
                                God saw that the light was good, and he separated the light from the darkness.
                            </Text>
                        </View>

                        <View className="mt-12 items-center justify-center border-t border-slate-100 pt-12 dark:border-slate-800">
                            <TouchableOpacity className="flex-row items-center gap-2 rounded-full border border-slate-200 px-6 py-3 active:bg-slate-50 dark:border-slate-800">
                                <Text className="text-sm font-bold text-slate-500">Next: Chapter 2</Text>
                                <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
