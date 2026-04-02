import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TracingWorksheet } from "../TracingWorksheet";

describe("TracingWorksheet", () => {
  it("renders uppercase letters", () => {
    render(<TracingWorksheet config={{ content: "uppercase", repetitions: 3 }} />);
    expect(screen.getAllByText("A").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Z").length).toBeGreaterThanOrEqual(1);
  });

  it("renders lowercase letters", () => {
    render(<TracingWorksheet config={{ content: "lowercase", repetitions: 2 }} />);
    expect(screen.getAllByText("a").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("z").length).toBeGreaterThanOrEqual(1);
  });

  it("renders numbers", () => {
    render(<TracingWorksheet config={{ content: "numbers", repetitions: 4 }} />);
    expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("9").length).toBeGreaterThanOrEqual(1);
  });

  it("renders shapes", () => {
    render(<TracingWorksheet config={{ content: "shapes", repetitions: 2 }} />);
    expect(screen.getAllByText("●").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("★").length).toBeGreaterThanOrEqual(1);
  });

  it("renders correct number of repetitions", () => {
    render(<TracingWorksheet config={{ content: "numbers", repetitions: 5 }} />);
    // "0" appears once as model + 5 as ghost = 6 total
    expect(screen.getAllByText("0")).toHaveLength(6);
  });
});
