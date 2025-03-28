// Created from the attached_assets files

// Total number of verses in the Bible (based on 2 Maccabees 15 ending at 35173)
export const TOTAL_VERSES = 35173;

// Define the Bible verse index structure for TypeScript
export interface VerseRangeInfo {
  start: number;
  end: number;
}

export interface BibleVerseIndex {
  [book: string]: {
    [chapter: number]: VerseRangeInfo;
  };
}

// Partial Bible verse index (for demonstration)
export const BIBLE_VERSE_INDEX: BibleVerseIndex = {
  "genesis": {1: {"start": 1, "end": 31}, 2: {"start": 32, "end": 56}, 3: {"start": 57, "end": 80}},
  "exodus": {1: {"start": 1534, "end": 1555}, 2: {"start": 1556, "end": 1580}, 3: {"start": 1581, "end": 1602}},
  "leviticus": {1: {"start": 2747, "end": 2763}, 2: {"start": 2764, "end": 2779}, 3: {"start": 2780, "end": 2796}},
  "numbers": {1: {"start": 3577, "end": 3630}, 2: {"start": 3631, "end": 3664}, 3: {"start": 3665, "end": 3715}},
  "deuteronomy": {1: {"start": 4865, "end": 4910}, 2: {"start": 4911, "end": 4947}, 3: {"start": 4948, "end": 4976}},
  "joshua": {1: {"start": 5819, "end": 5836}, 2: {"start": 5837, "end": 5860}, 3: {"start": 5861, "end": 5877}},
  "judges": {1: {"start": 6477, "end": 6512}, 2: {"start": 6513, "end": 6535}, 3: {"start": 6536, "end": 6566}},
  "ruth": {1: {"start": 7095, "end": 7116}, 2: {"start": 7117, "end": 7139}, 3: {"start": 7140, "end": 7157}, 4: {"start": 7158, "end": 7179}},
  "1samuel": {1: {"start": 7180, "end": 7207}, 2: {"start": 7208, "end": 7243}, 3: {"start": 7244, "end": 7264}},
  "2samuel": {1: {"start": 7990, "end": 8016}, 2: {"start": 8017, "end": 8048}, 3: {"start": 8049, "end": 8087}},
  "1kings": {1: {"start": 8685, "end": 8737}, 2: {"start": 8738, "end": 8783}, 3: {"start": 8784, "end": 8811}},
  "2kings": {1: {"start": 9491, "end": 9508}, 2: {"start": 9509, "end": 9533}, 3: {"start": 9534, "end": 9560}},
  "1chronicles": {1: {"start": 10210, "end": 10263}, 2: {"start": 10264, "end": 10318}, 3: {"start": 10319, "end": 10342}},
  "2chronicles": {1: {"start": 11152, "end": 11168}, 2: {"start": 11169, "end": 11184}, 3: {"start": 11185, "end": 11201}},
  "ezra": {1: {"start": 11972, "end": 11982}, 2: {"start": 11983, "end": 12052}, 3: {"start": 12053, "end": 12065}},
  "nehemiah": {1: {"start": 12252, "end": 12262}, 2: {"start": 12263, "end": 12282}, 3: {"start": 12283, "end": 12314}},
  "esther": {1: {"start": 12658, "end": 12679}, 2: {"start": 12680, "end": 12702}, 3: {"start": 12703, "end": 12717}},
  "job": {1: {"start": 12825, "end": 12846}, 2: {"start": 12847, "end": 12859}, 3: {"start": 12860, "end": 12885}},
  "psalms": {1: {"start": 14003, "end": 14008}, 2: {"start": 14009, "end": 14020}, 3: {"start": 14021, "end": 14028}},
  "proverbs": {1: {"start": 16464, "end": 16496}, 2: {"start": 16497, "end": 16518}, 3: {"start": 16519, "end": 16553}},
  "ecclesiastes": {1: {"start": 17379, "end": 17396}, 2: {"start": 17397, "end": 17422}, 3: {"start": 17423, "end": 17444}},
  "songofsolomon": {1: {"start": 17601, "end": 17617}, 2: {"start": 17618, "end": 17634}, 3: {"start": 17635, "end": 17645}},
  "isaiah": {1: {"start": 17718, "end": 17748}, 2: {"start": 17749, "end": 17770}, 3: {"start": 17771, "end": 17796}},
  "jeremiah": {1: {"start": 19010, "end": 19028}, 2: {"start": 19029, "end": 19065}, 3: {"start": 19066, "end": 19090}},
  "lamentations": {1: {"start": 20374, "end": 20395}, 2: {"start": 20396, "end": 20417}, 3: {"start": 20418, "end": 20483}},
  "ezekiel": {1: {"start": 20528, "end": 20555}, 2: {"start": 20556, "end": 20565}, 3: {"start": 20566, "end": 20592}},
  "daniel": {1: {"start": 21801, "end": 21821}, 2: {"start": 21822, "end": 21870}, 3: {"start": 21871, "end": 21900}},
  "hosea": {1: {"start": 22158, "end": 22168}, 2: {"start": 22169, "end": 22191}, 3: {"start": 22192, "end": 22196}},
  "joel": {1: {"start": 22313, "end": 22332}, 2: {"start": 22333, "end": 22364}, 3: {"start": 22365, "end": 22385}},
  "amos": {1: {"start": 22386, "end": 22400}, 2: {"start": 22401, "end": 22416}, 3: {"start": 22417, "end": 22431}},
  "obadiah": {1: {"start": 22502, "end": 22522}},
  "jonah": {1: {"start": 22523, "end": 22539}, 2: {"start": 22540, "end": 22549}, 3: {"start": 22550, "end": 22559}},
  "micah": {1: {"start": 22571, "end": 22586}, 2: {"start": 22587, "end": 22599}, 3: {"start": 22600, "end": 22611}},
  "nahum": {1: {"start": 22647, "end": 22661}, 2: {"start": 22662, "end": 22674}, 3: {"start": 22675, "end": 22693}},
  "habakkuk": {1: {"start": 22694, "end": 22710}, 2: {"start": 22711, "end": 22730}, 3: {"start": 22731, "end": 22749}},
  "zephaniah": {1: {"start": 22750, "end": 22767}, 2: {"start": 22768, "end": 22782}, 3: {"start": 22783, "end": 22802}},
  "haggai": {1: {"start": 22803, "end": 22817}, 2: {"start": 22818, "end": 22840}},
  "zechariah": {1: {"start": 22841, "end": 22861}, 2: {"start": 22862, "end": 22874}, 3: {"start": 22875, "end": 22884}},
  "malachi": {1: {"start": 22998, "end": 23011}, 2: {"start": 23012, "end": 23028}, 3: {"start": 23029, "end": 23046}},
  "matthew": {1: {"start": 23069, "end": 23093}, 2: {"start": 23094, "end": 23116}, 3: {"start": 23117, "end": 23133}},
  "mark": {1: {"start": 23884, "end": 23928}, 2: {"start": 23929, "end": 23956}, 3: {"start": 23957, "end": 23991}},
  "luke": {1: {"start": 24394, "end": 24473}, 2: {"start": 24474, "end": 24525}, 3: {"start": 24526, "end": 24563}},
  "john": {1: {"start": 25931, "end": 25981}, 2: {"start": 25982, "end": 26006}, 3: {"start": 26007, "end": 26042}},
  "acts": {1: {"start": 26917, "end": 26942}, 2: {"start": 26943, "end": 26989}, 3: {"start": 26990, "end": 27015}},
  "romans": {1: {"start": 27995, "end": 28026}, 2: {"start": 28027, "end": 28055}, 3: {"start": 28056, "end": 28086}},
  "1corinthians": {1: {"start": 28389, "end": 28419}, 2: {"start": 28420, "end": 28435}, 3: {"start": 28436, "end": 28458}},
  "2corinthians": {1: {"start": 28834, "end": 28857}, 2: {"start": 28858, "end": 28874}, 3: {"start": 28875, "end": 28892}},
  "galatians": {1: {"start": 29024, "end": 29047}, 2: {"start": 29048, "end": 29068}, 3: {"start": 29069, "end": 29097}},
  "ephesians": {1: {"start": 29147, "end": 29169}, 2: {"start": 29170, "end": 29191}, 3: {"start": 29192, "end": 29212}},
  "philippians": {1: {"start": 29255, "end": 29284}, 2: {"start": 29285, "end": 29314}, 3: {"start": 29315, "end": 29335}},
  "colossians": {1: {"start": 29372, "end": 29400}, 2: {"start": 29401, "end": 29423}, 3: {"start": 29424, "end": 29448}},
  "1thessalonians": {1: {"start": 29467, "end": 29476}, 2: {"start": 29477, "end": 29496}, 3: {"start": 29497, "end": 29509}},
  "2thessalonians": {1: {"start": 29543, "end": 29554}, 2: {"start": 29555, "end": 29571}, 3: {"start": 29572, "end": 29589}},
  "1timothy": {1: {"start": 29590, "end": 29609}, 2: {"start": 29610, "end": 29624}, 3: {"start": 29625, "end": 29640}},
  "2timothy": {1: {"start": 29674, "end": 29691}, 2: {"start": 29692, "end": 29717}, 3: {"start": 29718, "end": 29734}},
  "titus": {1: {"start": 29749, "end": 29764}, 2: {"start": 29765, "end": 29779}, 3: {"start": 29780, "end": 29794}},
  "philemon": {1: {"start": 29795, "end": 29819}},
  "hebrews": {1: {"start": 29820, "end": 29833}, 2: {"start": 29834, "end": 29851}, 3: {"start": 29852, "end": 29870}},
  "james": {1: {"start": 30078, "end": 30104}, 2: {"start": 30105, "end": 30130}, 3: {"start": 30131, "end": 30148}},
  "1peter": {1: {"start": 30184, "end": 30208}, 2: {"start": 30209, "end": 30233}, 3: {"start": 30234, "end": 30255}},
  "2peter": {1: {"start": 30297, "end": 30317}, 2: {"start": 30318, "end": 30339}, 3: {"start": 30340, "end": 30357}},
  "1john": {1: {"start": 30358, "end": 30367}, 2: {"start": 30368, "end": 30396}, 3: {"start": 30397, "end": 30420}},
  "2john": {1: {"start": 30442, "end": 30454}},
  "3john": {1: {"start": 30455, "end": 30469}},
  "jude": {1: {"start": 30470, "end": 30494}},
  "revelation": {1: {"start": 30495, "end": 30514}, 2: {"start": 30515, "end": 30543}, 3: {"start": 30544, "end": 30565}}
};

