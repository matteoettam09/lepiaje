import { describe, it, expect } from "vitest";
import { detectLocale } from "@/i18n/detect-locale";

describe("detectLocale", () => {
  it("prefers Italian from Accept-Language", () => {
    expect(detectLocale("it-IT,it;q=0.9,en;q=0.8", undefined)).toBe("it");
  });

  it("prefers English from Accept-Language", () => {
    expect(detectLocale("en-US,en;q=0.9", undefined)).toBe("en");
  });

  it("uses browser language over geo when both are present", () => {
    expect(detectLocale("en-US,en;q=0.9", "IT")).toBe("en");
  });

  it("uses geo Italy when Accept-Language is missing", () => {
    expect(detectLocale(null, "IT")).toBe("it");
  });

  it("defaults to Italian when Accept-Language and geo are unhelpful", () => {
    expect(detectLocale(null, "DE")).toBe("it");
    expect(detectLocale("", undefined)).toBe("it");
  });
});
