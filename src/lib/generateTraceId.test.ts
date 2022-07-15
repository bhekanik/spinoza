import { describe, expect, it } from "vitest";
import { generateTraceId } from "./generateTraceId";

describe("generateTraceId", () => {
  it("should generate a trace id", () => {
    expect(generateTraceId()).toBeTruthy();
  });

  it("should generate a trace id with a given size", () => {
    expect(generateTraceId(10)).toBeTruthy();
  });
});
