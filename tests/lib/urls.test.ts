import { resolveAsset, route } from "#lib/urls.js";
import { describe, expect, it } from "vitest";

describe("route", () => {
  it("resolves static routes without options", () => {
    expect(route("/")).toBe("/");
    expect(route("/blog")).toBe("/blog");
  });

  it("resolves dynamic route parameters via $app/paths resolve", () => {
    expect(
      route("/blog/[slug]", {
        params: { slug: "1-기술-블로그-시작하기" },
      }),
    ).toBe("/blog/1-기술-블로그-시작하기");
  });

  it("appends URL-encoded query parameters and omits empty values", () => {
    expect(
      route("/blog", {
        query: {
          tag: "C#",
          page: 2,
        },
      }),
    ).toBe("/blog?tag=C%23&page=2");

    expect(
      route("/blog", {
        query: {
          tag: undefined,
          page: "",
        },
      }),
    ).toBe("/blog");
  });
});

describe("resolveAsset", () => {
  it("resolves root-relative paths and preserves external URLs", () => {
    expect(resolveAsset("/posts/1/preview.png")).toBe("/posts/1/preview.png");
    expect(resolveAsset("https://example.com/image.png")).toBe(
      "https://example.com/image.png",
    );
  });
});
