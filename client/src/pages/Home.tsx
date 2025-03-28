import { useState } from "react";
import Header from "@/components/Header";
import VerseSelector from "@/components/VerseSelector";
import VerseDisplay from "@/components/VerseDisplay";
import AiContext from "@/components/AiContext";
import Footer from "@/components/Footer";
import { BibleVerse } from "@/lib/types";

const Home = () => {
  const [currentTranslation, setCurrentTranslation] = useState<string>("NRSV-CE"); // Changed default to NRSV-CE since GNT was having issues
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [showAiContext, setShowAiContext] = useState<boolean>(false);

  const handleVerseSelect = (verse: BibleVerse) => {
    setCurrentVerse(verse);
  };

  const handleTranslationChange = (translation: string) => {
    setCurrentTranslation(translation);
    // If we have a current verse, fetch it in the new translation
    if (currentVerse) {
      fetchVerseInNewTranslation(currentVerse, translation);
    }
  };

  const fetchVerseInNewTranslation = async (
    verse: BibleVerse,
    newTranslation: string
  ) => {
    try {
      const response = await fetch(
        `/api/verse/${newTranslation}/${verse.book}/${verse.chapter}/${verse.verse}`
      );
      if (response.ok) {
        const newVerse = await response.json();
        setCurrentVerse(newVerse);
      }
    } catch (error) {
      console.error("Error fetching verse in new translation:", error);
    }
  };

  const toggleAiContext = () => {
    setShowAiContext(!showAiContext);
  };

  // Handle navigation to next/previous verse
  const navigateToRelativeVerse = async (direction: "next" | "previous") => {
    if (!currentVerse) return;

    const { book, chapter, verse } = currentVerse;
    let newVerse = verse;
    let newChapter = chapter;
    let newBook = book;

    if (direction === "next") {
      newVerse += 1;
      // Logic for chapter/book boundaries would be more complex in a real app
    } else {
      newVerse -= 1;
      if (newVerse < 1) {
        newChapter -= 1;
        // Would need to get the last verse of the previous chapter
        newVerse = 1; // Simplified for now
      }
    }

    if (newVerse < 1) return; // Can't go before first verse

    try {
      const response = await fetch(
        `/api/verse/${currentTranslation}/${newBook}/${newChapter}/${newVerse}`
      );
      if (response.ok) {
        const newVerseData = await response.json();
        setCurrentVerse(newVerseData);
      }
    } catch (error) {
      console.error("Error navigating to verse:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header
        currentTranslation={currentTranslation}
        onTranslationChange={handleTranslationChange}
      />

      <div className="flex flex-grow">
        <main className="flex-grow p-4 md:p-6">
          <VerseSelector
            currentTranslation={currentTranslation}
            onVerseSelect={handleVerseSelect}
            toggleAiContext={toggleAiContext}
          />

          {currentVerse && (
            <VerseDisplay
              verse={currentVerse}
              onNavigate={navigateToRelativeVerse}
            />
          )}

          {showAiContext && currentVerse && (
            <AiContext
              book={currentVerse.book}
              chapter={currentVerse.chapter}
              verse={currentVerse.verse}
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
