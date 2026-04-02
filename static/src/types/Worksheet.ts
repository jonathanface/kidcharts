export type GradeLevel = "prek" | "k" | "1" | "2" | "3" | "4" | "5";

export type WorksheetType = "arithmetic" | "tracing" | "spelling";

export type ArithmeticOperation = "addition" | "subtraction" | "multiplication" | "division";

export interface ArithmeticConfig {
  operations: ArithmeticOperation[];
  minNumber: number;
  maxNumber: number;
  problemCount: number;
}

export interface TracingConfig {
  content: "uppercase" | "lowercase" | "numbers" | "shapes";
  repetitions: number;
}

export interface SpellingConfig {
  wordCount: number;
  mode: "fill-in-blank" | "word-scramble" | "write-word";
}

export interface WorksheetSection {
  id: string;
  type: WorksheetType;
  arithmetic?: ArithmeticConfig;
  tracing?: TracingConfig;
  spelling?: SpellingConfig;
}

export interface WorksheetConfig {
  grade: GradeLevel;
  title: string;
  sections: WorksheetSection[];
}

export interface ArithmeticProblem {
  a: number;
  b: number;
  operation: ArithmeticOperation;
  answer: number;
}

export interface SpellingWord {
  word: string;
  hint: string;
  scrambled?: string;
  blanked?: string;
}
