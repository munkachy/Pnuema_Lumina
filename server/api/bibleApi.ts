import axios from "axios";
import { BibleVerse } from "@shared/schema";
import { get_verse_location, TOTAL_VERSES } from "../util/bibleData";

// We'll use the API.Bible service which provides access to multiple Bible translations
const API_BIBLE_KEY = process.env.API_BIBLE_KEY;
const API_BIBLE_URL = "https://api.scripture.api.bible/v1";

// Map our internal translation IDs to API.Bible IDs
const TRANSLATION_MAP = {
  "GNT": "296a112c45d5962a-01", // Good News Translation (use this ID instead of the one that's giving 403 errors)
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
 * Get a random Bible verse
 */
export async function getRandomVerse(translation: string): Promise<BibleVerse> {
  try {
    // Use the BIBLE_VERSE_INDEX from the attached assets to pick a random verse
    const randomVerseNum = Math.floor(Math.random() * TOTAL_VERSES) + 1;
    const [book, chapter, verse] = get_verse_location(randomVerseNum);
    
    return await getBibleVerse(translation, book, chapter, verse);
  } catch (error) {
    console.error("Error fetching random verse:", error);
    throw new Error("Failed to fetch random verse");
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
