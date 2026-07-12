import { readPublishedBlogPreviews } from "../blog/public-previews.js";
import Button from "../components/Button.jsx";

export default function FeaturedBlogs() {
  const posts = readPublishedBlogPreviews().slice(0, 3);

  if (!posts.length) return null;

  return (
    <section className="section ivory" id="resources" aria-labelledby="resources-heading">
      <div className="container">
        <div className="section-heading blog-preview-heading">
          <p className="eyebrow">OliveHorse Resources</p>
          <h2 id="resources-heading">Helpful Karate Guides for Parents and Students</h2>
          <p className="lede">Practical articles to help you choose the right training programme and get started with confidence.</p>
        </div>
        <div className="blog-preview-grid">
          {posts.map((post) => (
            <article className="card card-body blog-preview-card" key={post.slug}>
              {post.featured_image ? <img className="blog-card-image" src={post.featured_image} alt={post.featured_image_alt} /> : null}
              <p className="meta">{post.date}</p>
              <h3><a href={post.href}>{post.title}</a></h3>
              <p>{post.description}</p>
              <a className="text-link" href={post.href}>Read article <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
        <div className="blog-preview-action">
          <Button href="/blog/" variant="secondary">View all resources</Button>
        </div>
      </div>
    </section>
  );
}
