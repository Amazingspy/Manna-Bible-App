import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    FlatList,
    Animated,
    Dimensions,
    Easing,
    Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import * as Clipboard from 'expo-clipboard';

import BibleHtmlRenderer from "../../components/bible-html-renderer";
import {
    getAllBibles,
    getBibleBooks,
    getBibleChapters,
    getBibleChaptersSync,
    getBibleChapter,
    searchBible
} from "../../constants/hooks/use-bible-api.js";
import { useSaved } from "../../context/SavedContext";
import { parseBibleSearch } from "../../utils/bible-search-utils";
import verseCounts from "../../utils/verse-counts.json";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 380);

const OT_IDS = ['GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL'];
const NT_IDS = ['MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'];

// Reusable tile used for books, chapters, and verses
const NavTile = React.memo(({ label, active, onPress, height = 46, fontSize = 14, flexBasis }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{ height, flexBasis, flexGrow: 1, flexShrink: 0, maxWidth: flexBasis }}
        className={`items-center justify-center rounded-2xl px-1 ${active ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"}`}
    >
        <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={{ fontSize }}
            className={`font-bold ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
        >
            {label}
        </Text>
    </TouchableOpacity>
));

export default function ReaderScreen() {
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [allBibles, setAllBibles] = useState([]);
    const [selectedBibleId, setSelectedBibleId] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState("NIV");
    const [displayBibleName, setDisplayBibleName] = useState("New International Version 2011");

    const availableBibles = allBibles;
    const [availableBooks, setAvailableBooks] = useState([]);
    const [activeBook, setActiveBook] = useState('GEN');
    const [activeBookName, setActiveBookName] = useState('Genesis');
    const [availableChapters, setAvailableChapters] = useState([]);

    // Sidebar Drawer State & Animations
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarAnimating, setIsSidebarAnimating] = useState(false);
    const [expandedBookId, setExpandedBookId] = useState(null);
    const [sidebarChapters, setSidebarChapters] = useState([]);
    const [testament, setTestament] = useState('OT');
    const sidebarAnim = useRef(new Animated.Value(0)).current;

    // Verse Scrolling & Picker State
    const scrollViewRef = useRef(null);
    const versePositionsRef = useRef({});
    const [targetScrollVerse, setTargetScrollVerse] = useState(null);
    const [selectedSidebarChapter, setSelectedSidebarChapter] = useState(null);

    const [activeChapter, setActiveChapter] = useState("GEN.1");
    const [htmlContent, setHtmlContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [highlights, setHighlights] = useState({});
    const [selectedVerseId, setSelectedVerseId] = useState(null);
    const { saveVerse, removeVerse, isSaved } = useSaved();

    // Search State
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Sidebar Slide Controls
    const openSidebar = () => {
        const curBook = activeChapter.split('.')[0];
        setTestament(NT_IDS.includes(curBook) ? 'NT' : 'OT');
        setIsSidebarOpen(true);
        setIsSidebarAnimating(true);

        Animated.timing(sidebarAnim, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start(() => {
            setIsSidebarAnimating(false);
        });
    };

    const closeSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
        }).start(() => {
            setIsSidebarOpen(false);
            setSelectedSidebarChapter(null);
            setExpandedBookId(null);
        });
    };

    const getVerseText = (vid) => {
        if (!htmlContent) return "";
        try {
            const vParts = vid.split('.');
            if (vParts.length < 3) return "";
            const markerId = `${vParts[0]} ${vParts[1]}:${vParts[2]}`;

            const startMarker = `data-sid="${markerId}"`;
            const startIdx = htmlContent.indexOf(startMarker);
            if (startIdx === -1) return "";

            let sub = htmlContent.substring(startIdx);
            const endOfTag = sub.indexOf('>');
            if (endOfTag === -1) return "";

            sub = sub.substring(endOfTag + 1);

            const nextVerseIdx = sub.indexOf('data-sid="');
            if (nextVerseIdx !== -1) {
                sub = sub.substring(0, nextVerseIdx);
            }

            return sub
                .replace(/<[^>]*>?/gm, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        } catch (e) {
            console.error("Scraping error:", e);
            return "";
        }
    };

    // Compute verses for the sidebar safely before render
    const sidebarVerses = React.useMemo(() => {
        if (!selectedSidebarChapter) return [];

        const [bId, cNum] = selectedSidebarChapter.split('.');
        const cIdx = cNum === 'intro' ? -1 : parseInt(cNum, 10) - 1;
        const vCount = (verseCounts[bId] && cIdx >= 0 && verseCounts[bId][cIdx])
            ? verseCounts[bId][cIdx]
            : 50;

        return Array.from({ length: vCount }, (_, i) => i + 1);
    }, [selectedSidebarChapter]);

    const handleVerseLayout = useCallback((vId, yPos) => {
        versePositionsRef.current[vId] = yPos;

        // Scroll immediately when the layout for the target verse is measured
        if (targetScrollVerse && vId === targetScrollVerse && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: Math.max(0, yPos - 40), animated: true });
            setSelectedVerseId(targetScrollVerse);
            setTargetScrollVerse(null);
        }
    }, [targetScrollVerse]);

    const copyToClipboard = async (vid) => {
        const text = getVerseText(vid);
        if (text) {
            const book = availableBooks.find(b => vid.startsWith(b.id)) || {};
            const vParts = vid.split('.');
            const bookRefName = book.name || activeBookName || vParts[0];
            const reference = `${bookRefName} ${vParts[1] || '1'}:${vParts[2] || '1'}`;

            await Clipboard.setStringAsync(`"${text}"\n\n — ${reference}`);
        }
    };

    const handleSaveVerse = (vid) => {
        if (isSaved(vid)) {
            removeVerse(vid);
        } else {
            const text = getVerseText(vid);
            const book = availableBooks.find(b => vid.startsWith(b.id)) || {};

            const vParts = vid.split('.');
            const bookRefName = book.name || activeBookName || vParts[0];
            const chapterRefNum = vParts[1] || '1';
            const verseRefNum = vParts[2] || '1';
            const reference = `${bookRefName} ${chapterRefNum}:${verseRefNum}`;
            saveVerse({
                id: vid,
                text: text || "Text not available",
                bookId: vParts[0],
                reference,
                bibleId: selectedBibleId,
                version: selectedVersion
            });
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
                console.error("Initialization error:", err);
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
                console.error("Error fetching books:", err);
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
                console.error("Error fetching chapters:", err);
            }
        };
        fetchChapters();
    }, [selectedBibleId, activeChapter.split('.')[0]]);

    useEffect(() => {
        versePositionsRef.current = {};
    }, [activeChapter]);

    useEffect(() => {
        if (!targetScrollVerse) return;

        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            const yPos = versePositionsRef.current[targetScrollVerse];

            if (yPos !== undefined && scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: yPos + 180, animated: true });
                setSelectedVerseId(targetScrollVerse);
                setTargetScrollVerse(null);
                clearInterval(interval);
            } else if (attempts > 30) {
                clearInterval(interval);
                setTargetScrollVerse(null);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [targetScrollVerse]);

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
                if (err.message === "NETWORK_ERROR") {
                    setNetworkError(true);
                    setTimeout(() => setNetworkError(false), 4000);
                }
                setHtmlContent("<p class='p'>An error occurred, Looks like the Internet is Disconnected, Please connect to Internet to read without any interruptions...</p>");
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [selectedBibleId, activeChapter]);

    const navStep = selectedSidebarChapter ? 'verses' : expandedBookId ? 'chapters' : 'books';

    const handleNavBack = () => {
        if (selectedSidebarChapter) setSelectedSidebarChapter(null);
        else setExpandedBookId(null);
    };

    const openBook = async (bookId) => {
        const staticChapters = getBibleChaptersSync(selectedBibleId, bookId);
        if (staticChapters) {
            setSidebarChapters(staticChapters);
            setExpandedBookId(bookId);
            return;
        }
        setSidebarChapters([]);
        setExpandedBookId(bookId);
        try {
            const chapters = await getBibleChapters(selectedBibleId, bookId);
            setSidebarChapters(chapters);
        } catch (err) {
            if (err.message === "NETWORK_ERROR") {
                setNetworkError(true);
                setTimeout(() => setNetworkError(false), 4000);
            } else {
                console.error("Error fetching sidebar chapters:", err);
            }
        }
    };

    const goToVerse = (chapterId, verse) => {
        setActiveChapter(chapterId);
        if (verse) setTargetScrollVerse(`${chapterId}.${verse}`);
        closeSidebar();
    };

    const navBook = availableBooks.find(b => b.id === expandedBookId);
    const navTitle =
        navStep === 'books' ? 'Books'
            : navStep === 'chapters' ? (navBook?.name || '')
                : `${navBook?.name || ''} ${selectedSidebarChapter?.split('.')[1] || ''}`;

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
    const activeChapterIndex = availableChapters.findIndex(c => c.id === activeChapter);
    const isFirstChapter = activeChapterIndex <= 0;
    const isLastChapter = activeChapterIndex === availableChapters.length - 1;
    const currentBible = availableBibles.find(b => b.id === selectedBibleId) || {};

    const getChapterText = () => {
        const isTamil = currentBible.language?.id === 'tam' || (currentBible.name || '').includes('Tamil');
        return isTamil ? 'அதிகாரம்' : 'Chapter';
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        const parsed = parseBibleSearch(searchQuery);
        if (!parsed) return;

        if (parsed.type === 'reference') {
            const fullChapterId = `${parsed.bookId}.${parsed.chapter}`;
            setActiveChapter(fullChapterId);
            setIsSearchActive(false);
            setSearchQuery("");
            setShowResults(false);
            if (parsed.verse) {
                setTargetScrollVerse(`${fullChapterId}.${parsed.verse}`);
            }
        } else {
            setIsSearching(true);
            setSearchResults([]);
            setShowResults(true);
            try {
                const results = await searchBible(selectedBibleId, searchQuery);
                setSearchResults(results);
            } catch (err) {
                if (err.message === "NETWORK_ERROR") {
                    setNetworkError(true);
                    setTimeout(() => setNetworkError(false), 4000);
                } else {
                    console.error("Error fetching search results:", err);
                }
            } finally {
                setIsSearching(false);
            }
        }
    };

    const backdropOpacity = sidebarAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    const sidebarTranslateX = sidebarAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-SIDEBAR_WIDTH, 0],
    });

    if (isInitialLoading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-background-dark">
                <StatusBar style={isDark ? "light" : "dark"} />
                <ActivityIndicator size="large" color="#1a355b" />
                <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-background-dark">
            {/* Dynamic status bar style ensuring proper contrast in light/dark themes */}
            <StatusBar style={isDark ? "light" : "dark"} animated />

            {networkError && (
                <View className="absolute top-12 left-4 right-4 z-50 bg-red-500 rounded-2xl p-4 shadow-xl flex-row items-center">
                    <MaterialIcons name="wifi-off" size={24} color="white" />
                    <Text className="text-white font-bold ml-3 flex-1 text-base">
                        Oops! Looks like the Internet is Disconnected, Please connect to Internet.
                    </Text>
                </View>
            )}

            {/* ---------- Smooth Animated Sidebar ---------- */}
            {isSidebarOpen && (
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 100 }}>
                    {/* Backdrop Overlay */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: '#000',
                            opacity: backdropOpacity,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={closeSidebar}
                            style={{ flex: 1 }}
                        />
                    </Animated.View>

                    {/* Sliding Drawer Container */}
                    <Animated.View
                        style={{
                            width: SIDEBAR_WIDTH,
                            height: '100%',
                            transform: [{ translateX: sidebarTranslateX }],
                        }}
                        className="bg-white dark:bg-slate-900 shadow-2xl pb-6 px-4"
                    >
                        {/* Status Bar Spacer to Prevent Content Overlap */}
                        <View style={{ height: insets.top, backgroundColor: isDark ? '#0f172a' : '#ffffff' }} />

                        {/* Header */}
                        <View className="flex-row items-center justify-between my-3 px-1">
                            <View className="flex-row items-center gap-3 flex-1 pr-3">
                                {navStep !== 'books' && (
                                    <TouchableOpacity onPress={handleNavBack} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <MaterialIcons name="arrow-back" size={20} color={isDark ? 'white' : '#0f172a'} />
                                    </TouchableOpacity>
                                )}
                                <Text numberOfLines={1} className="flex-1 text-2xl font-black text-primary dark:text-white">{navTitle}</Text>
                            </View>
                            <TouchableOpacity onPress={closeSidebar} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <MaterialIcons name="close" size={20} color={isDark ? 'white' : '#0f172a'} />
                            </TouchableOpacity>
                        </View>

                        {/* Defer Heavy Lists while Sliding */}
                        {isSidebarAnimating ? (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator color="#1a355b" />
                            </View>
                        ) : (
                            <>
                                {/* STEP 1: Books */}
                                {navStep === 'books' && (
                                    <>
                                        <View className="mb-4 flex-row rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                                            {[
                                                { key: 'OT', label: 'Old Testament' },
                                                { key: 'NT', label: 'New Testament' },
                                            ].map(t => {
                                                const on = testament === t.key;
                                                return (
                                                    <TouchableOpacity
                                                        key={t.key}
                                                        onPress={() => setTestament(t.key)}
                                                        className="flex-1 items-center rounded-xl py-2.5"
                                                        style={{ backgroundColor: on ? (isDark ? '#334155' : 'white') : 'transparent' }}
                                                    >
                                                        <Text style={{ fontSize: 13, color: on ? (isDark ? '#fff' : '#0f172a') : '#64748b' }} className="font-black">
                                                            {t.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>

                                        <FlatList
                                            key="books"
                                            data={availableBooks.filter(b => (testament === 'OT' ? OT_IDS : NT_IDS).includes(b.id))}
                                            keyExtractor={(b) => b.id}
                                            numColumns={3}
                                            columnWrapperStyle={{ gap: 8 }}
                                            contentContainerStyle={{ gap: 8, paddingBottom: 40 }}
                                            showsVerticalScrollIndicator={false}
                                            initialNumToRender={18}
                                            maxToRenderPerBatch={12}
                                            windowSize={5}
                                            renderItem={({ item }) => (
                                                <NavTile
                                                    label={item.name}
                                                    height={52}
                                                    fontSize={13}
                                                    flexBasis="31%"
                                                    active={activeChapter.startsWith(item.id + '.')}
                                                    onPress={() => openBook(item.id)}
                                                />
                                            )}
                                        />
                                    </>
                                )}

                                {/* STEP 2: Chapters */}
                                {navStep === 'chapters' && (
                                    <FlatList
                                        key="chapters"
                                        data={sidebarChapters.filter(c => c.number !== 'intro')}
                                        keyExtractor={(c) => c.id}
                                        numColumns={5}
                                        columnWrapperStyle={{ gap: 8 }}
                                        contentContainerStyle={{ gap: 8, paddingBottom: 40 }}
                                        showsVerticalScrollIndicator={false}
                                        initialNumToRender={25}
                                        ListEmptyComponent={<ActivityIndicator style={{ marginTop: 40 }} color="#1a355b" />}
                                        renderItem={({ item }) => (
                                            <NavTile
                                                label={String(item.number || item.id.split('.')[1] || '1')}
                                                fontSize={15}
                                                flexBasis="17%"
                                                active={activeChapter === item.id}
                                                onPress={() => setSelectedSidebarChapter(item.id)}
                                            />
                                        )}
                                    />
                                )}

                                {/* STEP 3: Verses */}
                                {navStep === 'verses' && (
                                    <FlatList
                                        key="verses"
                                        data={sidebarVerses}
                                        keyExtractor={(v) => String(v)}
                                        numColumns={5}
                                        columnWrapperStyle={{ gap: 8 }}
                                        contentContainerStyle={{ gap: 8, paddingBottom: 40 }}
                                        showsVerticalScrollIndicator={false}
                                        initialNumToRender={25}
                                        ListHeaderComponent={
                                            <TouchableOpacity
                                                onPress={() => goToVerse(selectedSidebarChapter)}
                                                className="mb-2 flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5"
                                            >
                                                <MaterialIcons name="menu-book" size={18} color="white" />
                                                <Text className="font-black text-white">Read full chapter</Text>
                                            </TouchableOpacity>
                                        }
                                        renderItem={({ item: v }) => (
                                            <NavTile
                                                label={String(v)}
                                                fontSize={15}
                                                flexBasis="17%"
                                                onPress={() => goToVerse(selectedSidebarChapter, v)}
                                            />
                                        )}
                                    />
                                )}
                            </>
                        )}
                    </Animated.View>
                </View>
            )}

            {/* Header Toolbar */}
            <View className="border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-background-dark">
                <View className="flex-row items-center justify-between px-6 py-4">
                    {isSearchActive ? (
                        <View className="flex-1 flex-row items-center gap-2">
                            <TouchableOpacity onPress={() => {
                                setIsSearchActive(false);
                                setSearchQuery("");
                                setShowResults(false);
                            }}>
                                <MaterialIcons name="arrow-back" size={24} color={isDark ? '#f1f5f9' : '#0f172a'} />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="Search 'psa' or 'In the beginning'..."
                                placeholderTextColor="#94a3b8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                                onSubmitEditing={handleSearch}
                                className="flex-1 text-base font-bold text-slate-900 dark:text-white"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery("")}>
                                    <MaterialIcons name="close" size={20} color="#94a3b8" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity onPress={openSidebar} className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5">
                                <MaterialIcons name="menu" size={24} color={isDark ? '#f1f5f9' : '#0f172a'} />
                            </TouchableOpacity>
                            <View className="items-center">
                                <Text className="text-xl font-black tracking-tighter text-primary dark:text-slate-100">Manna</Text>
                                <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Word of God</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsSearchActive(true)}
                                className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-white/5"
                            >
                                <MaterialIcons name="search" size={24} color={isDark ? '#f1f5f9' : '#0f172a'} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Search Results Overlay */}
            {showResults && (
                <View className="absolute top-[80px] left-0 right-0 bottom-0 z-50 bg-white dark:bg-background-dark px-6">
                    <View className="flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                        <Text className="text-sm font-black uppercase tracking-widest text-slate-400">
                            {isSearching ? "Searching..." : `${searchResults.length} Results for "${searchQuery}"`}
                        </Text>
                        <TouchableOpacity onPress={() => setShowResults(false)}>
                            <Text className="text-xs font-bold text-primary dark:text-accent uppercase">Close</Text>
                        </TouchableOpacity>
                    </View>

                    {isSearching ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#1a355b" />
                        </View>
                    ) : (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        const parts = item.id.split('.');
                                        setActiveChapter(`${parts[0]}.${parts[1]}`);
                                        setSelectedVerseId(item.id);
                                        setShowResults(false);
                                        setIsSearchActive(false);
                                        setSearchQuery("");
                                    }}
                                    className="py-6 border-b border-slate-50 dark:border-slate-800/50"
                                >
                                    <Text className="text-xs font-black uppercase tracking-widest text-primary dark:text-accent mb-2">
                                        {item.reference}
                                    </Text>
                                    <Text className="text-base font-serif italic text-slate-700 dark:text-slate-300">
                                        "{item.text.replace(/<[^>]*>?/gm, '')}"
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                !isSearching && (
                                    <View className="py-20 items-center">
                                        <MaterialIcons name="search-off" size={48} color="#cbd5e1" />
                                        <Text className="mt-4 text-slate-400 font-bold">No matches found across the Bible.</Text>
                                    </View>
                                )
                            }
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />
                    )}
                </View>
            )}

            <ScrollView ref={scrollViewRef} className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="mx-auto w-full max-w-2xl px-6">
                    <View className="mt-6 mb-6 overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 shadow-xl dark:border-slate-800 dark:bg-slate-900/40">
                        <View className="p-6">
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1 pr-4">
                                    <Text className="text-base font-bold uppercase tracking-widest text-primary dark:text-accent">
                                        {(() => {
                                            const book = availableBooks.find(b => activeChapter.startsWith(b.id)) || {};
                                            let n = book.nameLong || book.name || "Bible";
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
                                        {displayBibleName || "Select a version"}
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
                                chapterId={activeChapter}
                                onVersePress={(vid) => setSelectedVerseId(prev => prev === vid ? null : vid)}
                                onVerseLongPress={(vid) => setSelectedVerseId(vid)}
                                onVerseLayout={handleVerseLayout}
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

            {/* Bottom Verse Floating Action Bar */}
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
                                copyToClipboard(selectedVerseId);
                                setSelectedVerseId(null);
                            }}
                            className="active:scale-90"
                        >
                            <MaterialIcons name="content-copy" size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                handleSaveVerse(selectedVerseId);
                                setSelectedVerseId(null);
                            }}
                            className="active:scale-90"
                        >
                            <MaterialIcons
                                name={isSaved(selectedVerseId) ? "bookmark" : "bookmark-border"}
                                size={22}
                                color={isSaved(selectedVerseId) ? "#f97316" : "white"}
                            />
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