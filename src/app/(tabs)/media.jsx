import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MediaScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark pb-6">
            {/* Elegant Header */}
            <View className="border-b border-slate-100 bg-white/90 px-6 py-4 dark:border-slate-800 dark:bg-background-dark/90">
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

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Modern Search */}
                <View className="px-6 py-6">
                    <View className="flex-row items-center h-14 rounded-2xl border border-slate-100 bg-slate-100/30 px-4 dark:border-slate-800 dark:bg-slate-800/50">
                        <MaterialIcons name="search" size={20} className="text-slate-400" />
                        <TextInput
                            placeholder="Find inspiration..."
                            placeholderTextColor="#94a3b8"
                            className="ml-3 flex-1 text-base font-medium text-slate-900 dark:text-slate-100"
                        />
                    </View>
                </View>

                {/* Categories (Premium Circles) */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-8"
                    contentContainerStyle={{ gap: 24, paddingLeft: 24, paddingRight: 40 }}
                >
                    <TouchableOpacity className="items-center gap-3">
                        <View className="h-20 w-20 items-center justify-center rounded-[2rem] bg-primary shadow-xl shadow-primary/30">
                            <MaterialIcons name="movie" size={28} color="white" />
                        </View>
                        <Text className="text-xs font-black uppercase tracking-widest text-primary">All</Text>
                    </TouchableOpacity>
                    {[
                        { id: "torah", icon: "auto-stories", title: "Torah" },
                        { id: "history", icon: "history-edu", title: "History" },
                        { id: "wisdom", icon: "psychology", title: "Wisdom" },
                        { id: "prophets", icon: "campaign", title: "Prophets" },
                    ].map((cat) => (
                        <TouchableOpacity key={cat.id} className="items-center gap-3">
                            <View className="h-20 w-20 items-center justify-center rounded-[2rem] border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                                <MaterialIcons name={cat.icon} size={28} className="text-slate-400" />
                            </View>
                            <Text className="text-xs font-bold uppercase tracking-widest text-slate-500">{cat.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Section (Elevated) */}
                <View className="px-6 py-4">
                    <Text className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Featured Series
                    </Text>
                    <View className="relative w-full aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5S0EumXpQ830fo8DzkldEaiah6_QmINki6pwfyoz3LLlFIYFQxG2bTSipkdvjwooCjqyOJSuSYSEuscMwWIGKAjOkSL8RMWGq6_vNRGKgl8WhBw_4DqZp05uMgFueoV42TQf9SE01FGhmwZxquowl2kMkcu9lwmZcyt9Va4L4OqZ0GHKeEtcW8pVdSK_kJeVf9q_TVZ19DCfaUVj6rDL71IppmlIJ132c-j1PanApS3yN1m9HXWJk8HAe3-h60wnTdpvF90TmsibN" }}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <View className="absolute inset-0 bg-black/40" />
                        <View className="absolute bottom-0 w-full p-8">
                            <View className="mb-4 flex-row items-center gap-2">
                                <View className="rounded-full bg-accent/90 px-3 py-1">
                                    <Text className="text-[10px] font-black uppercase tracking-widest text-white">Series</Text>
                                </View>
                            </View>
                            <Text className="text-3xl font-black leading-tight text-white mb-2">
                                Wisdom Literature
                            </Text>
                            <Text className="text-sm font-medium text-white/80">
                                Explore the heart of Ecclesiastes & Job.
                            </Text>
                        </View>
                        <TouchableOpacity className="absolute right-6 top-6 h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl active:scale-90">
                            <MaterialIcons name="play-arrow" size={32} className="text-primary ml-1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* List View Overviews */}
                <View className="px-6 py-10">
                    <Text className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Recent Overviews
                    </Text>
                    <View className="gap-6">
                        {[
                            { title: "Introduction to Matthew", length: "12:45", type: "Gospel", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSxL_WsfjA7JNfBJDhyzWok_XhEGJN8mqEZ2yK-kalzyUj_YTSZW80K0fXTRT53VrRyM7mMLdTvQHhk8EcBDrXtLvZJlQteUb6_7pvkVk23leQOxjq7_YbuWr29g-6uquOmDv2UbrmuNivMcD7_fe_EExCxy2xiJXZIb_qGBMvOBStX0s-9dyix5xJV56_0M_Pe5aWZh8WQ_Lm6HBaqwuvg3Ur7blKr7A-3J9tpZK9aMdNTgTuGwck3d60g67zpTtczGl0GZ-WOGem" },
                            { title: "Genesis: The Creation", length: "18:20", type: "Torah", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCjkFgFt43P__x0myzEKO7JfzOSSv8sRTY1miBTjMV7aOIFltbceGkygTgXUCYoCUo18nJbipVvQ1QE4tLMJLyPsqUWKpdY4svdLG5afENqxfN9svTJhzRqETUHdLGzRfOh3AGCHa1anOzbT5TBY15xZuhXCuCERyD3FOf5syJd0I05dSojxuXu1hfxAl3qLqr18RWmz5YLcx_uZMAXedgjbeStxiPkkj2JuoJwxg-hXf-VWJ2fwMkdT4kBbQQiuz2YVkSnPG5PHTm" }
                        ].map((item, i) => (
                            <TouchableOpacity key={i} className="flex-row items-center gap-5">
                                <View className="h-20 w-24 overflow-hidden rounded-2xl shadow-sm">
                                    <Image source={{ uri: item.img }} className="h-full w-full object-cover" />
                                    <View className="absolute inset-0 bg-black/20 items-center justify-center">
                                        <MaterialIcons name="play-circle" size={24} color="white" />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                        {item.title}
                                    </Text>
                                    <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {item.length} • {item.type}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
