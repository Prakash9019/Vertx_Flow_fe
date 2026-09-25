import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InsertWidgetMenu } from "./InsertWidgetMenu";
import { WIDGET_TYPES } from "./freeElementFactory";

describe("InsertWidgetMenu", () => {
  it("renders one item per registered widget type", () => {
    render(<InsertWidgetMenu onInsert={() => {}} />);
    for (const type of WIDGET_TYPES) {
      expect(screen.getByTitle(new RegExp(type, "i"))).toBeInTheDocument();
    }
  });

  it("calls onInsert with the picked widget type", () => {
    const onInsert = vi.fn();
    render(<InsertWidgetMenu onInsert={onInsert} />);
    fireEvent.click(screen.getByTitle(/^chart$/i));
    expect(onInsert).toHaveBeenCalledWith("chart");
  });
});
