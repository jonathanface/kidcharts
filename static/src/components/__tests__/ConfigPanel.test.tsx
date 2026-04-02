import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfigPanel } from "../ConfigPanel";
import { WorksheetConfig } from "../../types/Worksheet";
import { DEFAULT_ARITHMETIC_BY_GRADE } from "../../utils/generators";

const defaultConfig: WorksheetConfig = {
  grade: "1",
  title: "Test Worksheet",
  sections: [
    {
      id: "test-1",
      type: "arithmetic",
      arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE["1"] },
    },
  ],
};

describe("ConfigPanel", () => {
  it("renders title input", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue("Test Worksheet")).toBeInTheDocument();
  });

  it("renders grade selector with all grades", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Pre-K")).toBeInTheDocument();
    expect(screen.getByText("5th Grade")).toBeInTheDocument();
  });

  it("renders add section buttons", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("+ Arithmetic")).toBeInTheDocument();
    expect(screen.getByText("+ Tracing")).toBeInTheDocument();
    expect(screen.getByText("+ Spelling")).toBeInTheDocument();
  });

  it("calls onChange when title changes", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.change(screen.getByDisplayValue("Test Worksheet"), {
      target: { value: "New Title" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: "New Title" })
    );
  });

  it("calls onChange when adding a section", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("+ Spelling"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sections: expect.arrayContaining([
          expect.objectContaining({ type: "spelling" }),
        ]),
      })
    );
  });

  it("calls onChange when removing a section", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTitle("Remove section"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ sections: [] })
    );
  });

  it("calls onRegenerate when clicking regenerate", () => {
    const onRegenerate = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={onRegenerate}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Regenerate"));
    expect(onRegenerate).toHaveBeenCalled();
  });

  it("calls onPrint with false for Print button", () => {
    const onPrint = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={onPrint}
      />
    );
    fireEvent.click(screen.getByText("Print"));
    expect(onPrint).toHaveBeenCalledWith(false);
  });

  it("calls onPrint with true for Print with Answers button", () => {
    const onPrint = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={onPrint}
      />
    );
    fireEvent.click(screen.getByText("Print with Answers"));
    expect(onPrint).toHaveBeenCalledWith(true);
  });

  it("shows empty hint when no sections", () => {
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Add a section to get started.")).toBeInTheDocument();
  });

  it("renders arithmetic section options", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Arithmetic")).toBeInTheDocument();
    expect(screen.getByText("addition")).toBeInTheDocument();
    expect(screen.getByText("subtraction")).toBeInTheDocument();
  });

  it("renders tracing section options when tracing is added", () => {
    const configWithTracing: WorksheetConfig = {
      ...defaultConfig,
      sections: [{ id: "t1", type: "tracing", tracing: { content: "uppercase", repetitions: 4 } }],
    };
    render(
      <ConfigPanel
        config={configWithTracing}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Tracing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Uppercase Letters")).toBeInTheDocument();
  });

  it("renders spelling section options when spelling is added", () => {
    const configWithSpelling: WorksheetConfig = {
      ...defaultConfig,
      sections: [{ id: "s1", type: "spelling", spelling: { wordCount: 8, mode: "fill-in-blank" } }],
    };
    render(
      <ConfigPanel
        config={configWithSpelling}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Spelling")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fill in the Blank")).toBeInTheDocument();
  });
});
