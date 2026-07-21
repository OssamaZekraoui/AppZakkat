import { describe, expect, it } from "vitest";
import { getHawlStatus } from "./hawl";

describe("getHawlStatus", () => {
  it("calculates UTC day boundaries without local-time drift", () => {
    const status = getHawlStatus(
      "2025-01-01",
      "2025-12-21T23:59:59.000Z"
    );

    expect(status.elapsedDays).toBe(354);
    expect(status.completed).toBe(true);
    expect(status.end.toISOString()).toBe("2025-12-21T00:00:00.000Z");
  });

  it("rejects invalid dates", () => {
    expect(() => getHawlStatus("not-a-date")).toThrow();
  });
});
