import { describe, expect, it } from "vitest";
import { blobPathname, isAuthorized } from "../api/social/upload.js";

describe("social upload endpoint helpers", () => {
  it("requires an exact bearer secret", () => {
    expect(isAuthorized("Bearer correct", "correct")).toBe(true);
    expect(isAuthorized("Bearer wrong", "correct")).toBe(false);
    expect(isAuthorized(undefined, "correct")).toBe(false);
  });

  it("creates duplicate-safe daily Blob paths without uploading", () => {
    const path = blobPathname("image/png", new Date("2026-07-13T06:00:00Z"), "unique-id");
    expect(path).toBe("social/2026/07/13/unique-id.png");
    expect(() => blobPathname("image/gif")).toThrow("unsupported_media_type");
  });
});