// Bible verse counts for each book/chapter
export const bible_verse_counts: { [book: string]: { [chapter: number]: number } } = {
  "genesis": {1: 31, 2: 25, 3: 24},
  "exodus": {1: 22, 2: 25, 3: 22},
  "leviticus": {1: 17, 2: 16, 3: 17},
  "numbers": {1: 54, 2: 34, 3: 51},
  "deuteronomy": {1: 46, 2: 37, 3: 29},
  "joshua": {1: 18, 2: 24, 3: 17},
  "judges": {1: 36, 2: 23, 3: 31},
  "ruth": {1: 22, 2: 23, 3: 18, 4: 22},
  "1samuel": {1: 28, 2: 36, 3: 21},
  "2samuel": {1: 27, 2: 32, 3: 39},
  "1kings": {1: 53, 2: 46, 3: 28},
  "2kings": {1: 18, 2: 25, 3: 27},
  "1chronicles": {1: 54, 2: 55, 3: 24},
  "2chronicles": {1: 17, 2: 16, 3: 17},
  "ezra": {1: 11, 2: 70, 3: 13},
  "nehemiah": {1: 11, 2: 20, 3: 32},
  "esther": {1: 22, 2: 23, 3: 15},
  "job": {1: 22, 2: 13, 3: 26},
  "psalms": {1: 6, 2: 12, 3: 8},
  "proverbs": {1: 33, 2: 22, 3: 35},
  "ecclesiastes": {1: 18, 2: 26, 3: 22},
  "songofsolomon": {1: 17, 2: 17, 3: 11},
  "isaiah": {1: 31, 2: 22, 3: 26},
  "jeremiah": {1: 19, 2: 37, 3: 25},
  "lamentations": {1: 22, 2: 22, 3: 66},
  "ezekiel": {1: 28, 2: 10, 3: 27},
  "daniel": {1: 21, 2: 49, 3: 30},
  "hosea": {1: 11, 2: 23, 3: 5},
  "joel": {1: 20, 2: 32, 3: 21},
  "amos": {1: 15, 2: 16, 3: 15},
  "obadiah": {1: 21},
  "jonah": {1: 17, 2: 10, 3: 10},
  "micah": {1: 16, 2: 13, 3: 12},
  "nahum": {1: 15, 2: 13, 3: 19},
  "habakkuk": {1: 17, 2: 20, 3: 19},
  "zephaniah": {1: 18, 2: 15, 3: 20},
  "haggai": {1: 15, 2: 23},
  "zechariah": {1: 21, 2: 13, 3: 10},
  "malachi": {1: 14, 2: 17, 3: 18},
  "matthew": {1: 25, 2: 23, 3: 17},
  "mark": {1: 45, 2: 28, 3: 35},
  "luke": {1: 80, 2: 52, 3: 38},
  "john": {1: 51, 2: 25, 3: 36},
  "acts": {1: 26, 2: 47, 3: 26},
  "romans": {1: 32, 2: 29, 3: 31},
  "1corinthians": {1: 31, 2: 16, 3: 23},
  "2corinthians": {1: 24, 2: 17, 3: 18},
  "galatians": {1: 24, 2: 21, 3: 29},
  "ephesians": {1: 23, 2: 22, 3: 21},
  "philippians": {1: 30, 2: 30, 3: 21},
  "colossians": {1: 29, 2: 23, 3: 25},
  "1thessalonians": {1: 10, 2: 20, 3: 13},
  "2thessalonians": {1: 12, 2: 17, 3: 18},
  "1timothy": {1: 20, 2: 15, 3: 16},
  "2timothy": {1: 18, 2: 26, 3: 17},
  "titus": {1: 16, 2: 15, 3: 15},
  "philemon": {1: 25},
  "hebrews": {1: 14, 2: 18, 3: 19},
  "james": {1: 27, 2: 26, 3: 18},
  "1peter": {1: 25, 2: 25, 3: 22},
  "2peter": {1: 21, 2: 22, 3: 18},
  "1john": {1: 10, 2: 29, 3: 24},
  "2john": {1: 13},
  "3john": {1: 15},
  "jude": {1: 25},
  "revelation": {1: 20, 2: 29, 3: 22},
  // Deuterocanonical Books
  "tobit": {1: 22, 2: 14, 3: 17},
  "judith": {1: 16, 2: 28, 3: 10},
  "wisdom": {1: 16, 2: 24, 3: 19},
  "sirach": {1: 30, 2: 18, 3: 31},
  "baruch": {1: 15, 2: 35, 3: 37},
  "1maccabees": {1: 64, 2: 70, 3: 60},
  "2maccabees": {1: 36, 2: 32, 3: 40}
};

