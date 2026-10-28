import { SubsidiaryLogo, usePageBrand } from "../SubsidiaryLogo";
import { Link } from "react-router-dom";

export const FooterOne = () => { const brand = usePageBrand(); return <footer className={`td-footer-area integral-footer ${brand ? "subsidiary-footer" : ""}`}>
  <div className="container integral-footer-inner">
    <Link className="integral-footer-brand" to="/" aria-label="Integral Holdings home">{brand ? <SubsidiaryLogo brand={brand} white /> : <img src="/integral/integral-logo-supplied.png" alt="Integral" />}</Link>
    <p>Securing the future. Building legacies.</p>
    <nav className="integral-footer-nav" aria-label="Footer">
      <span>Integral © {new Date().getFullYear()}</span>
      <Link to="/#subsidiaries">Sectors</Link>
      <Link to="/about.html">About</Link>
      <Link to="/leadership.html">Leadership</Link>
      <Link to="/updates.html">Insights</Link>
      <Link to="/careers.html">Careers</Link>
      <Link to="/contact.html">Contact</Link>
      <span>Nigeria</span>
    </nav>
  </div>
</footer>; };
