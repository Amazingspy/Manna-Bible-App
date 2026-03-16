import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VERSIONS = ["NIV", "ESV", "KJV", "NLT"];

export default function ReaderScreen() {
    const [activeVersion, setActiveVersion] = useState("NIV");

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Top Navigation Bar */}
            <View className="flex-row items-center justify-between border-b border-slate-200 bg-background-light/90 px-4 py-3 dark:border-slate-800 dark:bg-background-dark/90">
                <TouchableOpacity className="items-center justify-center rounded-full p-2 active:bg-primary/5">
                    <MaterialIcons name="menu" size={24} className="text-primary dark:text-slate-100" />
                </TouchableOpacity>
                <Text className="text-xl font-bold tracking-tight text-primary dark:text-slate-100">
                    Manna
                </Text>
                <View className="flex-row items-center gap-1">
                    <TouchableOpacity className="items-center justify-center rounded-full p-2 active:bg-primary/5">
                        <MaterialIcons name="translate" size={24} className="text-primary dark:text-slate-100" />
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center justify-center rounded-full p-2 active:bg-primary/5">
                        <MaterialIcons name="search" size={24} className="text-primary dark:text-slate-100" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mx-auto w-full max-w-2xl flex-1">
                    {/* Page Title */}
                    <View className="px-6 pb-6 pt-10">
                        <Text className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Read
                        </Text>
                        <Text className="mt-1 font-medium text-slate-500 dark:text-slate-400">
                            Immerse yourself in the Word
                        </Text>
                    </View>

                    {/* Bible Version Toggle */}
                    <View className="px-6 py-2">
                        <View className="flex-row h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-200/50 p-1 dark:border-slate-700/50 dark:bg-slate-800/50">
                            {VERSIONS.map((v) => (
                                <TouchableOpacity
                                    key={v}
                                    onPress={() => setActiveVersion(v)}
                                    className={`flex-1 items-center justify-center rounded-lg h-full px-2 ${activeVersion === v ? "bg-white shadow-sm dark:bg-primary" : ""
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-bold uppercase tracking-wider ${activeVersion === v
                                                ? "text-primary dark:text-white"
                                                : "text-slate-500 dark:text-slate-400"
                                            }`}
                                    >
                                        {v}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Chapter Picker Section */}
                    <View className="px-6 py-6">
                        <View className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <View>
                                <Text className="text-2xl font-bold tracking-tight text-primary dark:text-slate-100">
                                    Genesis 1
                                </Text>
                                <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    The Creation of the World
                                </Text>
                            </View>
                            <TouchableOpacity className="flex-row items-center gap-2 rounded-xl bg-primary px-5 py-3 shadow-lg active:scale-95">
                                <MaterialIcons name="bolt" size={18} color="white" />
                                <Text className="text-sm font-bold text-white">Fast Picker</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Reader Controls */}
                    <View className="flex-row items-center justify-between px-6 py-2">
                        <View className="flex-row items-center gap-4 rounded-full border border-slate-200/50 bg-slate-100 px-5 py-2.5 dark:border-slate-700/50 dark:bg-slate-800/80">
                            <MaterialIcons name="text-fields" size={18} className="text-slate-400" />
                            <View className="flex-row items-center gap-3">
                                <TouchableOpacity>
                                    <Text className="text-[14px] text-primary dark:text-slate-300">A</Text>
                                </TouchableOpacity>
                                <View className="relative h-1 w-20 rounded-full bg-slate-300 dark:bg-slate-600 justify-center">
                                    <View className="absolute left-0 h-full w-2/3 rounded-full bg-primary dark:bg-accent" />
                                    <View className="absolute left-2/3 h-3.5 w-3.5 -translate-x-1.5 rounded-full border-2 border-primary bg-white shadow-md dark:border-accent dark:bg-slate-100" />
                                </View>
                                <TouchableOpacity>
                                    <Text className="text-[20px] text-primary dark:text-slate-300">A</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <View className="h-2 w-2 rounded-full bg-green-500" />
                            <Text className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                                ENG - US
                            </Text>
                        </View>
                    </View>

                    {/* Scripture Content */}
                    <View className="px-8 py-10 gap-8">
                        <Text className="text-xl font-normal leading-[1.7] text-slate-800 dark:text-slate-200">
                            <Text className="text-xs font-bold text-primary dark:text-accent">1 </Text>
                            In the beginning God created the heavens and the earth.
                        </Text>

                        <Text className="text-xl font-normal leading-[1.7] text-slate-800 dark:text-slate-200">
                            <Text className="text-xs font-bold text-primary dark:text-accent">2 </Text>
                            Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
                        </Text>

                        <Text className="text-xl font-normal leading-[1.7] text-slate-800 dark:text-slate-200">
                            <Text className="text-xs font-bold text-primary dark:text-accent">3 </Text>
                            And God said, <Text className="rounded bg-yellow-200/50 px-1.5 py-0.5 dark:bg-yellow-900/40">“Let there be light,” and there was light.</Text>
                        </Text>

                        <Text className="text-xl font-normal leading-[1.7] text-slate-800 dark:text-slate-200">
                            <Text className="text-xs font-bold text-primary dark:text-accent">4 </Text>
                            God saw that the light was good, and he separated the light from the darkness.
                        </Text>

                        <Text className="text-xl font-normal leading-[1.7] text-slate-800 dark:text-slate-200">
                            <Text className="text-xs font-bold text-primary dark:text-accent">5 </Text>
                            God called the light “day,” and the darkness he called “night.” And there was evening, and there was morning—the first day.
                        </Text>

                        <Text className="text-xl font-normal leading-[1.7] text-slate-800 dark:text-slate-200">
                            <Text className="text-xs font-bold text-primary dark:text-accent">6 </Text>
                            And God said, <Text className="rounded bg-blue-100/60 px-1.5 py-0.5 dark:bg-blue-900/30">“Let there be a vault between the waters to separate water from water.”</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
