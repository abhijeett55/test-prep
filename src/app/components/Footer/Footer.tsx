import "./Footer.css";

type FooterProps = {
  linkLabel?: string;
  linkHref?: string;
  note?: string;
  version?: string;
};

export default function Footer({
  linkLabel = "Explore What's New",
  linkHref = "#",
  note = "For the best experience, we recommend using the latest version of Google Chrome.",
  version = "1.0.0",
}: FooterProps) {
  return (
    <footer className="footer">
      <a href={linkHref} className="footer-link">
        {linkLabel}
      </a>
      <span className="footer-note">{note}</span>
      <span className="footer-version">Version {version}</span>
    </footer>
  );
}