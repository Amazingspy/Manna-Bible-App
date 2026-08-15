const BIBLE_BOOKS_ABBREVIATIONS = {
    // Old Testament - 3-letter codes
    'gen': 'GEN', 'exo': 'EXO', 'lev': 'LEV', 'num': 'NUM', 'deu': 'DEU', 'jos': 'JOS', 'jdg': 'JDG',
    'rut': 'RUT', '1sa': '1SA', '2sa': '2SA', '1ki': '1KI', '2ki': '2KI', '1ch': '1CH', '2ch': '2CH',
    'ezr': 'EZR', 'neh': 'NEH', 'est': 'EST', 'job': 'JOB', 'psa': 'PSA', 'pro': 'PRO', 'ecc': 'ECC',
    'sng': 'SNG', 'isa': 'ISA', 'jer': 'JER', 'lam': 'LAM', 'ezk': 'EZK', 'dan': 'DAN', 'hos': 'HOS',
    'jol': 'JOL', 'amo': 'AMO', 'oba': 'OBA', 'jon': 'JON', 'mic': 'MIC', 'nam': 'NAM', 'hab': 'HAB',
    'zep': 'ZEP', 'hag': 'HAG', 'zec': 'ZEC', 'mal': 'MAL',
    // New Testament - 3-letter codes
    'mat': 'MAT', 'mrk': 'MRK', 'luk': 'LUK', 'jhn': 'JHN', 'act': 'ACT', 'rom': 'ROM', '1co': '1CO',
    '2co': '2CO', 'gal': 'GAL', 'eph': 'EPH', 'php': 'PHP', 'col': 'COL', '1th': '1TH', '2th': '2TH',
    '1ti': '1TI', '2ti': '2TI', 'tit': 'TIT', 'phm': 'PHM', 'heb': 'HEB', 'jas': 'JAS', '1pe': '1PE',
    '2pe': '2PE', '1jn': '1JN', '2jn': '2JN', '3jn': '3JN', 'jud': 'JUD', 'rev': 'REV',
    // Full names - Old Testament
    'genesis': 'GEN', 'exodus': 'EXO', 'leviticus': 'LEV', 'numbers': 'NUM', 'deuteronomy': 'DEU',
    'joshua': 'JOS', 'judges': 'JDG', 'ruth': 'RUT',
    '1samuel': '1SA', '2samuel': '2SA', '1samuel': '1SA', '2samuel': '2SA',
    '1kings': '1KI', '2kings': '2KI', '1chronicles': '1CH', '2chronicles': '2CH',
    'ezra': 'EZR', 'nehemiah': 'NEH', 'esther': 'EST', 'job': 'JOB',
    'psalms': 'PSA', 'psalm': 'PSA', 'proverbs': 'PRO', 'ecclesiastes': 'ECC',
    'songofsolomon': 'SNG', 'songofsongsongs': 'SNG', 'canticles': 'SNG', 'sos': 'SNG',
    'isaiah': 'ISA', 'jeremiah': 'JER', 'lamentations': 'LAM', 'ezekiel': 'EZK',
    'daniel': 'DAN', 'hosea': 'HOS', 'joel': 'JOL', 'amos': 'AMO', 'obadiah': 'OBA',
    'jonah': 'JON', 'micah': 'MIC', 'nahum': 'NAM', 'habakkuk': 'HAB', 'zephaniah': 'ZEP',
    'haggai': 'HAG', 'zechariah': 'ZEC', 'malachi': 'MAL',
    // Full names - New Testament
    'matthew': 'MAT', 'mark': 'MRK', 'luke': 'LUK', 'john': 'JHN',
    'acts': 'ACT', 'romans': 'ROM',
    '1corinthians': '1CO', '2corinthians': '2CO',
    'galatians': 'GAL', 'ephesians': 'EPH', 'philippians': 'PHP', 'colossians': 'COL',
    '1thessalonians': '1TH', '2thessalonians': '2TH',
    '1timothy': '1TI', '2timothy': '2TI', 'titus': 'TIT', 'philemon': 'PHM',
    'hebrews': 'HEB', 'james': 'JAS',
    '1peter': '1PE', '2peter': '2PE',
    '1john': '1JN', '2john': '2JN', '3john': '3JN',
    'jude': 'JUD', 'revelation': 'REV', 'revelations': 'REV',
    // Common short abbreviations (3+ letters only to avoid colliding with English words)
    'jsh': 'JOS', 'jdg': 'JDG',
    '1sm': '1SA', '2sm': '2SA', '1kgs': '1KI', '2kgs': '2KI',
    '1chr': '1CH', '2chr': '2CH',
    'psa': 'PSA', 'pro': 'PRO', 'ecc': 'ECC',
    'isa': 'ISA', 'jer': 'JER', 'lam': 'LAM', 'ezk': 'EZK', 'dan': 'DAN',
    'hos': 'HOS', 'joe': 'JOL', 'jon': 'JON', 'mic': 'MIC', 'nah': 'NAM', 'hab': 'HAB',
    'zep': 'ZEP', 'hag': 'HAG', 'zec': 'ZEC', 'mal': 'MAL',
    'matt': 'MAT', 'mrk': 'MRK', 'luk': 'LUK',
    'act': 'ACT', 'rom': 'ROM',
    '1cor': '1CO', '2cor': '2CO',
    'gal': 'GAL', 'eph': 'EPH', 'php': 'PHP', 'col': 'COL',
    '1th': '1TH', '2th': '2TH',
    '1tim': '1TI', '2tim': '2TI', 'tit': 'TIT', 'phm': 'PHM',
    'heb': 'HEB', 'jas': 'JAS',
    '1pt': '1PE', '2pt': '2PE',
    'jud': 'JUD', 'rev': 'REV',
};

