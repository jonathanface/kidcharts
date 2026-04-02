import { describe, it, expect } from "vitest";
import {
  generateArithmeticProblems,
  generateSpellingWords,
  operationSymbol,
  GRADE_LABELS,
  DEFAULT_ARITHMETIC_BY_GRADE,
} from "../generators";
import { ArithmeticConfig, GradeLevel } from "../../types/Worksheet";

describe("generateArithmeticProblems", () => {
  it("generates the correct number of problems", () => {
    const config: ArithmeticConfig = {
      operations: ["addition"],
      minNumber: 0,
      maxNumber: 10,
      problemCount: 15,
    };
    const problems = generateArithmeticProblems(config);
    expect(problems).toHaveLength(15);
  });

  it("generates addition problems with correct answers", () => {
    const config: ArithmeticConfig = {
      operations: ["addition"],
      minNumber: 0,
      maxNumber: 10,
      problemCount: 20,
    };
    const problems = generateArithmeticProblems(config);
    problems.forEach((p) => {
      expect(p.operation).toBe("addition");
      expect(p.answer).toBe(p.a + p.b);
    });
  });

  it("generates subtraction problems with non-negative answers", () => {
    const config: ArithmeticConfig = {
      operations: ["subtraction"],
      minNumber: 0,
      maxNumber: 20,
      problemCount: 50,
    };
    const problems = generateArithmeticProblems(config);
    problems.forEach((p) => {
      expect(p.operation).toBe("subtraction");
      expect(p.answer).toBe(p.a - p.b);
      expect(p.answer).toBeGreaterThanOrEqual(0);
    });
  });

  it("generates multiplication problems with correct answers", () => {
    const config: ArithmeticConfig = {
      operations: ["multiplication"],
      minNumber: 1,
      maxNumber: 12,
      problemCount: 20,
    };
    const problems = generateArithmeticProblems(config);
    problems.forEach((p) => {
      expect(p.operation).toBe("multiplication");
      expect(p.answer).toBe(p.a * p.b);
    });
  });

  it("generates division problems with clean integer answers", () => {
    const config: ArithmeticConfig = {
      operations: ["division"],
      minNumber: 1,
      maxNumber: 12,
      problemCount: 30,
    };
    const problems = generateArithmeticProblems(config);
    problems.forEach((p) => {
      expect(p.operation).toBe("division");
      expect(p.a % p.b).toBe(0);
      expect(p.answer).toBe(p.a / p.b);
      expect(Number.isInteger(p.answer)).toBe(true);
    });
  });

  it("respects number range", () => {
    const config: ArithmeticConfig = {
      operations: ["addition"],
      minNumber: 5,
      maxNumber: 10,
      problemCount: 30,
    };
    const problems = generateArithmeticProblems(config);
    problems.forEach((p) => {
      expect(p.a).toBeGreaterThanOrEqual(5);
      expect(p.a).toBeLessThanOrEqual(10);
      expect(p.b).toBeGreaterThanOrEqual(5);
      expect(p.b).toBeLessThanOrEqual(10);
    });
  });

  it("generates mixed operations", () => {
    const config: ArithmeticConfig = {
      operations: ["addition", "subtraction", "multiplication"],
      minNumber: 1,
      maxNumber: 10,
      problemCount: 50,
    };
    const problems = generateArithmeticProblems(config);
    const ops = new Set(problems.map((p) => p.operation));
    expect(ops.size).toBeGreaterThan(1);
  });
});

describe("operationSymbol", () => {
  it("returns correct symbols", () => {
    expect(operationSymbol("addition")).toBe("+");
    expect(operationSymbol("subtraction")).toBe("-");
    expect(operationSymbol("multiplication")).toBe("×");
    expect(operationSymbol("division")).toBe("÷");
  });
});

describe("generateSpellingWords", () => {
  it("generates the correct number of words", () => {
    const words = generateSpellingWords(
      { wordCount: 5, mode: "fill-in-blank" },
      "1"
    );
    expect(words).toHaveLength(5);
  });

  it("generates fill-in-blank with blanked version", () => {
    const words = generateSpellingWords(
      { wordCount: 8, mode: "fill-in-blank" },
      "2"
    );
    words.forEach((w) => {
      expect(w.blanked).toBeDefined();
      expect(w.blanked).toContain("_");
      expect(w.scrambled).toBeUndefined();
    });
  });

  it("generates word-scramble with scrambled version", () => {
    const words = generateSpellingWords(
      { wordCount: 8, mode: "word-scramble" },
      "3"
    );
    words.forEach((w) => {
      expect(w.scrambled).toBeDefined();
      expect(w.scrambled).not.toBe(w.word);
      expect(w.blanked).toBeUndefined();
    });
  });

  it("generates write-word with no scrambled or blanked", () => {
    const words = generateSpellingWords(
      { wordCount: 5, mode: "write-word" },
      "1"
    );
    words.forEach((w) => {
      expect(w.scrambled).toBeUndefined();
      expect(w.blanked).toBeUndefined();
      expect(w.hint).toBeTruthy();
    });
  });

  it("includes hints for all words", () => {
    const grades: GradeLevel[] = ["prek", "k", "1", "2", "3", "4", "5"];
    grades.forEach((grade) => {
      const words = generateSpellingWords({ wordCount: 5, mode: "write-word" }, grade);
      words.forEach((w) => {
        expect(w.word).toBeTruthy();
        expect(w.hint).toBeTruthy();
      });
    });
  });

  it("caps at available words per grade", () => {
    const words = generateSpellingWords(
      { wordCount: 10, mode: "write-word" },
      "prek"
    );
    expect(words.length).toBeLessThanOrEqual(10);
  });
});

describe("GRADE_LABELS", () => {
  it("has labels for all grades", () => {
    expect(GRADE_LABELS["prek"]).toBe("Pre-K");
    expect(GRADE_LABELS["k"]).toBe("Kindergarten");
    expect(GRADE_LABELS["1"]).toBe("1st Grade");
    expect(GRADE_LABELS["5"]).toBe("5th Grade");
  });
});

describe("DEFAULT_ARITHMETIC_BY_GRADE", () => {
  it("has defaults for all grades", () => {
    const grades: GradeLevel[] = ["prek", "k", "1", "2", "3", "4", "5"];
    grades.forEach((grade) => {
      const config = DEFAULT_ARITHMETIC_BY_GRADE[grade];
      expect(config.operations.length).toBeGreaterThan(0);
      expect(config.problemCount).toBeGreaterThan(0);
      expect(config.maxNumber).toBeGreaterThanOrEqual(config.minNumber);
    });
  });

  it("increases difficulty with grade", () => {
    expect(DEFAULT_ARITHMETIC_BY_GRADE["prek"].maxNumber).toBeLessThan(
      DEFAULT_ARITHMETIC_BY_GRADE["5"].maxNumber
    );
    expect(DEFAULT_ARITHMETIC_BY_GRADE["prek"].operations.length).toBeLessThanOrEqual(
      DEFAULT_ARITHMETIC_BY_GRADE["5"].operations.length
    );
  });
});
