import React, { useEffect, useState } from 'react';
import { getBibleBooks, getChapters, getVerses } from '@/lib/bibleData';
import { BibleBook } from '@/lib/types';

interface VerseSelectorProps {
  translation: string;
  onVerseSelect: (book: string, chapter: number, verse: number) => void;
}

export function VerseSelector({ translation, onVerseSelect }: VerseSelectorProps) {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [chapters, setChapters] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [verses, setVerses] = useState<number[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<number>(0);

  useEffect(() => {
    const loadBooks = async () => {
      const bibleBooks = await getBibleBooks(translation);
      setBooks(bibleBooks);
    };
    loadBooks();
  }, [translation]);

  useEffect(() => {
    const loadChapters = async () => {
      if (selectedBook) {
        const bookChapters = await getChapters(selectedBook);
        setChapters(bookChapters);
        setSelectedChapter(0);
        setVerses([]);
      }
    };
    loadChapters();
  }, [selectedBook]);

  useEffect(() => {
    const loadVerses = async () => {
      if (selectedBook && selectedChapter) {
        const chapterVerses = await getVerses(selectedBook, selectedChapter);
        setVerses(chapterVerses);
      }
    };
    loadVerses();
  }, [selectedBook, selectedChapter]);

  const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(event.target.value);
  };

  const handleChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChapter(Number(event.target.value));
  };

  const handleVerseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const verse = Number(event.target.value);
    setSelectedVerse(verse);
    if (selectedBook && selectedChapter && verse) {
      onVerseSelect(selectedBook, selectedChapter, verse);
    }
  };

  return (
    <div className="flex gap-4">
      <select
        value={selectedBook}
        onChange={handleBookChange}
        className="p-2 rounded border"
      >
        <option value="">Select Book</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.name}
          </option>
        ))}
      </select>

      <select
        value={selectedChapter}
        onChange={handleChapterChange}
        className="p-2 rounded border"
        disabled={!selectedBook}
      >
        <option value={0}>Select Chapter</option>
        {chapters.map((chapter) => (
          <option key={chapter} value={chapter}>
            {chapter}
          </option>
        ))}
      </select>

      <select
        value={selectedVerse}
        onChange={handleVerseChange}
        className="p-2 rounded border"
        disabled={!selectedChapter}
      >
        <option value={0}>Select Verse</option>
        {verses.map((verse) => (
          <option key={verse} value={verse}>
            {verse}
          </option>
        ))}
      </select>
    </div>
  );
}