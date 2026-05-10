import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const SavedContext = createContext();

export const useSaved = () => {
    const context = useContext(SavedContext);
    if (!context) {
        throw new Error('useSaved must be used within a SavedProvider');
    }
    return context;
};

export const SavedProvider = ({ children }) => {
    const { user } = useAuth();
    const [savedVerses, setSavedVerses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setSavedVerses([]);
            return;
        }

        setIsLoading(true);
        // User-based collection path
        const savedRef = collection(db, "users", user.uid, "saved_verses");
        const q = query(savedRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const verses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore Timestamp back to ISO for compatibility
                savedAt: doc.data().savedAt?.toDate?.()?.toISOString() || new Date().toISOString()
            }));
            setSavedVerses(verses);
            setIsLoading(false);
        }, (error) => {
            console.error("Firestore Saved Verses Error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const saveVerse = async (verse) => {
        if (!user) return;
        
        try {
            const verseRef = doc(db, "users", user.uid, "saved_verses", verse.id);
            await setDoc(verseRef, {
                ...verse,
                savedAt: Timestamp.now()
            });
        } catch (error) {
            console.error("Error saving verse:", error);
        }
    };

    const removeVerse = async (verseId) => {
        if (!user) return;

        try {
            const verseRef = doc(db, "users", user.uid, "saved_verses", verseId);
            await deleteDoc(verseRef);
        } catch (error) {
            console.error("Error removing verse:", error);
        }
    };

    const isSaved = (verseId) => {
        return savedVerses.some((v) => v.id === verseId);
    };

    return (
        <SavedContext.Provider value={{ savedVerses, saveVerse, removeVerse, isSaved, isLoading }}>
            {children}
        </SavedContext.Provider>
    );
};
