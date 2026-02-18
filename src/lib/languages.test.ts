import { describe, expect, it } from "vitest";

import { LanguageName, languageValues } from "@/lib/languages";

describe("languageValues", () => {
  it("matches all declared LanguageName enum values", () => {
    expect(languageValues).toEqual(Object.values(LanguageName));
  });

  it("does not contain duplicate values", () => {
    expect(new Set(languageValues).size).toBe(languageValues.length);
  });
});
