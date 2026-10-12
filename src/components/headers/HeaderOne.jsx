import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { subsidiaries } from "../../content";

const companyLinks = [
  { label: "About", path: "/about.html" },
  { label: "Leadership", path: "/leadership.html" },
  { label: "Updates", path: "/updates.html" },
  { label: "Careers", path: "/careers.html" },
];

export const HeaderOne = () => {
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState("subsidiaries");
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <header className="td-header-area integral-header">
    <div className="td-header-top integral-header-top"><div className="container container-1750"><div className="integral-top-inner"><nav aria-label="Company links">{companyLinks.map((item) => <Link to={item.path} key={item.path}>{item.label}</Link>)}</nav><span>Integral Holdings &nbsp; / &nbsp; Nigeria</span></div></div></div>
    <div className="td-header-bottom integral-header-main"><div className="container container-1750"><div className="integral-header-inner">
      <span className="integral-header-note">Securing the future.<br />Building legacies.</span>
      <Link className="integral-header-logo" to="/" aria-label="Integral Holdings home"><img src="/integral/integral-logo-supplied.png" alt="Integral" /></Link>
      <nav className="integral-desktop-nav" aria-label="Primary navigation"><Link to="/">Home</Link><div className="integral-nav-dropdown"><a href="/#subsidiaries">Subsidiaries</a><div className="integral-nav-submenu">{subsidiaries.map((item) => <Link key={item.id} to={item.path}>{item.name}</Link>)}</div></div><Link to="/about.html">Company</Link><Link to="/leadership.html">Leadership</Link></nav>
      <button type="button" className="integral-menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><span /><span /><span /></button>
    </div></div></div>
    <div className={`integral-mobile-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation" aria-hidden={!open}>
      <div className="integral-mobile-head"><Link to="/" onClick={() => setOpen(false)}><img src="/integral/integral-logo-supplied.png" alt="Integral" /></Link><button type="button" onClick={() => setOpen(false)} aria-label="Close menu">×</button></div>
      <div className="integral-mobile-content"><Link className="integral-mobile-main" to="/" onClick={() => setOpen(false)}>Home</Link>
        <button type="button" className="integral-mobile-main" onClick={() => setMobileGroup(mobileGroup === "subsidiaries" ? "" : "subsidiaries")} aria-expanded={mobileGroup === "subsidiaries"}>Subsidiaries <span aria-hidden="true">⌄</span></button>
        {mobileGroup === "subsidiaries" && <div className="integral-mobile-sub">{subsidiaries.map((item) => <Link key={item.id} to={item.path} onClick={() => setOpen(false)}>{item.name}</Link>)}</div>}
        <button type="button" className="integral-mobile-main" onClick={() => setMobileGroup(mobileGroup === "company" ? "" : "company")} aria-expanded={mobileGroup === "company"}>Company <span aria-hidden="true">⌄</span></button>
        {mobileGroup === "company" && <div className="integral-mobile-sub">{companyLinks.map((item) => <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>{item.label}</Link>)}</div>}
      </div>
    </div>
  </header>;
};