// Book name standardization mapping
export const book_name_mapping: { [displayName: string]: string } = {
  "Genesis": "genesis", "Exodus": "exodus", "Leviticus": "leviticus", "Numbers": "numbers", "Deuteronomy": "deuteronomy",
  "Joshua": "joshua", "Judges": "judges", "Ruth": "ruth", "1 Samuel": "1samuel", "2 Samuel": "2samuel",
  "1 Kings": "1kings", "2 Kings": "2kings", "1 Chronicles": "1chronicles", "2 Chronicles": "2chronicles",
  "Ezra": "ezra", "Nehemiah": "nehemiah", "Esther": "esther", "Job": "job", "Psalms": "psalms",
  "Proverbs": "proverbs", "Ecclesiastes": "ecclesiastes", "Song of Solomon": "songofsolomon", "Isaiah": "isaiah",
  "Jeremiah": "jeremiah", "Lamentations": "lamentations", "Ezekiel": "ezekiel", "Daniel": "daniel",
  "Hosea": "hosea", "Joel": "joel", "Amos": "amos", "Obadiah": "obadiah", "Jonah": "jonah",
  "Micah": "micah", "Nahum": "nahum", "Habakkuk": "habakkuk", "Zephaniah": "zephaniah", "Haggai": "haggai",
  "Zechariah": "zechariah", "Malachi": "malachi", "Matthew": "matthew", "Mark": "mark", "Luke": "luke",
  "John": "john", "Acts": "acts", "Romans": "romans", "1 Corinthians": "1corinthians", "2 Corinthians": "2corinthians",
  "Galatians": "galatians", "Ephesians": "ephesians", "Philippians": "philippians", "Colossians": "colossians",
  "1 Thessalonians": "1thessalonians", "2 Thessalonians": "2thessalonians", "1 Timothy": "1timothy",
  "2 Timothy": "2timothy", "Titus": "titus", "Philemon": "philemon", "Hebrews": "hebrews", "James": "james",
  "1 Peter": "1peter", "2 Peter": "2peter", "1 John": "1john", "2 John": "2john", "3 John": "3john",
  "Jude": "jude", "Revelation": "revelation",
  // Deuterocanonical Books
  "Tobit": "tobit", "Judith": "judith", "Wisdom": "wisdom", "Sirach": "sirach", "Baruch": "baruch",
  "1 Maccabees": "1maccabees", "2 Maccabees": "2maccabees"
};

/**
 * Given a verse number, return the book, chapter, and verse.
 */
export function get_verse_location(verse_number: number): [string, number, number] {
  // Default to Genesis 1:1 if the verse number is out of range
  if (verse_number < 1 || verse_number > TOTAL_VERSES) {
    return ["genesis", 1, 1];
  }
  
  // Iterate through books and chapters to find the verse location
  for (const book in BIBLE_VERSE_INDEX) {
    for (const chapter in BIBLE_VERSE_INDEX[book]) {
      const range = BIBLE_VERSE_INDEX[book][parseInt(chapter)];
      if (verse_number >= range.start && verse_number <= range.end) {
        const verse_in_chapter = verse_number - range.start + 1;
        return [book, parseInt(chapter), verse_in_chapter];
      }
    }
  }
  
  // Fallback
  return ["genesis", 1, 1];
}

/**
 * Given a book and chapter, return the start and end verse numbers.
 */
export function get_verse_range(book: string, chapter: number): [number, number] {
  if (book in BIBLE_VERSE_INDEX && chapter in BIBLE_VERSE_INDEX[book]) {
    const range = BIBLE_VERSE_INDEX[book][chapter];
    return [range.start, range.end];
  }
  return [0, 0]; // Invalid book or chapter
}