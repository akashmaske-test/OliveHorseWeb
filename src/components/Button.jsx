export default function Button({
  children,
  href,
  variant = "primary",
  small = false,
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const classes = ["btn", `btn-${variant}`, small ? "btn-small" : "", className].filter(Boolean).join(" ");

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
