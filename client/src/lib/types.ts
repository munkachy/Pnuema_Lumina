// Export the types from shared schema for frontend use
export interface BibleBook {
  id: string;
  name: string;
  testament: "old" | "new" | "deuterocanonical";
  group: string;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export interface AIContextResponse {
  text: string;
  persona?: string;
}
