import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BibleVerse } from "./types";

// Hook for Bible verse navigation
export const useVerseNavigation = (
  book: string,
  chapter: number,
  verse: number,
  translation: string
) => {
  const [currentBook, setCurrentBook] = useState(book);
  const [currentChapter, setCurrentChapter] = useState(chapter);
  const [currentVerse, setCurrentVerse] = useState(verse);

  // Function to get the next verse
  const getNextVerse = async () => {
    try {
      // This is a simplified implementation. In a full app, we would need to handle
      // book and chapter boundaries correctly.
      const response = await fetch(
        `/api/verse/${translation}/${currentBook}/${currentChapter}/${currentVerse + 1}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setCurrentBook(data.book);
        setCurrentChapter(data.chapter);
        setCurrentVerse(data.verse);
        return data;
      }
      
      // If we get a 404, we might be at the end of a chapter or book
      // Here we would implement logic to move to the next chapter/book
      
      return null;
    } catch (error) {
      console.error("Error navigating to next verse:", error);
      return null;
    }
  };

  // Function to get the previous verse
  const getPreviousVerse = async () => {
    if (currentVerse <= 1) {
      // We're at the first verse of a chapter, need to go to previous chapter
      // Logic for handling chapter/book boundaries would go here
      return null;
    }
    
    try {
      const response = await fetch(
        `/api/verse/${translation}/${currentBook}/${currentChapter}/${currentVerse - 1}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setCurrentBook(data.book);
        setCurrentChapter(data.chapter);
        setCurrentVerse(data.verse);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("Error navigating to previous verse:", error);
      return null;
    }
  };

  return {
    currentBook,
    currentChapter,
    currentVerse,
    getNextVerse,
    getPreviousVerse
  };
};

// Hook to detect if the device is mobile
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
};