/**
 * Parses a search query to determine if it's a reference or a text search.
 * Handles formats like:
 *   - "John 3:16", "Jhn 3:16", "jhn 3", "psa", "1 Cor 13:4", "1Cor13:4"
 *   - Full names: "Matthew 5:3", "Revelation 21", "genesis 1:1"
 * @param {string} query 
 * @returns {object|null} { type: 'reference', bookId, chapter, verse } OR { type: 'text', query }
 */
export const parseBibleSearch = (query) => {
    if (!query) return null;
    const cleanQuery = query.toLowerCase().trim();

    // Regex for patterns like:
    //   "1 John 3:16"  -> prefix=1, book=john, chapter=3, verse=16
    //   "John 3:16"    -> prefix='', book=john, chapter=3, verse=16
    //   "psa 23"       -> prefix='', book=psa, chapter=23
    //   "genesis"      -> prefix='', book=genesis, chapter=undefined
    // The optional numeric prefix (1, 2, 3) can be separated from the book by a space or not.
    const refRegex = /^(\d)?\s*([a-z]+)\s*(\d+)?(?::(\d+))?$/;
    const match = cleanQuery.match(refRegex);

    if (match) {
        const prefix = match[1] || '';          // e.g. '1', '2', '3', or ''
        const bookRaw = match[2];               // e.g. 'john', 'cor', 'gen'
        const chapterStr = match[3];
        const verseStr = match[4];

        // Try with numeric prefix first, then without
        const keyWithPrefix = prefix ? `${prefix}${bookRaw}` : bookRaw;
        const bookId = BIBLE_BOOKS_ABBREVIATIONS[keyWithPrefix]
            || (prefix ? null : BIBLE_BOOKS_ABBREVIATIONS[bookRaw])
            || null;

        if (bookId) {
            return {
                type: 'reference',
                bookId,
                chapter: chapterStr || '1',
                verse: verseStr || null
            };
        }
    }

    // Default to text search
    return {
        type: 'text',
        query: query
    };
};

