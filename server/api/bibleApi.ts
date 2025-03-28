import axios from "axios";
import { BibleVerse } from "@shared/schema";
import { get_verse_location, TOTAL_VERSES } from "../util/bibleData";

// We'll use the API.Bible service which provides access to multiple Bible translations
const API_BIBLE_KEY = process.env.API_BIBLE_KEY;
const API_BIBLE_URL = "https://api.scripture.api.bible/v1";

// Map our internal translation IDs to API.Bible IDs
const TRANSLATION_MAP = {
  "GNT": "61fd76eafa1577c2-01", // Good News Translation (Updated ID)
  "NRSV-CE": "40072c4a5aba4022-01", // New Revised Standard Version Catholic Edition
  "DRA": "179568874c45066f-01" // Douay-Rheims
};

// Map book names to API.Bible book IDs (this would be a much longer list in production)
const BOOK_ID_MAP: Record<string, Record<string, string>> = {
  "GNT": {
    "genesis": "GEN",
    "exodus": "EXO",
    "leviticus": "LEV",
    "numbers": "NUM",
    "deuteronomy": "DEU",
    "joshua": "JOS",
    "judges": "JDG",
    "ruth": "RUT",
    "1samuel": "1SA",
    "2samuel": "2SA",
    "1kings": "1KI",
    "2kings": "2KI",
    "1chronicles": "1CH",
    "2chronicles": "2CH",
    "ezra": "EZR",
    "nehemiah": "NEH",
    "esther": "EST",
    "job": "JOB",
    "psalms": "PSA",
    "proverbs": "PRO",
    "ecclesiastes": "ECC",
    "songofsolomon": "SNG",
    "isaiah": "ISA",
    "jeremiah": "JER",
    "lamentations": "LAM",
    "ezekiel": "EZK",
    "daniel": "DAN",
    "hosea": "HOS",
    "joel": "JOL",
    "amos": "AMO",
    "obadiah": "OBA",
    "jonah": "JON",
    "micah": "MIC",
    "nahum": "NAM",
    "habakkuk": "HAB",
    "zephaniah": "ZEP",
    "haggai": "HAG",
    "zechariah": "ZEC",
    "malachi": "MAL",
    "matthew": "MAT",
    "mark": "MRK",
    "luke": "LUK",
    "john": "JHN",
    "acts": "ACT",
    "romans": "ROM",
    "1corinthians": "1CO",
    "2corinthians": "2CO",
    "galatians": "GAL",
    "ephesians": "EPH",
    "philippians": "PHP",
    "colossians": "COL",
    "1thessalonians": "1TH",
    "2thessalonians": "2TH",
    "1timothy": "1TI",
    "2timothy": "2TI",
    "titus": "TIT",
    "philemon": "PHM",
    "hebrews": "HEB",
    "james": "JAS",
    "1peter": "1PE",
    "2peter": "2PE",
    "1john": "1JN",
    "2john": "2JN",
    "3john": "3JN",
    "jude": "JUD",
    "revelation": "REV",
    // Deuterocanonical books
    "tobit": "TOB",
    "judith": "JDT",
    "wisdom": "WIS",
    "sirach": "SIR",
    "baruch": "BAR",
    "1maccabees": "1MA",
    "2maccabees": "2MA"
  }
};

// Other translations would have similar mappings
// For brevity, we'll just use the GNT mapping for all translations in this example

/**
 * Fetch a specific Bible verse from the API
 */
export async function getBibleVerse(
  translation: string, 
  book: string, 
  chapter: number, 
  verse: number
): Promise<BibleVerse> {
  try {
    const translationId = TRANSLATION_MAP[translation as keyof typeof TRANSLATION_MAP] || TRANSLATION_MAP.GNT;
    const bookId = BOOK_ID_MAP.GNT[book.toLowerCase()];
    
    if (!bookId) {
      throw new Error(`Book '${book}' not found`);
    }
    
    const response = await axios.get(
      `${API_BIBLE_URL}/bibles/${translationId}/verses/${bookId}.${chapter}.${verse}`,
      {
        headers: {
          "api-key": API_BIBLE_KEY
        }
      }
    );
    
    // Extract the verse content from the API response
    // The content comes as HTML, so we'll keep it that way for proper formatting
    const verseContent = response.data.data.content;
    
    return {
      book,
      chapter,
      verse,
      text: verseContent,
      translation
    };
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    throw new Error("Failed to fetch Bible verse");
  }
}

/**
 * Get a random Bible verse, ensuring a truly random selection from the entire Bible
 */
export async function getRandomVerse(translation: string): Promise<BibleVerse> {
  try {
    // Use a direct numerical approach to get a random verse from the entire Bible
    // This ensures verses are picked with equal probability regardless of book size
    const randomVerseNum = Math.floor(Math.random() * TOTAL_VERSES) + 1;
    const [book, chapter, verse] = get_verse_location(randomVerseNum);
    
    // Log the selected verse for debugging
    console.log(`Selected random verse: ${book} ${chapter}:${verse} (verse #${randomVerseNum}/${TOTAL_VERSES})`);
    
    // Attempt to fetch the verse
    return await getBibleVerse(translation, book, chapter, verse);
  } catch (error) {
    // If we encounter an error, try another random verse as a fallback
    console.error("Error fetching random verse, trying another one:", error);
    
    // Try a different verse from the New Testament (verses 23069 to 30564)
    // This increases the chance of success since most translations have the NT
    const ntStart = 23069; // Matthew 1:1
    const ntEnd = 30564;   // Revelation 3:22
    const randomNTVerseNum = Math.floor(Math.random() * (ntEnd - ntStart + 1)) + ntStart;
    
    try {
      const [fallbackBook, fallbackChapter, fallbackVerse] = get_verse_location(randomNTVerseNum);
      console.log(`Fallback random verse: ${fallbackBook} ${fallbackChapter}:${fallbackVerse}`);
      return await getBibleVerse(translation, fallbackBook, fallbackChapter, fallbackVerse);
    } catch (fallbackError) {
      console.error("Failed to fetch fallback random verse:", fallbackError);
      
      // Last resort: Return a hardcoded known-good verse if all random attempts fail
      return await getBibleVerse(translation, "john", 3, 16);
    }
  }
}

/**
 * Search for Bible verses matching a query
 */
export async function searchBibleVerses(translation: string, query: string): Promise<BibleVerse[]> {
  try {
    const translationId = TRANSLATION_MAP[translation as keyof typeof TRANSLATION_MAP] || TRANSLATION_MAP.GNT;
    
    const response = await axios.get(
      `${API_BIBLE_URL}/bibles/${translationId}/search?query=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          "api-key": API_BIBLE_KEY
        }
      }
    );
    
    return response.data.data.verses.map((verse: any) => ({
      book: verse.reference.split(' ')[0],
      chapter: parseInt(verse.reference.split(' ')[1].split(':')[0]),
      verse: parseInt(verse.reference.split(':')[1]),
      text: verse.text,
      translation
    }));
  } catch (error) {
    console.error("Error searching Bible verses:", error);
    throw new Error("Failed to search Bible verses");
  }
}
