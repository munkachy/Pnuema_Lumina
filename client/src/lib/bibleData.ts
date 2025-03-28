import { BibleBook } from "@/lib/types";
import { apiRequest } from "./queryClient";

// Function to get all Bible books from the server API
export const getBibleBooks = async (translation: string): Promise<BibleBook[]> => {
  try {
    const response = await apiRequest<BibleBook[]>({
      url: `/api/books/${translation}`,
      method: "GET"
    });
    return response || [];
  } catch (error) {
    console.error("Error fetching Bible books:", error);
    return [];
  }
};

// Function to get all chapters for a book from the server API
export const getChapters = async (bookId: string): Promise<number[]> => {
  try {
    const response = await apiRequest<number[]>({
      url: `/api/chapters/${bookId}`,
      method: "GET"
    });
    return response || [];
  } catch (error) {
    console.error(`Error fetching chapters for book ${bookId}:`, error);
    return [];
  }
};

// Function to get all verses for a chapter from the server API
export const getVerses = async (bookId: string, chapter: number): Promise<number[]> => {
  try {
    const response = await apiRequest<number[]>({
      url: `/api/verses/${bookId}/${chapter}`,
      method: "GET"
    });
    return response || [];
  } catch (error) {
    console.error(`Error fetching verses for ${bookId} ${chapter}:`, error);
    return [];
  }
};