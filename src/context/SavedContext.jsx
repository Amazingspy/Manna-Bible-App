import React, { createContext, useState, useContext } from 'react';

const SavedContext = createContext();

export const useSaved = () => {
    const context = useContext(SavedContext);
    if (!context) {
        throw new Error('useSaved must be used within a SavedProvider');
    }
    return context;
};

export const SavedProvider = ({ children }) => {
    const [savedVerses, setSavedVerses] = useState([]);

    const saveVerse = (verse) => {
        setSavedVerses((prev) => {
            // Check if already saved
            if (prev.find((v) => v.id === verse.id)) {
                return prev;
            }
            return [...prev, { ...verse, savedAt: new Date().toISOString() }];
        });
    };

    const removeVerse = (verseId) => {
        setSavedVerses((prev) => prev.filter((v) => v.id !== verseId));
    };

    const isSaved = (verseId) => {
        return savedVerses.some((v) => v.id === verseId);
    };

    return (
        <SavedContext.Provider value={{ savedVerses, saveVerse, removeVerse, isSaved }}>
            {children}
        </SavedContext.Provider>
    );
};
