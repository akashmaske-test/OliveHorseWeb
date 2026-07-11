const blogFiles = import.meta.glob("../../content/blog/*.md", { eager: true, import: "default", query: "?raw" });

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};

  return match[1].split("\n").reduce((frontmatter, line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return frontmatter;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    return { ...frontmatter, [key]: value };
  }, {});
}

export function readPublishedBlogPreviews() {
  return Object.values(blogFiles)
    .map(parseFrontmatter)
    .filter((post) => post.status === "published" && post.noindex !== "true")
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .map((post) => ({
      ...post,
      href: `/blog/${post.slug}/`,
    }));
}
