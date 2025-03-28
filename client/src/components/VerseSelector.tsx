import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/api';
import { BibleVerse } from '@/lib/types';

interface VerseSelectorProps {
  onVerseSelect: (verse: BibleVerse) => void;
  currentTranslation: string;
}

export function VerseSelector({ onVerseSelect, currentTranslation }: VerseSelectorProps) {
  const [books, setBooks] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [chapters, setChapters] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<number[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  // Fetch books from DRA translation
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apiRequest<Array<{ id: string; name: string }>>({
          url: `/api/books/DRA`,
          method: 'GET'
        });
        if (response) {
          setBooks(response);
        }
      } catch (error) {
        console.error('Error fetching Bible books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Fetch chapters when book is selected
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedBook) return;
      try {
        const response = await apiRequest<number[]>({
          url: `/api/chapters/${selectedBook}`,
          method: 'GET'
        });
        if (response) {
          setChapters(response);
          setSelectedChapter(null);
          setVerses([]);
          setSelectedVerse(null);
        }
      } catch (error) {
        console.error(`Error fetching chapters for book ${selectedBook}:`, error);
      }
    };
    fetchChapters();
  }, [selectedBook]);

  // Fetch verses when chapter is selected
  useEffect(() => {
    const fetchVerses = async () => {
      if (!selectedBook || !selectedChapter) return;
      try {
        const response = await apiRequest<number[]>({
          url: `/api/verses/${selectedBook}/${selectedChapter}`,
          method: 'GET'
        });
        if (response) {
          setVerses(response);
          setSelectedVerse(null);
        }
      } catch (error) {
        console.error(`Error fetching verses for ${selectedBook} ${selectedChapter}:`, error);
      }
    };
    fetchVerses();
  }, [selectedBook, selectedChapter]);

  const handleVerseSelect = async () => {
    if (!selectedBook || !selectedChapter || !selectedVerse) return;
    try {
      const verse = await apiRequest<BibleVerse>({
        url: `/api/verse/${currentTranslation}/${selectedBook}/${selectedChapter}/${selectedVerse}`,
        method: 'GET'
      });
      if (verse) {
        onVerseSelect(verse);
      }
    } catch (error) {
      console.error('Error fetching verse:', error);
    }
  };

  const handleRandomVerse = async () => {
    try {
      const verse = await apiRequest<BibleVerse>({
        url: `/api/random-verse/${currentTranslation}`,
        method: 'GET'
      });
      if (verse) {
        onVerseSelect(verse);
        // Update selectors to match random verse
        setSelectedBook(verse.book);
        setSelectedChapter(verse.chapter);
        setSelectedVerse(verse.verse);
      }
    } catch (error) {
      console.error('Error fetching random verse:', error);
    }
  };

  return (
    <Tabs defaultValue="dropdown" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dropdown">Select Verse</TabsTrigger>
        <TabsTrigger value="random">Random Verse</TabsTrigger>
      </TabsList>

      <TabsContent value="dropdown" className="mt-2">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="Select Book" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id.toLowerCase()}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedChapter?.toString() || ''}
              onValueChange={(value) => setSelectedChapter(parseInt(value))}>
              <SelectTrigger className="w-full md:w-auto" disabled={!selectedBook}>
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    {chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedVerse?.toString() || ''}
              onValueChange={(value) => setSelectedVerse(parseInt(value))}>
              <SelectTrigger className="w-full md:w-auto" disabled={!selectedChapter}>
                <SelectValue placeholder="Verse" />
              </SelectTrigger>
              <SelectContent>
                {verses.map((verse) => (
                  <SelectItem key={verse} value={verse.toString()}>
                    {verse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleVerseSelect}
            disabled={!selectedBook || !selectedChapter || !selectedVerse}>
            Get Verse
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="random" className="mt-2">
        <div className="flex justify-center">
          <Button onClick={handleRandomVerse} className="w-full md:w-auto">
            Get Random Verse
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}