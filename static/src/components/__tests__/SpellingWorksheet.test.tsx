import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpellingWorksheet } from "../SpellingWorksheet";
import { SpellingWord, SpellingConfig } from "../../types/Worksheet";

const mockWords: SpellingWord[] = [
  { word: "happy", hint: "Feeling glad", blanked: "h_pp_", scrambled: "pyhap" },
  { word: "house", hint: "A place to live", blanked: "ho_s_", scrambled: "suhoe" },
];

describe("SpellingWorksheet", () => {
  it("renders fill-in-blank mode", () => {
    const config: SpellingConfig = { wordCount: 2, mode: "fill-in-blank" };
    render(
      <SpellingWorksheet words={mockWords} config={config} showAnswers={false} />
    );
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("2.")).toBeInTheDocument();
    expect(screen.getByText("h_pp_")).toBeInTheDocument();
    expect(screen.getByText(/Feeling glad/)).toBeInTheDocument();
  });

  it("renders word-scramble mode", () => {
    const config: SpellingConfig = { wordCount: 2, mode: "word-scramble" };
    render(
      <SpellingWorksheet words={mockWords} config={config} showAnswers={false} />
    );
    expect(screen.getByText("pyhap")).toBeInTheDocument();
    expect(screen.getByText(/Feeling glad/)).toBeInTheDocument();
  });

  it("renders write-word mode with hints", () => {
    const config: SpellingConfig = { wordCount: 2, mode: "write-word" };
    render(
      <SpellingWorksheet words={mockWords} config={config} showAnswers={false} />
    );
    expect(screen.getByText(/Feeling glad/)).toBeInTheDocument();
    expect(screen.getByText(/A place to live/)).toBeInTheDocument();
  });

  it("shows answers when showAnswers is true", () => {
    const config: SpellingConfig = { wordCount: 2, mode: "word-scramble" };
    render(
      <SpellingWorksheet words={mockWords} config={config} showAnswers={true} />
    );
    expect(screen.getByText("happy")).toBeInTheDocument();
    expect(screen.getByText("house")).toBeInTheDocument();
  });

  it("hides answers when showAnswers is false in scramble mode", () => {
    const config: SpellingConfig = { wordCount: 2, mode: "word-scramble" };
    render(
      <SpellingWorksheet words={mockWords} config={config} showAnswers={false} />
    );
    expect(screen.queryByText("happy")).not.toBeInTheDocument();
  });

  it("renders empty list without crashing", () => {
    const config: SpellingConfig = { wordCount: 0, mode: "fill-in-blank" };
    render(
      <SpellingWorksheet words={[]} config={config} showAnswers={false} />
    );
    expect(screen.queryByText("1.")).not.toBeInTheDocument();
  });
});
