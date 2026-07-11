const iconPaths = {
  focus: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-5" />
    </>
  ),
  strength: <path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" />,
  confidence: <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3z" />,
  flexibility: (
    <>
      <path d="M7 21c4-2 7-6 8-11" />
      <path d="M15 10l4 4" />
      <path d="M13 4a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
      <path d="M5 12c3-2 6-3 10-2" />
    </>
  ),
  progress: (
    <>
      <path d="M4 19h16" />
      <path d="M6 16l4-4 3 3 5-7" />
      <path d="M18 8h-4M18 8v4" />
    </>
  ),
};

export default function BenefitCard({ item }) {
  return (
    <article className="benefit-card">
      <span className="icon-badge">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {iconPaths[item.icon] || iconPaths.progress}
        </svg>
      </span>
      <div className="card-body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}
