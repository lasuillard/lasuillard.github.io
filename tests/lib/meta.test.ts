import { titleWithSuffix } from "#lib/meta.js";
import { describe, expect, it } from "vitest";

describe(titleWithSuffix, () => {
  it("returns new title with suffix", () => {
    expect(titleWithSuffix("About Me")).toEqual("About Me • lasuillard's Blog");
  });

  it('returns `"Untitled"` if title is `undefined`', () => {
    expect(titleWithSuffix(undefined)).toEqual("Untitled");
  });
});
