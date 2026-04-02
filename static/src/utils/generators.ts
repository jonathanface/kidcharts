import {
  ArithmeticConfig,
  ArithmeticOperation,
  ArithmeticProblem,
  GradeLevel,
  SpellingConfig,
  SpellingWord,
} from "../types/Worksheet";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function computeAnswer(a: number, b: number, op: ArithmeticOperation): number {
  switch (op) {
    case "addition": return a + b;
    case "subtraction": return a - b;
    case "multiplication": return a * b;
    case "division": return a; // a is the product, b is divisor, answer is quotient
  }
}

function operationSymbol(op: ArithmeticOperation): string {
  switch (op) {
    case "addition": return "+";
    case "subtraction": return "-";
    case "multiplication": return "×";
    case "division": return "÷";
  }
}

export function generateArithmeticProblems(config: ArithmeticConfig): ArithmeticProblem[] {
  const problems: ArithmeticProblem[] = [];

  for (let i = 0; i < config.problemCount; i++) {
    const op = config.operations[randInt(0, config.operations.length - 1)];
    let a: number, b: number, answer: number;

    if (op === "subtraction") {
      // Ensure no negative answers
      a = randInt(config.minNumber, config.maxNumber);
      b = randInt(config.minNumber, Math.min(a, config.maxNumber));
      answer = a - b;
    } else if (op === "division") {
      // Ensure clean division
      b = randInt(Math.max(1, config.minNumber), config.maxNumber);
      const quotient = randInt(1, Math.floor(config.maxNumber / Math.max(b, 1)));
      a = b * quotient;
      answer = quotient;
    } else {
      a = randInt(config.minNumber, config.maxNumber);
      b = randInt(config.minNumber, config.maxNumber);
      answer = computeAnswer(a, b, op);
    }

    problems.push({ a, b, operation: op, answer });
  }

  return problems;
}

export { operationSymbol };

const SPELLING_WORDS: Record<GradeLevel, { word: string; hint: string }[]> = {
  prek: [
    { word: "cat", hint: "A furry pet that says meow" },
    { word: "dog", hint: "A pet that barks" },
    { word: "sun", hint: "It shines in the sky" },
    { word: "hat", hint: "You wear it on your head" },
    { word: "cup", hint: "You drink from it" },
    { word: "red", hint: "The color of a fire truck" },
    { word: "big", hint: "Not small" },
    { word: "run", hint: "Moving fast on your feet" },
    { word: "mom", hint: "Your mother" },
    { word: "dad", hint: "Your father" },
  ],
  k: [
    { word: "fish", hint: "It swims in water" },
    { word: "tree", hint: "It grows leaves" },
    { word: "book", hint: "You read this" },
    { word: "ball", hint: "Round toy you throw" },
    { word: "star", hint: "Twinkles in the night sky" },
    { word: "cake", hint: "A birthday treat" },
    { word: "bird", hint: "It has wings and flies" },
    { word: "frog", hint: "A green animal that hops" },
    { word: "rain", hint: "Water falling from clouds" },
    { word: "hand", hint: "It has five fingers" },
  ],
  "1": [
    { word: "happy", hint: "Feeling glad" },
    { word: "house", hint: "A place to live" },
    { word: "water", hint: "You drink this" },
    { word: "apple", hint: "A round red fruit" },
    { word: "green", hint: "The color of grass" },
    { word: "smile", hint: "A happy face" },
    { word: "sleep", hint: "What you do at night" },
    { word: "light", hint: "It helps you see" },
    { word: "cloud", hint: "White and fluffy in the sky" },
    { word: "plant", hint: "It grows from a seed" },
  ],
  "2": [
    { word: "friend", hint: "Someone you like to play with" },
    { word: "garden", hint: "Where flowers grow" },
    { word: "basket", hint: "You carry things in it" },
    { word: "kitten", hint: "A baby cat" },
    { word: "rabbit", hint: "An animal with long ears" },
    { word: "winter", hint: "The cold season" },
    { word: "summer", hint: "The hot season" },
    { word: "purple", hint: "A color mixed from red and blue" },
    { word: "butter", hint: "Spread on bread" },
    { word: "castle", hint: "Where a king lives" },
  ],
  "3": [
    { word: "because", hint: "Gives a reason why" },
    { word: "example", hint: "A sample of something" },
    { word: "believe", hint: "To think something is true" },
    { word: "picture", hint: "A photo or drawing" },
    { word: "country", hint: "A nation like the USA" },
    { word: "kitchen", hint: "Room where you cook" },
    { word: "weather", hint: "Rain, sun, or snow" },
    { word: "thought", hint: "An idea in your head" },
    { word: "special", hint: "Not ordinary" },
    { word: "another", hint: "One more" },
  ],
  "4": [
    { word: "calendar", hint: "Shows days and months" },
    { word: "question", hint: "Something you ask" },
    { word: "straight", hint: "Not curved or bent" },
    { word: "surprise", hint: "Something unexpected" },
    { word: "language", hint: "English is one of these" },
    { word: "mountain", hint: "Very tall land formation" },
    { word: "dinosaur", hint: "Extinct reptile" },
    { word: "favorite", hint: "The one you like best" },
    { word: "sentence", hint: "A group of words" },
    { word: "together", hint: "With each other" },
  ],
  "5": [
    { word: "character", hint: "A person in a story" },
    { word: "education", hint: "Learning at school" },
    { word: "pollution", hint: "Harmful stuff in the air or water" },
    { word: "continent", hint: "Large land mass like Africa" },
    { word: "invention", hint: "Something new that was created" },
    { word: "knowledge", hint: "What you know" },
    { word: "paragraph", hint: "A section of writing" },
    { word: "important", hint: "Matters a lot" },
    { word: "dangerous", hint: "Could be harmful" },
    { word: "necessary", hint: "You must have it" },
  ],
};

