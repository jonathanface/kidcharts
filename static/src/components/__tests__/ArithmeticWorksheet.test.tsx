import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArithmeticWorksheet } from "../ArithmeticWorksheet";
import { ArithmeticProblem } from "../../types/Worksheet";

const mockProblems: ArithmeticProblem[] = [
  { a: 3, b: 2, operation: "addition", answer: 5 },
  { a: 7, b: 4, operation: "subtraction", answer: 3 },
  { a: 6, b: 3, operation: "multiplication", answer: 18 },
  { a: 12, b: 4, operation: "division", answer: 3 },
];

describe("ArithmeticWorksheet", () => {
  it("renders all problems", () => {
    render(<ArithmeticWorksheet problems={mockProblems} showAnswers={false} />);
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("4.")).toBeInTheDocument();
  });

  it("shows blanks when showAnswers is false", () => {
    render(<ArithmeticWorksheet problems={mockProblems} showAnswers={false} />);
    const blanks = screen.getAllByText("____");
    expect(blanks).toHaveLength(4);
  });

  it("shows answers when showAnswers is true", () => {
    render(<ArithmeticWorksheet problems={mockProblems} showAnswers={true} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("displays correct operation symbols", () => {
    render(<ArithmeticWorksheet problems={mockProblems} showAnswers={false} />);
    expect(screen.getByText(/3 \+ 2/)).toBeInTheDocument();
    expect(screen.getByText(/7 - 4/)).toBeInTheDocument();
    expect(screen.getByText(/6 × 3/)).toBeInTheDocument();
    expect(screen.getByText(/12 ÷ 4/)).toBeInTheDocument();
  });

  it("renders empty list without crashing", () => {
    render(<ArithmeticWorksheet problems={[]} showAnswers={false} />);
    expect(screen.queryByText("1.")).not.toBeInTheDocument();
  });
});
