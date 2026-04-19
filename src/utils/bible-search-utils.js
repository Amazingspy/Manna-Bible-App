const BIBLE_BOOKS_ABBREVIATIONS = {
    // Old Testament
    'gen': 'GEN', 'exo': 'EXO', 'lev': 'LEV', 'num': 'NUM', 'deu': 'DEU', 'jos': 'JOS', 'jdg': 'JDG',
    'rut': 'RUT', '1sa': '1SA', '2sa': '2SA', '1ki': '1KI', '2ki': '2KI', '1ch': '1CH', '2ch': '2CH',
    'ezr': 'EZR', 'neh': 'NEH', 'est': 'EST', 'job': 'JOB', 'psa': 'PSA', 'pro': 'PRO', 'ecc': 'ECC',
    'sng': 'SNG', 'isa': 'ISA', 'jer': 'JER', 'lam': 'LAM', 'ezk': 'EZK', 'dan': 'DAN', 'hos': 'HOS',
    'jol': 'JOL', 'amo': 'AMO', 'oba': 'OBA', 'jon': 'JON', 'mic': 'MIC', 'nam': 'NAM', 'hab': 'HAB',
    'zep': 'ZEP', 'hag': 'HAG', 'zec': 'ZEC', 'mal': 'MAL',
    // New Testament
    'mat': 'MAT', 'mrk': 'MRK', 'luk': 'LUK', 'jhn': 'JHN', 'act': 'ACT', 'rom': 'ROM', '1co': '1CO',
    '2co': '2CO', 'gal': 'GAL', 'eph': 'EPH', 'php': 'PHP', 'col': 'COL', '1th': '1TH', '2th': '2TH',
    '1ti': '1TI', '2ti': '2TI', 'tit': 'TIT', 'phm': 'PHM', 'heb': 'HEB', 'jas': 'JAS', '1pe': '1PE',
    '2pe': '2PE', '1jn': '1JN', '2jn': '2JN', '3jn': '3JN', 'jud': 'JUD', 'rev': 'REV',
    // Common aliases
    'psalms': 'PSA', 'genesis': 'GEN', 'proverbs': 'PRO', 'john': 'JHN', 'john1': '1JN', '1john': '1JN'
};

/**
 * Parses a search query to determine if it's a reference or a text search.
 * @param {string} query 
 * @returns {object|null} { type: 'reference', bookId, chapter, verse } OR { type: 'text', query }
 */
export const parseBibleSearch = (query) => {
    if (!query) return null;
    const cleanQuery = query.toLowerCase().trim();

    // Regex for patterns like "John 3:16", "Jhn 3:16", "Jhn 3", "psa"
    // Handles: "Book Chapter:Verse" or "Book Chapter" or just "Book"
    const refRegex = /^(\d?\s?[a-z]+)\s*(\d+)?(?::(\d+))?$/;
    const match = cleanQuery.match(refRegex);

    if (match) {
        const bookRaw = match[1].replace(/\s+/g, '');
        const bookId = BIBLE_BOOKS_ABBREVIATIONS[bookRaw] || null;

        if (bookId) {
            return {
                type: 'reference',
                bookId,
                chapter: match[2] || '1',
                verse: match[3] || null
            };
        }
    }

    // Default to text search
    return {
        type: 'text',
        query: query
    };
};
