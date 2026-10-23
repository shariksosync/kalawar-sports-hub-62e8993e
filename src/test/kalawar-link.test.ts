import { describe, expect, it } from "vitest";
import { KALAWAR_URL } from "@/lib/data";

describe("Kalawar website", () => {
  it("uses the official website supplied by the owner", () => {
    expect(KALAWAR_URL).toBe("https://www.kalawarsmfi.com/");
  });
});