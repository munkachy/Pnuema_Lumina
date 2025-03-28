import axios from "axios";
import { BibleVerse } from "@shared/schema";

// We'll use the API.Bible service which provides access to multiple Bible translations
const API_BIBLE_KEY = process.env.API_BIBLE_KEY;
const API_BIBLE_URL = "https://api.scripture.api.bible/v1";

// Map our internal translation IDs to API.Bible IDs
// These IDs have been verified to work with the API
const TRANSLATION_MAP = {
  "GNT": "65eec8e0b60e656b-01", // Good News Translation (Verified ID)
  "NRSV-CE": "40072c4a5aba4022-01", // New Revised Standard Version Catholic Edition
  "DRA": "179568874c45066f-01" // Douay-Rheims
};

// Map book names to API.Bible book IDs
const BOOK_ID_MAP: Record<string, string> = {
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
};

// Function to clean the verse text by removing the verse number
const cleanVerseText = (text: string): string => {
  // First try to match a verse number pattern like "12 " or "3 "
  const cleaned = text.replace(/^<p>\s*\d+\s+/, '<p>');
  // If that doesn't work, try just removing any leading numbers with spaces
  return cleaned.replace(/^\s*\d+\s+/, '');
};

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
    const translationId = TRANSLATION_MAP[translation as keyof typeof TRANSLATION_MAP];
    if (!translationId) {
      throw new Error(`Translation '${translation}' not found`);
    }
    
    const bookId = BOOK_ID_MAP[book.toLowerCase()];
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
    let verseContent = response.data.data.content;
    
    // Clean the verse content to remove the verse number
    verseContent = cleanVerseText(verseContent);
    
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
 * Get a completely random verse using the API's passage feature
 * This approach directly uses the API's capabilities rather than our own indexing
 */
export async function getRandomVerse(translation: string): Promise<BibleVerse> {
  try {
    const translationId = TRANSLATION_MAP[translation as keyof typeof TRANSLATION_MAP];
    if (!translationId) {
      throw new Error(`Translation '${translation}' not found`);
    }
    
    // 1. Get all the books available in this translation
    const booksResponse = await axios.get(
      `${API_BIBLE_URL}/bibles/${translationId}/books`,
      {
        headers: {
          "api-key": API_BIBLE_KEY
        }
      }
    );
    
    const books = booksResponse.data.data;
    
    // 2. Select a random book
    const randomBook = books[Math.floor(Math.random() * books.length)];
    
    // 3. Get all the chapters in the selected book
    const chaptersResponse = await axios.get(
      `${API_BIBLE_URL}/bibles/${translationId}/books/${randomBook.id}/chapters`,
      {
        headers: {
          "api-key": API_BIBLE_KEY
        }
      }
    );
    
    const chapters = chaptersResponse.data.data;
    
    // Skip the intro chapter if it exists (usually chapter id with 'intro')
    const filteredChapters = chapters.filter((ch: any) => !ch.id.includes('intro'));
    
    // 4. Select a random chapter
    const randomChapter = filteredChapters[Math.floor(Math.random() * filteredChapters.length)];
    
    // 5. Get all the verses in the selected chapter
    const versesResponse = await axios.get(
      `${API_BIBLE_URL}/bibles/${translationId}/chapters/${randomChapter.id}/verses`,
      {
        headers: {
          "api-key": API_BIBLE_KEY
        }
      }
    );
    
    const verses = versesResponse.data.data;
    
    // 6. Select a random verse
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    
    // 7. Now get the content of the random verse
    const verseResponse = await axios.get(
      `${API_BIBLE_URL}/bibles/${translationId}/verses/${randomVerse.id}`,
      {
        headers: {
          "api-key": API_BIBLE_KEY
        }
      }
    );
    
    const verseData = verseResponse.data.data;
    
    // 8. Extract book, chapter and verse from the reference
    // Format is typically like: "GEN.1.1" or similar
    const refParts = randomVerse.id.split('.');
    
    // Find the book name from our mapping
    const bookId = refParts[0];
    const bookName = Object.keys(BOOK_ID_MAP).find(
      key => BOOK_ID_MAP[key] === bookId
    ) || randomBook.name.toLowerCase();
    
    const chapterNum = parseInt(refParts[1]);
    const verseNum = parseInt(refParts[2]);
    
    console.log(`Selected random verse: ${bookName} ${chapterNum}:${verseNum}`);
    
    // Clean the verse content to remove the verse number
    const cleanedContent = cleanVerseText(verseData.content);
    
    return {
      book: bookName,
      chapter: chapterNum,
      verse: verseNum,
      text: cleanedContent,
      translation
    };
  } catch (error) {
    console.error("Error fetching random verse:", error);
    
    // Fallback to a known good verse
    try {
      console.log("Falling back to John 3:16");
      return await getBibleVerse(translation, "john", 3, 16);
    } catch (fallbackError) {
      console.error("Failed to fetch fallback verse:", fallbackError);
      throw new Error("Failed to fetch random verse");
    }
  }
}

/**
 * Search for Bible verses matching a query
 */
export async function searchBibleVerses(translation: string, query: string): Promise<BibleVerse[]> {
  try {
    const translationId = TRANSLATION_MAP[translation as keyof typeof TRANSLATION_MAP];
    if (!translationId) {
      throw new Error(`Translation '${translation}' not found`);
    }
    
    const response = await axios.get(
      `${API_BIBLE_URL}/bibles/${translationId}/search?query=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          "api-key": API_BIBLE_KEY
        }
      }
    );
    
    return response.data.data.verses.map((verse: any) => {
      const text = cleanVerseText(verse.text);
      return {
        book: verse.reference.split(' ')[0].toLowerCase(),
        chapter: parseInt(verse.reference.split(' ')[1].split(':')[0]),
        verse: parseInt(verse.reference.split(':')[1]),
        text: text,
        translation
      };
    });
  } catch (error) {
    console.error("Error searching Bible verses:", error);
    throw new Error("Failed to search Bible verses");
  }
}
