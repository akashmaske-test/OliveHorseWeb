import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });
const BLOG_DIRECTORY = path.resolve("content/blog");
const REQUIRED_FIELDS = ["title", "description", "slug", "date", "author", "primary_keyword", "canonical", "status", "noindex"];

export function readBlogPosts({ includeNonPublished = false } = {}) {
  if (!fs.existsSync(BLOG_DIRECTORY)) return [];
  return fs
    .readdirSync(BLOG_DIRECTORY)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => parseBlogFile(path.join(BLOG_DIRECTORY, filename)))
    .filter(Boolean)
    .filter((post) => includeNonPublished || (post.status === "published" && !post.noindex))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function parseBlogFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);
  const data = parsed.data;
  const wordCount = parsed.content.trim() ? parsed.content.trim().split(/\s+/).length : 0;
  return {
    ...data,
    sourcePath: filePath,
    html: markdown.render(parsed.content),
    wordCount,
    readingTime: Math.max(1, Math.ceil(wordCount / 200)),
    missingFields: REQUIRED_FIELDS.filter((field) => data[field] === undefined || data[field] === ""),
  };
}

export function validateBlogPost(post) {
  const errors = [];
  if (post.missingFields?.length) errors.push(`Missing frontmatter: ${post.missingFields.join(", ")}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || "")) errors.push("Slug must use lowercase letters, numbers, and hyphens.");
  if (!["draft", "pending_review", "approved_for_publish", "published"].includes(post.status)) errors.push("Invalid blog status.");
  if (post.featured_image && !post.featured_image_alt) errors.push("Featured images require alt text.");
  return errors;
}
