import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorksheetPreview } from "../WorksheetPreview";
import { WorksheetConfig } from "../../types/Worksheet";
import { DEFAULT_ARITHMETIC_BY_GRADE } from "../../utils/generators";

describe("WorksheetPreview", () => {
  it("renders worksheet title", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "My Math Test",
      sections: [],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    expect(screen.getByText("My Math Test")).toBeInTheDocument();
  });

  it("renders grade level", () => {
    const config: WorksheetConfig = {
      grade: "3",
      title: "Test",
      sections: [],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    expect(screen.getByText("3rd Grade")).toBeInTheDocument();
  });

  it("renders name and date lines", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Test",
      sections: [],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Date:/)).toBeInTheDocument();
  });

  it("renders empty message when no sections", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Test",
      sections: [],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    expect(screen.getByText(/Add sections/)).toBeInTheDocument();
  });

  it("renders arithmetic section", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Math",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE["1"], problemCount: 5 },
        },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    // 1. appears in both worksheet and answer key
    expect(screen.getAllByText("1.").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("5.").length).toBeGreaterThanOrEqual(1);
  });

  it("renders multiple sections", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Mixed",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { operations: ["addition"], minNumber: 0, maxNumber: 5, problemCount: 3 },
        },
        {
          id: "t1",
          type: "tracing",
          tracing: { content: "numbers", repetitions: 2 },
        },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    // Arithmetic problems exist
    expect(screen.getAllByText("1.").length).toBeGreaterThanOrEqual(1);
    // Tracing numbers exist
    expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(1);
  });

  it("renders answer key when arithmetic sections exist", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Math",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { operations: ["addition"], minNumber: 1, maxNumber: 5, problemCount: 3 },
        },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    expect(screen.getByText("Answer Key")).toBeInTheDocument();
  });

  it("does not render answer key for tracing-only worksheets", () => {
    const config: WorksheetConfig = {
      grade: "k",
      title: "Tracing",
      sections: [
        { id: "t1", type: "tracing", tracing: { content: "uppercase", repetitions: 3 } },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} />);
    expect(screen.queryByText("Answer Key")).not.toBeInTheDocument();
  });

  it("regenerates problems when regenerateKey changes", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Math",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { operations: ["addition"], minNumber: 0, maxNumber: 100, problemCount: 1 },
        },
      ],
    };

    const { rerender } = render(
      <WorksheetPreview config={config} regenerateKey={0} />
    );

    // Capture the first problem text
    const firstRender = document.querySelector(".problem-text")?.textContent;

    // Rerender with new key many times to find a difference (random, so try a few)
    let changed = false;
    for (let i = 1; i <= 10; i++) {
      rerender(<WorksheetPreview config={config} regenerateKey={i} />);
      const newRender = document.querySelector(".problem-text")?.textContent;
      if (newRender !== firstRender) {
        changed = true;
        break;
      }
    }
    // With range 0-100 and 10 tries, it should almost certainly change
    expect(changed).toBe(true);
  });
});
