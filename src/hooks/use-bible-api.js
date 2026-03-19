import API_CONFIG from '../utils/API-key.js';

const BASE_URL = 'https://rest.api.bible/v1/';

const TARGET_VERSIONS = ['NIV', 'KJV', 'NLT'];

/**
 * Fetches all available bibles from the API.
 */
export const getAllBibles = async () => {
  console.log("MARKER: getAllBibles triggered");
  if (!API_CONFIG['api-key']) {
    console.error("CRITICAL: API KEY IS MISSING in API-key.js!");
  }
  try {
    const response = await fetch(`${BASE_URL}bibles`, {
      headers: {
        'Accept': 'application/json',
        'api-key': API_CONFIG['api-key'],
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const bibles = result.data || [];

    // Filter and De-duplicate for TARGET_VERSIONS
    const filtered = bibles.filter(bible => {
      const abbr = (bible.abbreviation || '').toUpperCase();
      const name = (bible.name || '').toUpperCase();

      return TARGET_VERSIONS.some(target => abbr.includes(target) || name.includes(target));
    });

    const finalSelection = [];
    const seenVersions = new Set();

    // Sort by abbreviation length to prioritize clean ones (NIV over NIV11)
    const sortedFiltered = filtered.sort((a, b) => (a.abbreviation || '').length - (b.abbreviation || '').length);

    for (const bible of sortedFiltered) {
      const abbr = (bible.abbreviation || '').toUpperCase();
      const langId = bible.language && bible.language.id;

      // Find which target this belongs to
      let target = TARGET_VERSIONS.find(t => abbr.includes(t));

      if (target && !seenVersions.has(target + langId)) {
        seenVersions.add(target + langId);
        // Overwrite abbreviation to be clean for the UI. Max 4 chars so it fits nicely
        bible.cleanAbbreviation = target.length > 5 ? target.substring(0, 4) : target;
        finalSelection.push(bible);
      }
    }

    return finalSelection;
  } catch (error) {
    console.error('Failed to fetch bibles:', error);
    return [];
  }
};

/**
 * Fetches available books for a specific bible.
 */
export const getBibleBooks = async (bibleId) => {
  console.log("MARKER: getBibleBooks triggered for", bibleId);
  if (!bibleId) return [];
  try {
    const response = await fetch(`${BASE_URL}bibles/${bibleId}/books`, {
      headers: {
        'Accept': 'application/json',
        'api-key': API_CONFIG['api-key'],
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
};

/**
 * Fetches available chapters for a specific book.
 */
export const getBibleChapters = async (bibleId, bookId) => {
  console.log("MARKER: getBibleChapters triggered for", { bibleId, bookId });
  if (!bibleId || !bookId) return [];
  try {
    const response = await fetch(`${BASE_URL}bibles/${bibleId}/books/${bookId}/chapters`, {
      headers: {
        'Accept': 'application/json',
        'api-key': API_CONFIG['api-key'],
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Chapters:", result.data);
    return result.data || [];
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    return [];
  }
};

/**
 * Fetches the content for a specific chapter.
 */
export const getBibleChapter = async (bibleId, chapterId) => {
  if (!bibleId || !chapterId) return null;

  console.log(`\n=== API FETCH ===`);
  console.log(`--> getBibleChapter called with bibleId: ${bibleId}, chapterId: ${chapterId}`);
  const url = `${BASE_URL}bibles/${bibleId}/chapters/${chapterId}?content-type=html`;
  console.log(`--> URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'api-key': API_CONFIG['api-key'],
      },
    });

    if (!response.ok) {
      console.log(`--> HTTP error status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`MARKER: API Response Received!`);
    
    if (data && data.data && data.data.content) {
      console.log(`MARKER: RAW Data Content (First 500 chars):\n${data.data.content.substring(0, 500)}...`);
      console.log(`MARKER: Total Content Length: ${data.data.content.length}`);

      // Forcefully remove any <a> tags or footnotes from the API response so that 
      // react-native-render-html never tries to process links (which crashes expo-router navigation context)
      const safeContent = data.data.content.replace(/<a[^>]*>.*?<\/a>/gi, '');
      return safeContent;
    }
    console.log(`--> Data empty for payload`, data);
    return null;
  } catch (error) {
    console.error('--> Failed to fetch Bible chapter:', error);
    return null;
  }
};

/**
 * Extracts unique languages from a list of bibles, filtered to English and Tamil.
 */
export const extractLanguages = (bibles) => {
  const languagesMap = {};
  const allowedLanguages = ['eng', 'tam'];

  bibles.forEach(bible => {
    const lang = bible.language;
    if (lang && allowedLanguages.includes(lang.id) && !languagesMap[lang.id]) {
      languagesMap[lang.id] = {
        id: lang.id,
        name: lang.name,
        nameLocal: lang.nameLocal
      };
    }
  });
  return Object.values(languagesMap).sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Filters bibles by language ID.
 */
export const filterBiblesByLanguage = (bibles, languageId) => {
  return bibles.filter(bible => bible.language && bible.language.id === languageId);
};
