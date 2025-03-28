import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shuffle, Brain, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getBibleBooks, getChapters, getVerses } from "@/lib/bibleData";
import { BibleVerse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerseSelectorProps {
  currentTranslation: string;
  onVerseSelect: (verse: BibleVerse) => void;
  toggleAiContext: () => void;
}

const VerseSelector = ({
  currentTranslation,
  onVerseSelect,
  toggleAiContext,
}: VerseSelectorProps) => {
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");
  const [directReference, setDirectReference] = useState<string>("");
  const [selectorMode, setSelectorMode] = useState<string>("dropdown");
  const { toast } = useToast();

  // Get all Bible books
  const { data: books } = useQuery({
    queryKey: ["/api/books"],
    queryFn: getBibleBooks,
  });

  // Get chapters for selected book
  const { data: chapters } = useQuery({
    queryKey: ["/api/chapters", selectedBook],
    queryFn: () => getChapters(selectedBook),
    enabled: !!selectedBook,
  });

  // Get verses for selected chapter
  const { data: verses } = useQuery({
    queryKey: ["/api/verses", selectedBook, selectedChapter],
    queryFn: () => getVerses(selectedBook, parseInt(selectedChapter)),
    enabled: !!selectedBook && !!selectedChapter,
  });

  const handleBookChange = (value: string) => {
    setSelectedBook(value);
    setSelectedChapter("");
    setSelectedVerse("");
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    setSelectedVerse("");
  };

  const handleVerseChange = (value: string) => {
    setSelectedVerse(value);
  };

  const handleDirectReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirectReference(e.target.value);
  };

  const parseDirectReference = (ref: string): { book: string, chapter: string, verse: string } | null => {
    // Try to match patterns like "John 3:16" or "Genesis 1:1-3" (we'll just take the first verse for ranges)
    const match = ref.match(/^([a-zA-Z0-9\s]+)\s+(\d+):(\d+)(?:-\d+)?$/);

    if (!match) return null;

    const [, bookName, chapter, verse] = match;
    const book = Object.entries(books || []).find(
      ([, book]) => book.name.toLowerCase() === bookName.trim().toLowerCase()
    )?.[1]?.id;

    return book ? { book, chapter, verse } : null;
  };

  const handleDirectReferenceSubmit = async () => {
    const parsedRef = parseDirectReference(directReference);

    if (!parsedRef) {
      toast({
        title: "Invalid reference",
        description: "Please enter a reference in the format 'Book 1:1' (e.g. 'John 3:16').",
        variant: "destructive",
      });
      return;
    }

    setSelectedBook(parsedRef.book);
    setSelectedChapter(parsedRef.chapter);
    setSelectedVerse(parsedRef.verse);

    // Now fetch the verse
    try {
      const response = await fetch(
        `/api/verse/${currentTranslation}/${parsedRef.book}/${parsedRef.chapter}/${parsedRef.verse}`
      );
      if (response.ok) {
        const verse = await response.json();
        onVerseSelect(verse);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch the requested verse.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the verse.",
        variant: "destructive",
      });
    }
  };

  const handleGoClick = async () => {
    if (!selectedBook || !selectedChapter || !selectedVerse) {
      toast({
        title: "Selection required",
        description: "Please select a book, chapter, and verse.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/verse/${currentTranslation}/${selectedBook}/${selectedChapter}/${selectedVerse}`
      );
      if (response.ok) {
        const verse = await response.json();
        onVerseSelect(verse);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch the requested verse.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the verse.",
        variant: "destructive",
      });
    }
  };

  const handleRandomVerse = async () => {
    try {
      const response = await fetch(`/api/random-verse/${currentTranslation}`);
      if (response.ok) {
        const verse = await response.json();
        onVerseSelect(verse);

        // Update the selectors to match the random verse
        setSelectedBook(verse.book);
        setSelectedChapter(verse.chapter.toString());
        setSelectedVerse(verse.verse.toString());
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch a random verse.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching a random verse.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <CardContent className="p-0">
        <Tabs value={selectorMode} onValueChange={setSelectorMode} className="mt-1 mb-4">
          <TabsList className="grid w-full md:w-64 grid-cols-2">
            <TabsTrigger value="dropdown">Dropdown Selection</TabsTrigger>
            <TabsTrigger value="direct">Direct Input</TabsTrigger>
          </TabsList>

          <TabsContent value="dropdown" className="mt-2">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Book, Chapter, Verse Selector */}
              <div className="flex-grow flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                <Select value={selectedBook} onValueChange={handleBookChange}>
                  <SelectTrigger className="w-full md:w-auto">
                    <SelectValue placeholder="Select Book" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {books?.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedChapter}
                  onValueChange={handleChapterChange}
                  disabled={!selectedBook}
                >
                  <SelectTrigger className="w-full md:w-[100px]">
                    <SelectValue placeholder="Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter} value={chapter.toString()}>
                        {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedVerse}
                  onValueChange={handleVerseChange}
                  disabled={!selectedChapter}
                >
                  <SelectTrigger className="w-full md:w-[100px]">
                    <SelectValue placeholder="Verse" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {verses?.map((verse) => (
                      <SelectItem key={verse} value={verse.toString()}>
                        {verse}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleGoClick}
                  className="bg-primary text-white hover:bg-primary/90 w-full md:w-auto"
                >
                  Go
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="direct" className="mt-2">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                <div className="flex-grow flex items-center">
                  <Input
                    type="text"
                    placeholder="Enter reference (e.g. John 3:16)"
                    value={directReference}
                    onChange={handleDirectReferenceChange}
                    className="w-full md:w-auto flex-1"
                  />
                  <Button
                    onClick={handleDirectReferenceSubmit}
                    className="bg-primary text-white hover:bg-primary/90 ml-2"
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Go
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex space-x-2 md:justify-end">
          <Button
            onClick={handleRandomVerse}
            className="bg-accent text-neutral-darkest hover:bg-accent/90 w-full md:w-auto flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Random
          </Button>

          <Button
            onClick={toggleAiContext}
            className="bg-secondary text-black hover:bg-secondary/90 w-full md:w-auto flex items-center gap-2 font-medium"
          >
            <Brain className="h-4 w-4 text-black" />
            AI Context
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerseSelector;