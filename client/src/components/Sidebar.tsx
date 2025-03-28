import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: string) => void;
}

// Book categorization for Catholic Bible (73 books)
const bibleBooks = {
  old: {
    "Pentateuch": ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    "Historical Books": [
      "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", 
      "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", 
      "Ezra", "Nehemiah", "Esther"
    ],
    "Wisdom Books": [
      "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"
    ],
    "Major Prophets": [
      "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel"
    ],
    "Minor Prophets": [
      "Hosea", "Joel", "Amos", "Obadiah", "Jonah", 
      "Micah", "Nahum", "Habakkuk", "Zephaniah", 
      "Haggai", "Zechariah", "Malachi"
    ]
  },
  new: {
    "Gospels": ["Matthew", "Mark", "Luke", "John"],
    "History": ["Acts"],
    "Pauline Epistles": [
      "Romans", "1 Corinthians", "2 Corinthians", "Galatians", 
      "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
      "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"
    ],
    "General Epistles": [
      "Hebrews", "James", "1 Peter", "2 Peter", 
      "1 John", "2 John", "3 John", "Jude"
    ],
    "Apocalyptic": ["Revelation"]
  },
  deuterocanonical: {
    "Deuterocanonical Books": [
      "Tobit", "Judith", "Wisdom", "Sirach", "Baruch",
      "1 Maccabees", "2 Maccabees"
    ]
  }
};

const Sidebar = ({ isOpen, onClose, onSelectBook }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<"old" | "new" | "deuterocanonical">("old");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Pentateuch": true, // Default expanded group
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: !expandedGroups[group]
    });
  };

  const handleBookSelect = (book: string) => {
    onSelectBook(book);
    if (window.innerWidth < 768) {
      onClose(); // Close sidebar on mobile when a book is selected
    }
  };

  return (
    <>
      {/* Dark overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={cn(
          "bg-white shadow-md w-64 md:w-72 fixed md:relative left-0 top-0 h-full md:h-auto z-20 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b md:hidden">
          <h2 className="text-lg font-medium text-primary">Bible Books</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-medium text-primary mb-4 hidden md:block">Bible Books</h2>
          
          {/* Tabs for Testament Selection */}
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full mb-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="old">Old</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="deuterocanonical">Deutero.</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Book Groups */}
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
            {Object.entries(bibleBooks[activeTab]).map(([group, books]) => (
              <div key={group} className="book-group">
                <div 
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => toggleGroup(group)}
                >
                  <h3 className="font-medium">{group}</h3>
                  {expandedGroups[group] ? (
                    <ChevronUp className="h-4 w-4 text-neutral-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-600" />
                  )}
                </div>
                
                {expandedGroups[group] && (
                  <ul className="ml-2 space-y-1">
                    {books.map((book) => (
                      <li key={book}>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left py-1 px-2 h-auto font-normal hover:bg-neutral-100"
                          onClick={() => handleBookSelect(book)}
                        >
                          {book}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
