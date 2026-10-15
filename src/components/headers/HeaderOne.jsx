import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { subsidiaries } from "../../content";

const companyLinks = [
  { label: "About", path: "/about.html" },
  { label: "Leadership", path: "/leadership.html" },
  { label: "Careers", path: "/careers.html" },
];

export const HeaderOne = () => {
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState("sectors");
  const [desktopGroup, setDesktopGroup] = useState("");
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const results = [{ label: "Insights", path: "/updates.html" }, ...companyLinks, ...subsidiaries.map((item) => ({ label: item.name, path: item.path }))].filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6);

  useEffect(() => { setOpen(false); setDesktopGroup(""); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    if (!open && !desktopGroup) return;
    const closeOnEscape = (event) => { if (event.key === "Escape") { setOpen(false); setDesktopGroup(""); } };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, desktopGroup]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <header className={`td-header-area integral-header ${scrolled ? "is-scrolled" : ""}`}>
    <div className="td-header-top integral-header-top"><div className="container container-1750"><div className="integral-top-inner"><span>Integral Holdings &nbsp; / &nbsp; Nigeria</span></div></div></div>
    <div className="td-header-bottom integral-header-main"><div className="container container-1750"><div className="integral-header-inner">
      <form className="integral-header-search" role="search" onSubmit={(event) => { event.preventDefault(); if (query.trim() && results[0]) { navigate(results[0].path); setQuery(""); } }}><button type="submit" aria-label="Search"><i className="fa-light fa-magnifying-glass" aria-hidden="true" /></button><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search here..." aria-label="Search Integral" />{query && <div className="integral-search-results">{results.length ? results.map((item) => <Link key={item.path} to={item.path} onClick={() => setQuery("")}>{item.label}</Link>) : <span>No matching pages</span>}</div>}</form>
      <Link className="integral-header-logo" to="/" aria-label="Integral Holdings home"><img src="/integral/integral-logo-supplied.png" alt="Integral" /></Link>
      <nav className="integral-desktop-nav" aria-label="Primary navigation"><div className={`integral-nav-dropdown ${desktopGroup === "sectors" ? "is-open" : ""}`}><button type="button" aria-expanded={desktopGroup === "sectors"} onClick={() => setDesktopGroup(desktopGroup === "sectors" ? "" : "sectors")}>Sectors</button><div className="integral-nav-submenu">{subsidiaries.map((item) => <Link key={item.id} to={item.path}>{item.name}</Link>)}</div></div><div className={`integral-nav-dropdown ${desktopGroup === "company" ? "is-open" : ""}`}><button type="button" aria-expanded={desktopGroup === "company"} onClick={() => setDesktopGroup(desktopGroup === "company" ? "" : "company")}>Company</button><div className="integral-nav-submenu">{companyLinks.map((item) => <Link key={item.path} to={item.path}>{item.label}</Link>)}</div></div><Link to="/updates.html" onClick={() => setDesktopGroup("")}>Insights</Link></nav>
      <button type="button" className="integral-menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><span /><span /><span /></button>
    </div></div></div>
    <div className={`integral-mobile-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation" aria-hidden={!open}>
      <div className="integral-mobile-head"><Link to="/" onClick={() => setOpen(false)}><img src="/integral/integral-logo-supplied.png" alt="Integral" /></Link><button type="button" onClick={() => setOpen(false)} aria-label="Close menu">×</button></div>
      <div className="integral-mobile-content">
        <form className="integral-mobile-search" role="search" onSubmit={(event) => { event.preventDefault(); if (query.trim() && results[0]) { navigate(results[0].path); setOpen(false); setQuery(""); } }}><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Integral" aria-label="Search Integral" /><button type="submit" aria-label="Search"><i className="fa-light fa-magnifying-glass" aria-hidden="true" /></button></form>
        {query && <div className="integral-mobile-results">{results.map((item) => <Link key={item.path} to={item.path} onClick={() => { setOpen(false); setQuery(""); }}>{item.label}</Link>)}</div>}
        <button type="button" className="integral-mobile-main" onClick={() => setMobileGroup(mobileGroup === "sectors" ? "" : "sectors")} aria-expanded={mobileGroup === "sectors"}>Sectors</button>
        <div className={`integral-mobile-sub ${mobileGroup === "sectors" ? "is-open" : ""}`} aria-hidden={mobileGroup !== "sectors"}>{subsidiaries.map((item) => <Link key={item.id} to={item.path} onClick={() => setOpen(false)}>{item.name}</Link>)}</div>
        <button type="button" className="integral-mobile-main" onClick={() => setMobileGroup(mobileGroup === "company" ? "" : "company")} aria-expanded={mobileGroup === "company"}>Company</button>
        <div className={`integral-mobile-sub ${mobileGroup === "company" ? "is-open" : ""}`} aria-hidden={mobileGroup !== "company"}>{companyLinks.map((item) => <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>{item.label}</Link>)}</div>
        <Link className="integral-mobile-main" to="/updates.html" onClick={() => setOpen(false)}>Insights</Link>
      </div>
    </div>
  </header>;
};
