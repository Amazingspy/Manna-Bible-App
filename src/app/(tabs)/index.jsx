import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, useColorScheme, ActivityIndicator, Share, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import BibleHtmlRenderer from "../../components/bible-html-renderer";
import { getAllBibles, getBibleBooks, getBibleChapters, getBibleChapter } from "../../hooks/use-bible-api.js";
// import * as Clipboard from 'expo-clipboard';

export default function ReaderScreen() {
    const [allBibles, setAllBibles] = useState([]);
    const [selectedBibleId, setSelectedBibleId] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState("NIV");
    const [displayBibleName, setDisplayBibleName] = useState("New International Version 2011");

    const availableBibles = allBibles;
    const [availableBooks, setAvailableBooks] = useState([]);
    const [activeBook, setActiveBook] = useState('GEN');
    const [activeBookName, setActiveBookName] = useState('Genesis');
    const [availableChapters, setAvailableChapters] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedBookId, setExpandedBookId] = useState(null);
    const [sidebarChapters, setSidebarChapters] = useState([]);
    const [isFetchingSidebarChapters, setIsFetchingSidebarChapters] = useState(false);

    const [activeChapter, setActiveChapter] = useState("GEN.1");
    const [htmlContent, setHtmlContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const colorScheme = useColorScheme();
    const [highlights, setHighlights] = useState({});
    const [selectedVerseId, setSelectedVerseId] = useState(null);

    const getVerseText = (vid) => {
        if (!htmlContent) return "";
        try {
            const parts = htmlContent.split(new RegExp(`data-sid="${vid}"`));
            if (parts.length < 2) return "";
            const segment = parts[1].split(/<span[^>]+class="v"/)[0];
            return segment.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
        } catch (e) {
            return "";
        }
    };

    // const copyToClipboard = async (vid) => {
    //     const text = getVerseText(vid);
    //     if (text) {
    //         await Clipboard.setStringAsync(`${activeBookName} ${vid.split('.')[1]}:${vid.split('.')[2]} - ${text}`);
    //         alert('Copied to clipboard!');
    //     }
    // };

    const shareVerse = async (vid) => {
        const text = getVerseText(vid);
        if (text) {
            try {
                await Share.share({
                    message: `${activeBookName} ${vid.split('.')[1]}:${vid.split('.')[2]}\n\n"${text}"\n\nShared via Manna Bible App`,
                });
            } catch (error) {
                // console.log(error.message);
            }
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsInitialLoading(true);
            try {
                const bibles = await getAllBibles();
                if (bibles && bibles.length > 0) {
                    setAllBibles(bibles);
                    setSelectedBibleId(bibles[0].id);
                    setDisplayBibleName(bibles[0].name);
                    setSelectedVersion(bibles[0].cleanAbbreviation || bibles[0].abbreviation || "KJV");
                }
            } catch (err) {
                // console.error("Initialization error:", err);
            } finally {
                setIsInitialLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!selectedBibleId) return;
            try {
                const booksData = await getBibleBooks(selectedBibleId);
                setAvailableBooks(booksData);
                const currentBookId = activeChapter.split('.')[0];
                if (!booksData.find(b => b.id === currentBookId)) {
                    if (booksData.length > 0) {
                        setActiveChapter(`${booksData[0].id}.1`);
                        setActiveBookName(booksData[0].name);
                    }
                } else {
                    const currentBook = booksData.find(b => b.id === currentBookId);
                    setActiveBookName(currentBook.name);
                }
            } catch (err) {
                // console.error("Error fetching books:", err);
            }
        };
        fetchBooks();
    }, [selectedBibleId]);

    useEffect(() => {
        const fetchChapters = async () => {
            const bookId = activeChapter.split('.')[0];
            if (!selectedBibleId || !bookId) return;
            try {
                const chapters = await getBibleChapters(selectedBibleId, bookId);
                setAvailableChapters(chapters);
            } catch (err) {
                // console.error("Error fetching chapters:", err);
            }
        };
        fetchChapters();
    }, [selectedBibleId, activeChapter.split('.')[0]]);

    useEffect(() => {
        const fetchContent = async () => {
            if (!selectedBibleId || !activeChapter) return;
            setIsLoading(true);
            try {
                const content = await getBibleChapter(selectedBibleId, activeChapter);
                if (content) {
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
            // console.error("Error fetching sidebar chapters:", err);
        } finally {
            setIsFetchingSidebarChapters(false);
        }
    };

    const handlePreviousChapter = () => {
        const currentIndex = availableChapters.findIndex(c => c.id === activeChapter);
        if (currentIndex > 0) {
            setActiveChapter(availableChapters[currentIndex - 1].id);
        }
    };

    const handleNextChapter = () => {
        const currentIndex = availableChapters.findIndex(c => c.id === activeChapter);
        if (currentIndex < availableChapters.length - 1) {
            setActiveChapter(availableChapters[currentIndex + 1].id);
        }
    };

    const chapterNum = activeChapter.split('.')[1] || "1";
    const isFirstChapter = availableChapters.findIndex(c => c.id === activeChapter) <= 0;
    const isLastChapter = availableChapters.findIndex(c => c.id === activeChapter) === availableChapters.length - 1;
    const currentBible = availableBibles.find(b => b.id === selectedBibleId) || {};

    const getChapterText = () => {
        const isTamil = currentBible.language?.id === 'tam' || (currentBible.name || '').includes('Tamil');
        return isTamil ? 'அதிகாரம்' : 'Chapter';
    };

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
                    <View className="mt-6 mb-6 overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                        <View className="p-6">
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1 pr-4">
                                    <Text className="text-base font-bold uppercase tracking-widest text-primary dark:text-accent">
                                        {(() => {
                                            const book = availableBooks.find(b => activeChapter.startsWith(b.id)) || {};
                                            let n = book.nameLong || book.name || "Bible";
                                            // Handle KJV long formal names: "The First Book of Moses, Called Genesis" -> "Genesis"
                                            if (n.includes("Called ")) {
                                                n = n.split("Called ")[1];
                                            }
                                            return n;
                                        })()}
                                    </Text>
                                    <View className="flex-row items-baseline">
                                        <Text numberOfLines={1} className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                                            {getChapterText()} {chapterNum}
                                        </Text>
                                    </View>
                                    <Text numberOfLines={1} className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {selectedVersion} • {displayBibleName || "Select a version"}
                                    </Text>
                                </View>
                                <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 active:scale-95">
                                    <MaterialIcons name="bookmark" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View className="mb-8 flex-row items-center rounded-3xl bg-slate-100 p-1.5 dark:bg-slate-800/60">
                        {availableBibles.map((bible) => {
                            const version = bible.cleanAbbreviation || bible.abbreviation;
                            const isActive = selectedVersion === version;
                            return (
                                <TouchableOpacity
                                    key={bible.id}
                                    onPress={() => {
                                        const version = bible.cleanAbbreviation || bible.abbreviation;
                                        setSelectedVersion(version);
                                        setDisplayBibleName(bible.name);
                                        setSelectedBibleId(bible.id);
                                    }}
                                    className="flex-1 items-center justify-center rounded-2xl py-2.5"
                                    style={{
                                        backgroundColor: isActive ? (colorScheme === 'dark' ? '#334155' : 'white') : 'transparent',
                                    }}
                                >
                                    <Text style={{ fontSize: 12, letterSpacing: 0.6, color: isActive ? (colorScheme === 'dark' ? '#ffffff' : '#0f172a') : '#64748b' }} className="font-black uppercase">
                                        {bible.cleanAbbreviation || bible.abbreviation || (bible.name || '').substring(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View className="pb-20">
                        {isLoading ? (
                            <View className="py-20 items-center justify-center">
                                <ActivityIndicator size="large" color="#1a355b" />
                                <Text className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fetching Word...</Text>
                            </View>
                        ) : (
                            <BibleHtmlRenderer
                                html={htmlContent}
                                colorScheme={colorScheme}
                                isTamil={currentBible.language?.id === 'tam' || (currentBible.name || '').includes('Tamil')}
                                highlights={highlights}
                                selectedVerseId={selectedVerseId}
                                onVersePress={(vid) => setSelectedVerseId(prev => prev === vid ? null : vid)}
                                onVerseLongPress={(vid) => setSelectedVerseId(vid)}
                            />
                        )}

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

            {selectedVerseId && (
                <View
                    style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}
                    className="flex-row items-center justify-between rounded-[2rem] bg-slate-900 px-6 py-4 shadow-2xl dark:bg-slate-800 border border-white/10"
                >
                    <View className="flex-row items-center gap-4">
                        {[
                            { name: 'Yellow', color: '#ffe563ff' },
                            { name: 'Blue', color: '#9bd7feff' },
                            { name: 'Green', color: '#94ffb2ff' },
                            { name: 'Pink', color: '#ffb2b7ff' }
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.name}
                                onPress={() => {
                                    setHighlights(prev => ({ ...prev, [selectedVerseId]: item.color }));
                                    setSelectedVerseId(null);
                                }}
                                style={{ backgroundColor: item.color }}
                                className="h-8 w-8 rounded-full border border-white/20 active:scale-90"
                            />
                        ))}
                    </View>

                    <View className="h-6 w-[1px] bg-white/10 mx-2" />

                    <View className="flex-row items-center gap-6">
                        <TouchableOpacity
                            onPress={() => {
                                // copyToClipboard(selectedVerseId);
                                setSelectedVerseId(null);
                            }}
                            className="active:scale-90"
                        >
                            <MaterialIcons name="content-copy" size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                shareVerse(selectedVerseId);
                                setSelectedVerseId(null);
                            }}
                            className="active:scale-90"
                        >
                            <MaterialIcons name="share" size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setHighlights(prev => {
                                    const next = { ...prev };
                                    delete next[selectedVerseId];
                                    return next;
                                });
                                setSelectedVerseId(null);
                            }}
                            className="active:scale-90"
                        >
                            <MaterialIcons name="delete-outline" size={22} color="#f87171" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
