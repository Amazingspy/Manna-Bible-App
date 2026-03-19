import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, useColorScheme, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BibleHtmlRenderer from "../../components/bible-html-renderer";
import { getAllBibles, getBibleBooks, getBibleChapters, getBibleChapter } from "../../hooks/use-bible-api.js";

export default function ReaderScreen() {
    const [allBibles, setAllBibles] = useState([]);
    console.log(`MARKER: [${new Date().toLocaleTimeString()}] ReaderScreen rendered. bibles: ${allBibles.length}`);
    const [selectedBibleId, setSelectedBibleId] = useState("");

    // Simplification: derive available bibles directly from all fetched bibles
    const availableBibles = allBibles;
    const [availableBooks, setAvailableBooks] = useState([]);
    const [availableChapters, setAvailableChapters] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedBookId, setExpandedBookId] = useState(null);
    const [sidebarChapters, setSidebarChapters] = useState([]);
    const [isFetchingSidebarChapters, setIsFetchingSidebarChapters] = useState(false);

    const [activeChapter, setActiveChapter] = useState("GEN.1");
    const [htmlContent, setHtmlContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const colorScheme = useColorScheme();
    
    console.log("MARKER: ReaderScreen Rendered", { hasBibles: allBibles.length, selectedBibleId });

    // Initial load of all bibles and languages
    useEffect(() => {
        const loadInitialData = async () => {
            console.log("MARKER: loadInitialData triggered");
            setIsInitialLoading(true);
            try {
                const bibles = await getAllBibles();
                console.log("MARKER: getAllBibles returned", bibles?.length || 0, "bibles");
                
                if (bibles && bibles.length > 0) {
                    setAllBibles(bibles);
                    console.log("MARKER: setting initial bible ID", bibles[0].id);
                    setSelectedBibleId(bibles[0].id);
                } else {
                    console.log("MARKER: No bibles found in API response");
                }
            } catch (err) {
                console.error("MARKER: Initialization CRASH:", err);
            } finally {
                setIsInitialLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Simplified: Chapter header text logic
    const getChapterText = () => {
        // If the bible name contains Tamil or language is tam, use Tamil header
        const isTamil = currentBible.language?.id === 'tam' || (currentBible.name || '').includes('Tamil');
        return isTamil ? 'அதிகாரம்' : 'Chapter';
    };

    // Fetch books when bible changes
    useEffect(() => {
        const fetchBooks = async () => {
            console.log("MARKER: fetchBooks check", { selectedBibleId });
            if (!selectedBibleId) return;
            try {
                const books = await getBibleBooks(selectedBibleId);
                console.log("MARKER: Books returned", books.length);
                setAvailableBooks(books);
                // If current chapter's book isn't in new version, switch to first book
                const currentBookId = activeChapter.split('.')[0];
                if (!books.find(b => b.id === currentBookId)) {
                    if (books.length > 0) setActiveChapter(`${books[0].id}.1`);
                }
            } catch (err) {
                console.error("Error fetching books:", err);
            }
        };
        fetchBooks();
    }, [selectedBibleId]);

    // Fetch chapters when book changes
    useEffect(() => {
        const fetchChapters = async () => {
            const bookId = activeChapter.split('.')[0];
            console.log("MARKER: fetchChapters check", { selectedBibleId, bookId });
            if (!selectedBibleId || !bookId) {
                console.log("MARKER: Missing ID for Chapters fetch - skipping.");
                return;
            }
            try {
                console.log("MARKER: calling getBibleChapters...");
                const chapters = await getBibleChapters(selectedBibleId, bookId);
                console.log("MARKER: Chapters returned", chapters.length);
                setAvailableChapters(chapters);
            } catch (err) {
                console.error("Error fetching chapters:", err);
            }
        };
        fetchChapters();
    }, [selectedBibleId, activeChapter.split('.')[0]]);

    // Fetch scripture content
    useEffect(() => {
        console.log("MARKER: fetchContent EFFECT TRIGGERED", { selectedBibleId, activeChapter });
        const fetchContent = async () => {
            if (!selectedBibleId || !activeChapter) {
                console.log("MARKER: fetchContent check FAILED - missing ID or chapter");
                return;
            }
            setIsLoading(true);
            try {
                console.log("MARKER: calling getBibleChapter...");
                const content = await getBibleChapter(selectedBibleId, activeChapter);
                if (content) {
                    console.log("Content:", content);
                    setHtmlContent(content);
                } else {
                    setHtmlContent("<p class='p text-center opacity-50 italic py-10'>Word not available for this selection.</p>");
                }
            } catch (err) {
                setHtmlContent("<p class='p'>An error occurred while fetching the Bible content.</p>");
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [selectedBibleId, activeChapter]);

    const handleExpandBook = async (bookId) => {
        if (expandedBookId === bookId) {
            setExpandedBookId(null);
            return;
        }
        setExpandedBookId(bookId);
        setIsFetchingSidebarChapters(true);
        try {
            const chapters = await getBibleChapters(selectedBibleId, bookId);
            setSidebarChapters(chapters);
        } catch (err) {
            console.error("Error fetching sidebar chapters:", err);
        } finally {
            setIsFetchingSidebarChapters(false);
        }
    };

    const handlePreviousChapter = () => {
        const currentIndex = availableChapters.findIndex(c => c.id === activeChapter);
        if (currentIndex > 0) {
            setActiveChapter(availableChapters[currentIndex - 1].id);
        } else {
            // Room for logic to move to previous book's last chapter
        }
    };

    const handleNextChapter = () => {
        const currentIndex = availableChapters.findIndex(c => c.id === activeChapter);
        if (currentIndex < availableChapters.length - 1) {
            setActiveChapter(availableChapters[currentIndex + 1].id);
        } else {
            // Room for logic to move to next book's first chapter
        }
    };

    const chapterNum = activeChapter.split('.')[1] || "1";
    const isFirstChapter = availableChapters.findIndex(c => c.id === activeChapter) <= 0;
    const isLastChapter = availableChapters.findIndex(c => c.id === activeChapter) === availableChapters.length - 1;

    // Current Bible Metadata
    const currentBible = availableBibles.find(b => b.id === selectedBibleId) || {};
    console.log("Current Bible:", currentBible);

    if (isInitialLoading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-background-dark">
                <ActivityIndicator size="large" color="#1a355b" />
                <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initializing Library...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-background-dark">
            <Modal visible={isSidebarOpen} animationType="slide" transparent={true} onRequestClose={() => setIsSidebarOpen(false)}>
                <View className="flex-1 flex-row bg-slate-900/50">
                    <View style={{ width: '85%' }} className="max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl pt-12 pb-6 px-4">
                        <View className="flex-row items-center justify-between mb-6 px-2">
                            <Text className="text-2xl font-black text-primary dark:text-white">Books</Text>
                            <TouchableOpacity onPress={() => setIsSidebarOpen(false)} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <MaterialIcons name="close" size={20} color={colorScheme === 'dark' ? 'white' : '#0f172a'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            {availableBooks.map(book => (
                                <View key={book.id} className="mb-3 px-2">
                                    <TouchableOpacity
                                        onPress={() => handleExpandBook(book.id)}
                                        className={`flex-row items-center justify-between p-4 rounded-2xl border ${expandedBookId === book.id || activeChapter.startsWith(book.id + '.') ? "bg-primary border-primary" : "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700"}`}
                                    >
                                        <Text className={`text-base font-bold ${expandedBookId === book.id || activeChapter.startsWith(book.id + '.') ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>{book.name}</Text>
                                        <MaterialIcons name={expandedBookId === book.id ? "expand-less" : "expand-more"} size={20} color={expandedBookId === book.id || activeChapter.startsWith(book.id + '.') ? "#ffffff" : "#64748b"} />
                                    </TouchableOpacity>

                                    {expandedBookId === book.id && (
                                        <View className="flex-row flex-wrap gap-2 pt-3">
                                            {isFetchingSidebarChapters ? (
                                                <View className="w-full flex-row items-center justify-center py-4">
                                                    <ActivityIndicator size="small" color="#1a355b" />
                                                    <Text className="ml-2 text-xs font-bold text-slate-400">Loading Chapters...</Text>
                                                </View>
                                            ) : (
                                                sidebarChapters.filter(c => c.number !== 'intro').map(chapter => {
                                                    const cNum = chapter.number || chapter.id.split('.')[1] || '1';
                                                    const isActive = activeChapter === chapter.id;
                                                    return (
                                                        <TouchableOpacity
                                                            key={chapter.id}
                                                            onPress={() => {
                                                                setActiveChapter(chapter.id);
                                                                setIsSidebarOpen(false);
                                                            }}
                                                            style={{ width: 45, height: 45 }}
                                                            className={`items-center justify-center rounded-2xl ${isActive ? "bg-primary shadow-sm" : "bg-slate-100 dark:bg-slate-800"}`}
                                                        >
                                                            <Text style={{ fontSize: 15 }} className={`font-black ${isActive ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>{cNum}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            )}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => setIsSidebarOpen(false)} />
                </View>
            </Modal>

            <View className="border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-background-dark">
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => setIsSidebarOpen(true)} className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                        <MaterialIcons name="menu" size={24} color={colorScheme === 'dark' ? '#f1f5f9' : '#0f172a'} />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-xl font-black tracking-tighter text-primary dark:text-slate-100">Manna</Text>
                        <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Word of God</Text>
                    </View>
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                        <MaterialIcons name="search" size={24} color={colorScheme === 'dark' ? '#f1f5f9' : '#0f172a'} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="mx-auto w-full max-w-2xl px-6">
                    {/* Chapter Header */}
                    <View className="mt-6 mb-6 overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                        <View className="p-6">
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1 pr-4">
                                    <Text className="text-base font-bold uppercase tracking-widest text-primary dark:text-accent">
                                        {(availableBooks.find(b => activeChapter.startsWith(b.id)) || {}).name || "Bible"}
                                    </Text>
                                    <View className="flex-row items-baseline">
                                        <Text className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                                            {getChapterText()} {chapterNum}
                                        </Text>
                                    </View>
                                    <Text numberOfLines={1} className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {currentBible.name || "Select a version"}
                                    </Text>
                                </View>
                                <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 active:scale-95">
                                    <MaterialIcons name="bookmark" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    {/* Version Selection: Segmented Control Style */}
                    <View className="mb-8 flex-row items-center rounded-3xl bg-slate-100 p-1.5 dark:bg-slate-800/60">
                        {availableBibles.map((bible) => {
                            const isActive = selectedBibleId === bible.id;
                            return (
                                <TouchableOpacity
                                    key={bible.id}
                                    onPress={() => setSelectedBibleId(bible.id)}
                                    className={`flex-1 items-center justify-center rounded-2xl py-2.5 ${isActive ? "bg-white shadow-sm dark:bg-slate-700" : ""}`}
                                >
                                    <Text 
                                        style={{ fontSize: 12, letterSpacing: 0.6 }} 
                                        className={`font-black uppercase ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500"}`}
                                    >
                                        {bible.cleanAbbreviation || bible.abbreviation || (bible.name || '').substring(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Reader Controls Panel */}
                    {/* <View className="mb-8 flex-row items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                        <View className="flex-row items-center gap-2">
                            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5">
                                <MaterialIcons name="format-size" size={20} className="text-slate-500 dark:text-slate-300" />
                            </TouchableOpacity>
                            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5">
                                <MaterialIcons name="headset" size={20} className="text-slate-500 dark:text-slate-300" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity className="flex-row items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 dark:bg-white shadow-lg active:scale-95">
                            <MaterialIcons name="download" size={18} className="text-white dark:text-slate-900" />
                            <Text className="text-[10px] font-black uppercase tracking-tight text-white dark:text-slate-900">Offline</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* Bible Content */}
                    <View className="pb-20">
                        {isLoading ? (
                            <View className="py-20 items-center justify-center">
                                <ActivityIndicator size="large" color="#1a355b" />
                                <Text className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fetching Word...</Text>
                            </View>
                        ) : (
                            <BibleHtmlRenderer html={htmlContent} colorScheme={colorScheme} />
                        )}

                        {/* Navigation Footer */}
                        <View className="mt-16 flex-row items-center justify-between border-t border-slate-100 pt-12 dark:border-slate-800">
                            <TouchableOpacity
                                onPress={handlePreviousChapter}
                                disabled={isFirstChapter}
                                className={`flex-row items-center gap-2 rounded-full border border-slate-200 px-6 py-3 active:bg-slate-50 dark:border-slate-800 ${isFirstChapter ? "opacity-30" : ""}`}
                            >
                                <MaterialIcons name="chevron-left" size={20} color="#94a3b8" />
                                <Text className="text-sm font-bold text-slate-500">Previous</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleNextChapter}
                                disabled={isLastChapter}
                                className={`flex-row items-center gap-2 rounded-full border border-slate-200 px-6 py-3 active:bg-slate-50 dark:border-slate-800 ${isLastChapter ? "opacity-30" : ""}`}
                            >
                                <Text className="text-sm font-bold text-slate-500">Next</Text>
                                <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
