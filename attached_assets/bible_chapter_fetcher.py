import random
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote
import json
from bible_verse_index import BIBLE_VERSE_INDEX, TOTAL_VERSES, get_verse_location, get_verse_range

# Your API key
API_KEY = "AIzaSyDW9Az1U59mSFrN0fVzQ3B1uninUqO3ghY"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def get_bible_chapter_content(book, chapter_verse):
    base_url = "https://www.biblegateway.com/passage/"
    book_encoded = quote(book)
    url = f"{base_url}?search={book_encoded}%20{chapter_verse}&version=GNT"
    print(f"Trying to fetch URL: {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        passage_text_div = soup.find('div', class_='passage-text')
        if passage_text_div:
            text_content = passage_text_div.get_text(separator="").strip()
            text_content = text_content.replace("Read full chapter", "").strip()
            text_content = text_content.replace("in all English translations", "").strip()
            return text_content
        else:
            return "Chapter content not found."
    except requests.exceptions.RequestException as e:
        return f"Error fetching chapter: {e}"
    except Exception as e:
        return f"Error parsing chapter: {e}"

def get_verse_content(book, chapter, verse, persona=None):
    book_display = book.capitalize()
    chapter_verse = f"{chapter}:{verse}"
    chapter_text = get_bible_chapter_content(book_display, chapter_verse)

    headers = {"Content-Type": "application/json"}
    params = {"key": API_KEY}
    
    if persona:
        prompt = f"Speaking as {persona}, in one tight paragraph, explain the context of {book_display} {chapter}:{verse} and add an insight that {persona} might have. No verse quotes. Weave the sayings or writings of {persona} into the paragraph if relevant. Let your voice as {persona} shape the tone and insight."
    else:
        prompt = f"In one tight, gritty paragraph, explain why the verse at {book_display} {chapter}:{verse} matters. No verse quotes, just tell how it fits in the story that’s unfolding. Name the speaker or what’s happening, and why it packs a punch. For Old Testament, spot any Christian typology—like the Ark hinting at Mary—and hit it quick."
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": 250}
    }

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, params=params, data=json.dumps(data))
        response.raise_for_status()
        gemini_response_json = response.json()
        if 'candidates' in gemini_response_json and gemini_response_json['candidates']:
            gemini_context = gemini_response_json['candidates'][0]['content']['parts'][0]['text'].strip()
        else:
            gemini_context = "Could not retrieve context from Gemini."
    except requests.exceptions.RequestException as e:
        gemini_context = f"Error fetching context from Gemini: {e}\nResponse: {e.response.text if e.response else 'No response'}"
    except json.JSONDecodeError:
        gemini_context = "Error decoding Gemini response."
    except Exception as e:
        gemini_context = f"An unexpected error occurred: {e}"

    return f"Selected from {book_display} Chapter {chapter}, Verse {verse} (GNT):\n\n{chapter_text}\n\n**Context (from Gemini 2.0 Flash{f', voiced as {persona}' if persona else ''}):**\n{gemini_context}"

def generate_random_verse(specific_book=None, persona=None):
    if specific_book:
        specific_book = specific_book.lower()
        if specific_book not in BIBLE_VERSE_INDEX:
            return f"Book '{specific_book}' not recognized."
        
        verse_numbers = []
        for chapter, range_info in BIBLE_VERSE_INDEX[specific_book].items():
            verse_numbers.extend(range(range_info["start"], range_info["end"] + 1))
        
        if not verse_numbers:
            return f"No verses found for '{specific_book}'."
        
        random_verse_num = random.choice(verse_numbers)
    else:
        random_verse_num = random.randint(1, TOTAL_VERSES)

    book, chapter, verse = get_verse_location(random_verse_num)
    return get_verse_content(book, chapter, verse, persona), book, chapter, verse

def get_next_verse(book, chapter, verse):
    book = book.lower()
    if book not in BIBLE_VERSE_INDEX:
        return None, None, None
    
    start, end = get_verse_range(book, chapter)
    current_verse_num = start + verse - 1
    
    if current_verse_num >= TOTAL_VERSES:
        return None, None, None  # End of Bible
    
    if current_verse_num + 1 > end:  # Move to next chapter
        next_chapter = chapter + 1
        if next_chapter not in BIBLE_VERSE_INDEX[book]:
            # Move to next book
            books = list(BIBLE_VERSE_INDEX.keys())
            current_book_idx = books.index(book)
            if current_book_idx + 1 >= len(books):
                return None, None, None  # End of Bible
            next_book = books[current_book_idx + 1]
            return next_book, 1, 1
        return book, next_chapter, 1
    
    return book, chapter, verse + 1

if __name__ == "__main__":
    print("Welcome to the Truly Random Bible Verse Generator!")
    print("First, would you like the context to come from a specific persona (e.g., Jesus, Mary, Ernest Hemingway)?")
    persona_choice = input("Enter a persona or press Enter for default context: ").strip()
    persona = persona_choice if persona_choice else None

    print("\nSelect mode: (1) Pick a specific verse (e.g., John 2:14) or (2) Get a random verse")
    mode = input("Enter 1 or 2: ").strip()

    # Initialize variables for both modes
    book, chapter, verse = None, None, None
    specific_book_name = None

    if mode == '1':
        verse_input = input("Enter the book, chapter, and verse (e.g., John 2:14): ").strip()
        try:
            book_part, chapter_verse = verse_input.rsplit(" ", 1)
            chapter, verse = map(int, chapter_verse.split(":"))
            book = book_part.lower()
            if book not in BIBLE_VERSE_INDEX or chapter not in BIBLE_VERSE_INDEX[book]:
                raise ValueError("Invalid book or chapter.")
            start, end = get_verse_range(book, chapter)
            if not (1 <= verse <= (end - start + 1)):
                raise ValueError("Verse out of range.")
        except Exception as e:
            print(f"Error: {e}. Defaulting to random mode.")
            mode = '2'

    if mode == '2':
        print("\nFor random mode: (1) All books or (2) A specific book")
        choice = input("Enter 1 or 2: ").strip()
        if choice == '2':
            specific_book_name = input("Enter the name of the book (e.g., Tobit): ")

    while True:
        if mode == '1':
            verse_content = get_verse_content(book, chapter, verse, persona)
            print("\n--- Selected Bible Verse (GNT) ---")
            print(verse_content)
            
            next_opt = input("\nNext action: (1) Next sequential verse or (2) Exit\nEnter 1 or 2: ").strip()
            if next_opt == '1':
                book, chapter, verse = get_next_verse(book, chapter, verse)
                if book is None:
                    print("You've reached the end of the Bible!")
                    break
            else:
                break
        else:
            random_verse_content, book, chapter, verse = generate_random_verse(specific_book=specific_book_name, persona=persona)
            print("\n--- Truly Random Verse (GNT) ---")
            print(random_verse_content)
            
            next_opt = input("\nNext action: (1) Another random verse or (2) Next sequential verse\nEnter 1 or 2: ").strip()
            if next_opt == '1':
                continue  # Generate another random verse
            elif next_opt == '2':
                book, chapter, verse = get_next_verse(book, chapter, verse)
                if book is None:
                    print("You've reached the end of the Bible!")
                    break
                random_verse_content = get_verse_content(book, chapter, verse, persona)  # Show next verse
                print("\n--- Next Sequential Verse (GNT) ---")
                print(random_verse_content)
            else:
                break  # Exit on any other input

    print("\nMay the verses illuminate your path, perhaps with the unexpected wisdom of a talking badger or the profound silence of a contemplative kumquat.")