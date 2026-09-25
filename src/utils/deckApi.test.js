import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { uploadAsset } from "./deckApi";

// `deckApi.js` imports `./api`, which calls `axios.create()` at module load
// (for the shared `api` instance the rest of deckApi's methods use) - the
// mock below only replaces the default export's own methods (`post`, used
// directly by `uploadAsset`), not `create`, so that module load doesn't
// throw on a mocked-away instance.
vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  return {
    default: {
      ...actual.default,
      create: actual.default.create,
      post: vi.fn(),
    },
  };
});

describe("uploadAsset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("authToken", "test-token");
  });

  it("posts the file as multipart form data to /files/deck-asset with the auth token, and returns the uploaded URL", async () => {
    axios.post.mockResolvedValue({ data: { success: true, url: "https://storage.googleapis.com/bucket/deck-assets/1.png" } });
    const file = new File(["bytes"], "photo.png", { type: "image/png" });

    const url = await uploadAsset(file);

    expect(url).toBe("https://storage.googleapis.com/bucket/deck-assets/1.png");
    expect(axios.post).toHaveBeenCalledTimes(1);
    const [calledUrl, calledBody, calledConfig] = axios.post.mock.calls[0];
    expect(calledUrl).toMatch(/\/files\/deck-asset$/);
    expect(calledBody).toBeInstanceOf(FormData);
    expect(calledBody.get("file")).toBe(file);
    expect(calledConfig.headers.Authorization).toBe("Bearer test-token");
    // Must not force a JSON content-type - that would strip FormData's own
    // multipart boundary and break the backend's multipart parser.
    expect(calledConfig.headers["Content-Type"]).toBeUndefined();
  });

  it("rejects when the upload fails", async () => {
    axios.post.mockRejectedValue(new Error("network down"));
    const file = new File(["bytes"], "photo.png", { type: "image/png" });

    await expect(uploadAsset(file)).rejects.toThrow("network down");
  });
});
