import { SubsidiaryLogo } from "../components/SubsidiaryLogo";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FooterOne } from "../components/footers/FooterOne";
import { ScrollToTopButton } from "../components/scroll_to_top_btn/ScrollToTopButton";

const capabilities = [
  { title: "Civil engineering", text: "Groundworks, structures and infrastructure delivered against a defined technical scope." },
  { title: "Building construction", text: "From setting out and structural work through finishing and handover." },
  { title: "Rehabilitation", text: "Remodelling and repair planned around the condition and continued use of an existing building." },
];

export const ConstructionPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.1 });
    document.querySelectorAll(".construction-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <>
    <header className="construction-header"><Link to="/" aria-label="Integral Holdings home"><SubsidiaryLogo brand="construction" white /><span>Doi-Teck Construction</span></Link><nav className={menuOpen ? "is-open" : ""} aria-label="Construction navigation"><a href="#overview" onClick={() => setMenuOpen(false)}>Overview</a><a href="#capabilities" onClick={() => setMenuOpen(false)}>Capabilities</a><a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a><Link to="/contact.html">Contact</Link></nav><button className="construction-menu" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></header>
    <main className="construction-page" id="main-content">
      <section className="construction-hero" aria-labelledby="construction-title"><img src="/integral/construction-hero-pexels.jpg" alt="Stock photograph of a high-rise building under construction with cranes" /><div className="construction-hero-shade" /><h1 id="construction-title">Doi-Teck Construction</h1><div className="construction-hero-footer"><div><strong>Port Harcourt</strong><span>Rivers State, Nigeria</span></div><div><strong>Civil</strong><span>Engineering</span></div><div><strong>Building</strong><span>Construction</span></div><Link to="/contact.html">Contact us</Link></div></section>

      <section className="construction-split construction-reveal" id="overview" aria-labelledby="construction-overview-title"><div className="construction-split-copy"><span>Overview</span><h2 id="construction-overview-title">Built around the brief</h2><p>Doi-Teck Construction Company Limited works across civil engineering, building construction and the improvement of existing structures. The work begins with a clear scope and stays focused on what the project needs to deliver.</p></div><img src="/integral/doiteck-building.jpg" alt="Building exterior shared for Doi-Teck Construction" loading="lazy" /></section>

      <section className="construction-immersive construction-reveal" id="capabilities" aria-labelledby="construction-capabilities-title"><img src="/integral/editorial/construction.jpg" alt="Concrete structure and tower crane on a construction site" loading="lazy" /><div className="construction-immersive-shade" /><div className="construction-immersive-copy"><span>Capabilities</span><h2 id="construction-capabilities-title">From groundworks to handover</h2><p>Building work, civil works and rehabilitation, coordinated from an agreed scope through delivery on site.</p></div><div className="construction-immersive-facts">{capabilities.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>

      <section className="construction-split construction-split-reverse construction-reveal" aria-labelledby="construction-delivery-title"><img src="/integral/engineers-industrial-site.jpg" alt="Two engineers reviewing a tablet at an industrial site" loading="lazy" /><div className="construction-split-copy"><span>Delivery</span><h2 id="construction-delivery-title">Keep the work accountable</h2><p>Project management connects the design, procurement, site teams and quality checks. The objective is straightforward: know the scope, resolve issues early and deliver work that is ready to use.</p><a href="#work">See selected work</a></div></section>

      <section className="construction-scope construction-reveal" aria-labelledby="construction-scope-title"><div><span>Our scope</span><h2 id="construction-scope-title">Construction is a sequence of decisions.</h2></div><div className="construction-scope-list"><article><span>01</span><h3>Define</h3><p>Site conditions, drawings, materials and delivery requirements.</p></article><article><span>02</span><h3>Coordinate</h3><p>People, procurement and site activity against the programme.</p></article><article><span>03</span><h3>Deliver</h3><p>Complete the work with inspection, documentation and handover.</p></article></div></section>

      <section className="construction-work construction-reveal" id="work" aria-labelledby="construction-work-title"><div className="construction-work-heading"><span>Selected work</span><h2 id="construction-work-title">Public-sector buildings</h2><p>Company founder Teki Douglas Moshe named these projects in a 2022 interview. Project photography and detailed case studies have not yet been provided.</p></div><div className="construction-work-grid"><article><span>Port Harcourt</span><h3>Port Harcourt City Local Government Health Care Authority</h3><p>Building work cited by Doi-Teck leadership.</p></article><article><span>Rivers State</span><h3>Obio/Akpor Legislative Assembly building</h3><p>Building work cited by Doi-Teck leadership.</p></article></div><a className="construction-source" href="https://www.nairaland.com/7393122/add-wow-factor-everything-teki" target="_blank" rel="noopener noreferrer">Source: 2022 interview with Teki Douglas Moshe</a></section>

      <section className="construction-contact" aria-labelledby="construction-contact-title"><img src="/integral/construction-contact-stock.jpg" alt="Construction site with equipment and scaffolding" loading="lazy" /><div className="construction-contact-shade" /><div><span>Doi-Teck Construction</span><h2 id="construction-contact-title">Contact us.</h2><p>Share the location, scope and stage of your brief.</p><Link to="/contact.html">Get in touch</Link></div></section>
    </main><FooterOne /><ScrollToTopButton />
  </>;
};