function scrambleWord(word: string): string {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const result = chars.join("");
  return result === word ? scrambleWord(word) : result;
}

function blankWord(word: string): string {
  const chars = word.split("");
  const blankCount = Math.max(1, Math.floor(chars.length * 0.4));
  const indices = new Set<number>();
  while (indices.size < blankCount) {
    indices.add(randInt(0, chars.length - 1));
  }
  return chars.map((c, i) => (indices.has(i) ? "_" : c)).join("");
}

export function generateSpellingWords(
  config: SpellingConfig,
  grade: GradeLevel
): SpellingWord[] {
  const pool = [...SPELLING_WORDS[grade]];
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, config.wordCount).map(({ word, hint }) => ({
    word,
    hint,
    scrambled: config.mode === "word-scramble" ? scrambleWord(word) : undefined,
    blanked: config.mode === "fill-in-blank" ? blankWord(word) : undefined,
  }));
}

export const GRADE_LABELS: Record<GradeLevel, string> = {
  prek: "Pre-K",
  k: "Kindergarten",
  "1": "1st Grade",
  "2": "2nd Grade",
  "3": "3rd Grade",
  "4": "4th Grade",
  "5": "5th Grade",
};

export const DEFAULT_ARITHMETIC_BY_GRADE: Record<GradeLevel, ArithmeticConfig> = {
  prek: { operations: ["addition"], minNumber: 0, maxNumber: 5, problemCount: 10 },
  k: { operations: ["addition", "subtraction"], minNumber: 0, maxNumber: 10, problemCount: 12 },
  "1": { operations: ["addition", "subtraction"], minNumber: 0, maxNumber: 20, problemCount: 15 },
  "2": { operations: ["addition", "subtraction"], minNumber: 0, maxNumber: 100, problemCount: 15 },
  "3": { operations: ["addition", "subtraction", "multiplication"], minNumber: 0, maxNumber: 12, problemCount: 20 },
  "4": { operations: ["addition", "subtraction", "multiplication", "division"], minNumber: 1, maxNumber: 12, problemCount: 20 },
  "5": { operations: ["addition", "subtraction", "multiplication", "division"], minNumber: 1, maxNumber: 20, problemCount: 24 },
};
