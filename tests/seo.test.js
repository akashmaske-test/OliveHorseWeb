import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readBlogPosts, validateBlogPost } from "../src/blog/content.js";
import { absoluteUrl, pageMetadata, staticPages } from "../src/seo/site.js";

describe("SEO foundations", () => {
  it("uses the production origin for absolute canonical URLs", () => {
    expect(absoluteUrl("/blog/")).toBe("https://olivehorsefitness.vercel.app/blog/");
    expect(pageMetadata("/", staticPages["/"]).canonical).toBe("https://olivehorsefitness.vercel.app/");
  });

  it("excludes draft posts from public blog discovery", () => {
    expect(readBlogPosts()).toEqual([]);
    const drafts = readBlogPosts({ includeNonPublished: true });
    expect(drafts).toHaveLength(1);
    expect(drafts[0].status).toBe("draft");
  });

  it("keeps the development Markdown sample valid but non-indexable", () => {
    const [sample] = readBlogPosts({ includeNonPublished: true });
    expect(validateBlogPost(sample)).toEqual([]);
    expect(sample.noindex).toBe(true);
  });

  it("stores the first real draft outside the live blog directory", () => {
    const draft = path.join("seo-automation", "generated-blogs", "how-to-choose-a-karate-class-for-your-child-in-santacruz.md");
    expect(fs.existsSync(draft)).toBe(true);
    expect(fs.existsSync(path.join("content", "blog", "how-to-choose-a-karate-class-for-your-child-in-santacruz.md"))).toBe(false);
  });
});
