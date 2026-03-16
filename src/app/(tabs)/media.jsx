import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MediaScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark pb-6">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 dark:border-slate-800 dark:bg-background-dark/90">
                <TouchableOpacity className="items-center justify-center p-2">
                    <MaterialIcons name="menu" size={24} className="text-primary dark:text-slate-300" />
                </TouchableOpacity>
                <Text className="text-lg font-extrabold tracking-tight text-primary dark:text-white">
                    Manna Media
                </Text>
                <TouchableOpacity className="items-center justify-center rounded-full bg-primary/5 p-2 dark:bg-white/5">
                    <MaterialIcons name="account-circle" size={28} className="text-primary dark:text-slate-300" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Search Section */}
                <View className="bg-white px-4 py-5 dark:bg-slate-900/50">
                    <View className="flex-row items-center h-12 rounded-2xl border border-slate-100 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-800">
                        <View className="items-center justify-center pl-4 pr-2">
                            <MaterialIcons name="search" size={20} className="text-slate-400" />
                        </View>
                        <TextInput
                            placeholder="Search videos, maps, or books"
                            placeholderTextColor="#94a3b8"
                            className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100 h-full"
                        />
                    </View>
                </View>

                {/* Categories (Horizontal Scroll) */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-4 py-2 mb-4"
                    contentContainerStyle={{ gap: 20, paddingRight: 32 }}
                >
                    <TouchableOpacity className="items-center gap-2.5 min-w-[68px]">
                        <View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-lg">
                            <MaterialIcons name="auto-stories" size={24} color="white" />
                        </View>
                        <Text className="text-[11px] font-bold text-primary dark:text-slate-300">Torah</Text>
                    </TouchableOpacity>
                    {/* Using custom components for remaining to save space */}
                    {[
                        { id: "history", icon: "history-edu", title: "History" },
                        { id: "wisdom", icon: "psychology", title: "Wisdom" },
                        { id: "prophets", icon: "campaign", title: "Prophets" },
                        { id: "gospels", icon: "menu-book", title: "Gospels" },
                    ].map((cat) => (
                        <TouchableOpacity key={cat.id} className="items-center gap-2.5 min-w-[68px]">
                            <View className="h-16 w-16 items-center justify-center rounded-3xl border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800">
                                <MaterialIcons name={cat.icon} size={24} className="text-slate-600 dark:text-slate-400" />
                            </View>
                            <Text className="text-[11px] font-bold text-slate-500">{cat.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Section */}
                <View className="px-4 py-4">
                    <Text className="mb-4 text-lg font-extrabold tracking-tight text-primary dark:text-slate-100">
                        Featured Series
                    </Text>
                    <View className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-xl">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5S0EumXpQ830fo8DzkldEaiah6_QmINki6pwfyoz3LLlFIYFQxG2bTSipkdvjwooCjqyOJSuSYSEuscMwWIGKAjOkSL8RMWGq6_vNRGKgl8WhBw_4DqZp05uMgFueoV42TQf9SE01FGhmwZxquowl2kMkcu9lwmZcyt9Va4L4OqZ0GHKeEtcW8pVdSK_kJeVf9q_TVZ19DCfaUVj6rDL71IppmlIJ132c-j1PanApS3yN1m9HXWJk8HAe3-h60wnTdpvF90TmsibN" }}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <View className="absolute inset-0 bg-black/50" />
                        <View className="absolute bottom-0 w-full p-6">
                            <View className="mb-3 flex-row items-center gap-2">
                                <View className="rounded bg-accent/90 px-2 py-0.5">
                                    <Text className="text-[10px] font-black uppercase tracking-widest text-primary">Premium</Text>
                                </View>
                                <View className="rounded bg-white/20 px-2 py-0.5">
                                    <Text className="text-[10px] font-bold uppercase tracking-widest text-white">8 Episodes</Text>
                                </View>
                            </View>
                            <Text className="mb-2 text-2xl font-black leading-tight text-white shadow-md">
                                Wisdom Literature:{"\n"}<Text className="text-white/80">Ecclesiastes & Job</Text>
                            </Text>
                            <Text className="text-xs font-medium text-slate-200 opacity-90">
                                Deep dive into the complex questions of existence.
                            </Text>
                        </View>
                        <View className="absolute inset-0 items-center justify-center">
                            <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/25 shadow-xl">
                                <MaterialIcons name="play-arrow" size={36} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Book-wise Overviews */}
                <View className="px-4 py-6">
                    <View className="mb-5 flex-row items-center justify-between">
                        <Text className="text-lg font-extrabold tracking-tight text-primary dark:text-slate-100">
                            Book Overviews
                        </Text>
                        <TouchableOpacity className="flex-row items-center gap-1">
                            <Text className="text-sm font-bold text-primary dark:text-primary/80">View All</Text>
                            <MaterialIcons name="chevron-right" size={16} className="text-primary dark:text-primary/80" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row gap-5">
                        {/* Card 1 */}
                        <TouchableOpacity className="flex-1 gap-3">
                            <View className="aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg">
                                <Image
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSxL_WsfjA7JNfBJDhyzWok_XhEGJN8mqEZ2yK-kalzyUj_YTSZW80K0fXTRT53VrRyM7mMLdTvQHhk8EcBDrXtLvZJlQteUb6_7pvkVk23leQOxjq7_YbuWr29g-6uquOmDv2UbrmuNivMcD7_fe_EExCxy2xiJXZIb_qGBMvOBStX0s-9dyix5xJV56_0M_Pe5aWZh8WQ_Lm6HBaqwuvg3Ur7blKr7A-3J9tpZK9aMdNTgTuGwck3d60g67zpTtczGl0GZ-WOGem" }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <View className="absolute inset-0 bg-black/40" />
                                <View className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10">
                                    <MaterialIcons name="play-circle" size={18} color="white" />
                                </View>
                            </View>
                            <View>
                                <Text className="text-sm font-extrabold leading-tight text-slate-900 dark:text-slate-100">
                                    Introduction to Matthew
                                </Text>
                                <Text className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    12:45 • Gospel
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Card 2 */}
                        <TouchableOpacity className="flex-1 gap-3">
                            <View className="aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg">
                                <Image
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCjkFgFt43P__x0myzEKO7JfzOSSv8sRTY1miBTjMV7aOIFltbceGkygTgXUCYoCUo18nJbipVvQ1QE4tLMJLyPsqUWKpdY4svdLG5afENqxfN9svTJhzRqETUHdLGzRfOh3AGCHa1anOzbT5TBY15xZuhXCuCERyD3FOf5syJd0I05dSojxuXu1hfxAl3qLqr18RWmz5YLcx_uZMAXedgjbeStxiPkkj2JuoJwxg-hXf-VWJ2fwMkdT4kBbQQiuz2YVkSnPG5PHTm" }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <View className="absolute inset-0 bg-black/40" />
                                <View className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10">
                                    <MaterialIcons name="play-circle" size={18} color="white" />
                                </View>
                            </View>
                            <View>
                                <Text className="text-sm font-extrabold leading-tight text-slate-900 dark:text-slate-100">
                                    Genesis: Creation Story
                                </Text>
                                <Text className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    18:20 • Torah
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Visual Elements Section */}
                <View className="px-4 py-6 gap-3">
                    <Text className="mb-2 text-lg font-extrabold tracking-tight text-primary dark:text-slate-100">
                        Visual Tools
                    </Text>
                    <TouchableOpacity className="flex-row items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm active:bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800">
                        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 dark:bg-primary/20">
                            <MaterialIcons name="map" size={28} className="text-primary dark:text-primary/80" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-extrabold text-slate-900 dark:text-slate-100">Ancient World Map</Text>
                            <Text className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">Explore critical biblical locations</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} className="text-slate-300" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm active:bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800">
                        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 dark:bg-primary/20">
                            <MaterialIcons name="timeline" size={28} className="text-primary dark:text-primary/80" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-extrabold text-slate-900 dark:text-slate-100">Biblical Timeline</Text>
                            <Text className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">Historical events & significant reigns</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} className="text-slate-300" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
