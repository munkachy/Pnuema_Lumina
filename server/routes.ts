import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getBibleVerse, getRandomVerse, searchBibleVerses } from "./api/bibleApi";
import { bible_verse_counts, book_name_mapping } from "./util/bibleData";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bible API routes
  app.get("/api/verse/:translation/:book/:chapter/:verse", async (req, res) => {
    try {
      const { translation, book, chapter, verse } = req.params;
      const verseData = await getBibleVerse(translation, book, parseInt(chapter), parseInt(verse));
      res.json(verseData);
    } catch (error) {
      console.error("Error fetching verse:", error);
      res.status(500).json({ message: "Failed to fetch Bible verse" });
    }
  });

  app.get("/api/random-verse/:translation?", async (req, res) => {
    try {
      const { translation } = req.params;
      const randomVerse = await getRandomVerse(translation || "GNT");
      res.json(randomVerse);
    } catch (error) {
      console.error("Error fetching random verse:", error);
      res.status(500).json({ message: "Failed to fetch random Bible verse" });
    }
  });

  app.get("/api/search/:translation/:query", async (req, res) => {
    try {
      const { translation, query } = req.params;
      const results = await searchBibleVerses(translation, query);
      res.json(results);
    } catch (error) {
      console.error("Error searching verses:", error);
      res.status(500).json({ message: "Failed to search Bible verses" });
    }
  });
  
  // Get all Bible books with formatting for a specific translation
  app.get("/api/books/:translation", async (req, res) => {
    try {
      const { translation } = req.params;
      const translationId = getTranslationId(translation);
      const response = await axios.get(
        `${API_BIBLE_URL}/bibles/${translationId}/books`,
        {
          headers: {
            "api-key": API_BIBLE_KEY
          }
        }
      );
      
      const books = response.data.data.map((book: any) => ({
        id: book.id,
        name: book.name,
        testament: book.testament?.toLowerCase() || "unknown",
        group: book.category?.toLowerCase() || "unknown"
      }));
      
      res.json(books);
    } catch (error) {
      console.error("Error fetching Bible books:", error);
      res.status(500).json({ message: "Failed to fetch Bible books" });
    }
  });
  
  // Get all chapters for a book
  app.get("/api/chapters/:book", (req, res) => {
    try {
      const { book } = req.params;
      const bookData = bible_verse_counts[book];
      
      if (!bookData) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      const chapters = Object.keys(bookData).map(Number);
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching book chapters:", error);
      res.status(500).json({ message: "Failed to fetch book chapters" });
    }
  });
  
  // Get all verses for a chapter
  app.get("/api/verses/:book/:chapter", (req, res) => {
    try {
      const { book, chapter } = req.params;
      const chapterNum = parseInt(chapter);
      
      if (!bible_verse_counts[book] || !bible_verse_counts[book][chapterNum]) {
        return res.status(404).json({ message: "Book chapter not found" });
      }
      
      const verseCount = bible_verse_counts[book][chapterNum];
      const verses = Array.from({ length: verseCount }, (_, i) => i + 1);
      
      res.json(verses);
    } catch (error) {
      console.error("Error fetching chapter verses:", error);
      res.status(500).json({ message: "Failed to fetch chapter verses" });
    }
  });

  // AI Context generation with Gemini API
  app.post("/api/ai-context", async (req, res) => {
    try {
      const { book, chapter, verse, persona } = req.body;
      
      if (!book || !chapter || !verse) {
        return res.status(400).json({ message: "Book, chapter, and verse are required" });
      }
      
      const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDW9Az1U59mSFrN0fVzQ3B1uninUqO3ghY";
      const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
      
      let prompt;
      if (persona) {
        prompt = `Speaking as ${persona}, in one tight paragraph, explain the context of ${book} ${chapter}:${verse} and add an insight that ${persona} might have. No verse quotes. Weave the sayings or writings of ${persona} into the paragraph if relevant. Let your voice as ${persona} shape the tone and insight.`;
      } else {
        prompt = `In one tight, gritty paragraph, explain why the verse at ${book} ${chapter}:${verse} matters. No verse quotes, just tell how it fits in the story that's unfolding. Name the speaker or what's happening, and why it packs a punch. For Old Testament, spot any Christian typology—like the Ark hinting at Mary—and hit it quick.`;
      }
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 250 }
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (response.data.candidates && response.data.candidates.length > 0) {
        const aiContext = response.data.candidates[0].content.parts[0].text.trim();
        res.json({ text: aiContext, persona });
      } else {
        res.status(500).json({ message: "Could not retrieve context from Gemini" });
      }
    } catch (error) {
      console.error("Error generating AI context:", error);
      res.status(500).json({ message: "Failed to generate AI context" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
