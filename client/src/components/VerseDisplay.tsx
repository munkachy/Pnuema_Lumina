import { useState } from "react";
import { ChevronLeft, ChevronRight, Copy, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BibleVerse } from "@/lib/types";

interface VerseDisplayProps {
  verse: BibleVerse;
  onNavigate: (direction: "next" | "previous") => void;
}

// Function to clean verse text by removing the verse number
const cleanVerseText = (text: string): string => {
  if (!text) return '';
  
  // First try to match verse numbers within HTML tags like "<p>12..."
  let cleaned = text.replace(/^<p>\s*\d+/, '<p>');
  
  // Try to match patterns like "12In the beginning" (no space after number)
  cleaned = cleaned.replace(/^<p>(\d+)([A-Za-z])/, '<p>$2');
  
  // If that didn't work (no change), try without the HTML tag
  if (cleaned === text) {
    cleaned = text.replace(/^\s*\d+\s*/, '');
  }
  
  // Try matching patterns like "12In the..." (no space after number)
  if (cleaned === text) {
    cleaned = text.replace(/^(\d+)([A-Za-z])/, '$2');
  }
  
  // General cleaning of any remnant digit at the beginning
  cleaned = cleaned.replace(/^(\d+)/, '');
  
  return cleaned;
};

const VerseDisplay = ({ verse, onNavigate }: VerseDisplayProps) => {
  const { toast } = useToast();
  const [isComparing, setIsComparing] = useState(false);
  const [otherTranslations, setOtherTranslations] = useState<BibleVerse[]>([]);

  const copyToClipboard = () => {
    const textToCopy = `${verse.book} ${verse.chapter}:${verse.verse} (${verse.translation})\n${verse.text}`;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Verse copied to clipboard successfully.",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  const shareVerse = async () => {
    const shareText = `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: shareText,
        });
      } catch (error) {
        toast({
          title: "Error sharing",
          description: "Failed to share this verse.",
          variant: "destructive",
        });
      }
    } else {
      copyToClipboard();
    }
  };

  const toggleCompareTranslations = async () => {
    if (!isComparing) {
      try {
        // Get the other translations of this verse
        const translations = ["DRA", "NRSVCE", "NABRE", "GNT"].filter(
          t => t !== verse.translation
        );
        
        const promises = translations.map(translation => 
          fetch(`/api/verse/${translation}/${verse.book}/${verse.chapter}/${verse.verse}`)
            .then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        setOtherTranslations(results);
        setIsComparing(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch other translations.",
          variant: "destructive",
        });
      }
    } else {
      setIsComparing(false);
    }
  };

  // Format the book name nicely
  const formatBookName = (book: string) => {
    return book
      .replace(/([0-9])([A-Za-z])/, "$1 $2") // Add space after numbers
      .replace(/([a-z])([A-Z])/, "$1 $2") // Add space between words
      .replace(/^./, match => match.toUpperCase()); // Capitalize first letter
  };

  const displayName = formatBookName(verse.book);

  return (
    <Card className="bg-white rounded-lg shadow-sm mb-6">
      <CardHeader className="border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">
            {displayName} {verse.chapter}:{verse.verse}
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-600 hover:text-primary"
              title="Previous Verse"
              onClick={() => onNavigate("previous")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-600 hover:text-primary"
              title="Next Verse"
              onClick={() => onNavigate("next")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-600 hover:text-primary"
              title="Copy Verse"
              onClick={copyToClipboard}
            >
              <Copy className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-600 hover:text-primary"
              title="Share Verse"
              onClick={shareVerse}
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="verse-content font-serif text-lg leading-relaxed" 
             dangerouslySetInnerHTML={{ __html: cleanVerseText(verse.text) }} />
        
        {isComparing && otherTranslations.length > 0 && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h3 className="font-medium text-lg">Other Translations</h3>
            
            {otherTranslations.map((v, idx) => (
              <div key={idx} className="mt-4">
                <h4 className="font-medium text-neutral-600 mb-2">{v.translation}</h4>
                <div className="font-serif text-lg leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: cleanVerseText(v.text) }} />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-neutral-50 p-4 text-sm text-neutral-600 flex justify-between items-center">
        <span>{verse.translation}</span>
        <Button
          variant="link"
          className="text-primary hover:text-primary-dark p-0 h-auto"
          onClick={toggleCompareTranslations}
        >
          {isComparing ? "Hide Translations" : "Compare Translations"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerseDisplay;
