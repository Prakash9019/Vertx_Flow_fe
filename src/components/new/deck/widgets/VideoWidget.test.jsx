import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VideoWidget } from "./VideoWidget";
import { uploadAsset } from "../../../../utils/deckApi";

vi.mock("../../../../utils/deckApi", () => ({
  uploadAsset: vi.fn(),
}));

describe("VideoWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads the picked file and calls onReplaceSrc with the returned URL, not a blob URL", async () => {
    uploadAsset.mockResolvedValue("https://storage.googleapis.com/bucket/deck-assets/1.mp4");
    const onReplaceSrc = vi.fn();
    const { container } = render(<VideoWidget element={{ props: { src: "" } }} onReplaceSrc={onReplaceSrc} />);

    const file = new File(["bytes"], "clip.mp4", { type: "video/mp4" });
    const input = container.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/uploading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(onReplaceSrc).toHaveBeenCalledWith("https://storage.googleapis.com/bucket/deck-assets/1.mp4");
    });
    expect(uploadAsset).toHaveBeenCalledWith(file);
  });

  it("shows an error and keeps the placeholder when the upload fails", async () => {
    uploadAsset.mockRejectedValue(new Error("network down"));
    const onReplaceSrc = vi.fn();
    const { container } = render(<VideoWidget element={{ props: { src: "" } }} onReplaceSrc={onReplaceSrc} />);

    const file = new File(["bytes"], "clip.mp4", { type: "video/mp4" });
    const input = container.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
    expect(onReplaceSrc).not.toHaveBeenCalled();
  });
});
