/* eslint-disable react/prop-types */
import { SubsidiaryLogo } from "../components/SubsidiaryLogo";
import { useEffect, useRef, useState } from "react";
import { imageSources } from "../imageSources";
import { Link } from "react-router-dom";
import "../assets/css/industry-pages.css";

const media = (name) => `/integral/${name}`;

function IndustryShell({ name, links, children }) {
  const brand = name.startsWith("Metric") ? "metric" : "engineering";
  const [menuOpen, setMenuOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    document.title = `${name} | Integral Holdings`;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    root.current.querySelectorAll(".industry-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [name]);
  return <div className="industry-site" ref={root}>
    <a className="industry-skip" href="#industry-main">Skip to content</a>
    <header className="industry-header">
      <Link className="industry-brand" to="/" aria-label="Integral Holdings home"><SubsidiaryLogo brand={brand} white /></Link>
      <nav id="industry-navigation" className={menuOpen ? "is-open" : ""} aria-label={`${name} navigation`} onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <Link to="/contact.html">Contact</Link>
      </nav>
      <button type="button" className="industry-menu" aria-controls="industry-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
    </header>
    <main id="industry-main">{children}</main>
    <footer className="industry-footer subsidiary-footer"><Link to="/" aria-label="Integral Holdings home"><SubsidiaryLogo brand={brand} white /></Link><Link to="/contact.html">Contact</Link><Link to="/careers.html">Careers</Link></footer>
  </div>;
}

function Hero({ name, subtitle, image, alt, pillars }) {
  return <section className="industry-hero" aria-labelledby="industry-title">
    <img src={media(image)} {...imageSources(media(image))} alt={alt} fetchPriority="high" />
    <div className="industry-hero-title"><h1 id="industry-title">{name}</h1><p>{subtitle}</p></div>
    <div className="industry-pillars">{pillars.map(([title, text]) => <div key={title}><strong>{title}</strong><span>{text}</span></div>)}</div>
  </section>;
}

function ImageFrame({ image, alt, className = "" }) {
  return <div className={`industry-image ${className}`}><img src={media(image)} {...imageSources(media(image))} alt={alt} loading="lazy" /></div>;
}

function ImageTabs({ id, items }) {
  const [active, setActive] = useState(0);
  const buttons = useRef([]);
  function onKey(event, index) {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index + items.length - 1) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    buttons.current[next].focus();
  }
  return <div className="industry-tab-feature">
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`}><ImageFrame key={items[active].image} image={items[active].image} alt={items[active].alt} /></div>
    <div className="industry-tabs" role="tablist" aria-label="Areas of focus" style={{ "--tab-count": items.length }}>
      {items.map((item, index) => <button key={item.title} ref={(element) => { buttons.current[index] = element; }} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => onKey(event, index)}><strong>{item.title}</strong><span>{item.text}</span></button>)}
    </div>
  </div>;
}

const metricAreas = [
  { title: "Field services", image: "energy-towers-1600.webp", alt: "Industrial pipework and energy processing equipment", text: "Planned focus on well intervention, maintenance and technical support for field operations." },
  { title: "Infrastructure", image: "home-service-infrastructure.jpg", alt: "Structural works on a large construction site", text: "Pipeline, flowline, fabrication and construction support within a defined project scope." },
  { title: "Procurement", image: "africa/lagos-collaboration.jpg", alt: "Colleagues reviewing information together", text: "Sourcing, traceability and logistics aligned with project specifications and delivery schedules." },
];

const engineeringAreas = [
  { title: "Civil & structural", image: "editorial/construction.jpg", alt: "Concrete columns and reinforcement during construction", text: "Structures and infrastructure, from the design brief to technical project support." },
  { title: "Mechanical", image: "editorial/energy.jpg", alt: "Industrial vessels and connected piping systems", text: "Mechanical systems considered alongside the operational demands of the project." },
  { title: "Electrical", image: "editorial/planning.jpg", alt: "Technical planning documents in an office", text: "Electrical engineering and coordination within the wider project design." },
  { title: "Technical support", image: "sector-engineering-real.jpg", alt: "A drone surveying open land", text: "Technical consultancy, project engineering and support for infrastructure operations." },
];

export function MetricPage() {
  return <IndustryShell name="Metric Oil and Gas" links={[["Overview", "overview"], ["Focus", "focus"], ["Standards", "standards"]]}>
    <Hero name="Metric Oil and Gas" subtitle="Oil, gas and energy." image="energy-sunset-1600.webp" alt="Industrial structures and pipework in evening light" pillars={[["Nigeria", "Our market"], ["Energy", "Our focus"], ["Integral", "Our Group"]]} />
    <section className="industry-intro industry-reveal" id="overview"><h2>Energy services. Local understanding.</h2><p>Metric Oil and Gas Limited represents Integral Holdings in Nigeria&apos;s energy sector. We are developing technical, operational and procurement support for energy operators, contractors and industrial clients.</p><a className="industry-button" href="#focus">Explore our focus</a></section>
    <section id="focus" className="industry-reveal">
      <ImageTabs id="metric-focus" items={metricAreas} />
      <p className="industry-scope">These areas form our development focus. Service scope and availability are confirmed for each enquiry.</p>
    </section>
    <section className="industry-reveal" id="standards">
      <ImageFrame image="engineers-industrial-site.jpg" alt="Two engineers reviewing a tablet at an industrial site" />
      <div className="industry-copy-split"><h2>Safety and quality, from the outset.</h2><p>Our approach starts with safe execution, quality assurance and responsible procurement. We are developing the systems for risk assessment, material traceability and clear project documentation that dependable energy services require.</p></div>
    </section>
    <section className="industry-reveal">
      <ImageFrame image="africa/lagos-meeting.jpg" alt="Business professionals in a meeting in Lagos" />
      <div className="industry-copy-split"><h2>Part of Integral Holdings.</h2><div><p>Metric connects the Group&apos;s energy interests with its wider engineering and infrastructure focus. Based in Port Harcourt, Integral Holdings brings specialist businesses together across six sectors.</p><Link className="industry-text-link" to="/about.html">About the Group</Link></div></div>
    </section>
    <section className="industry-contact industry-reveal"><h2>Contact Metric</h2><p>Discuss your project requirements.</p><Link className="industry-button" to="/contact.html">Contact us</Link></section>
  </IndustryShell>;
}

export function EngineeringPage() {
  return <IndustryShell name="DOI-TECK Engineering" links={[["Overview", "overview"], ["Engineering", "disciplines"], ["Approach", "approach"]]}>
    <Hero name="DOI-TECK Engineering" subtitle="Engineering and technical solutions." image="home-service-infrastructure.jpg" alt="Building structures and cranes on a construction site" pillars={[["Design", "Technical foundations"], ["Projects", "Engineering coordination"], ["Operations", "Practical support"]]} />
    <section className="industry-intro industry-reveal" id="overview"><h2>From ideas to working systems.</h2><p>DOI-TECK Engineering Limited extends Integral Holdings into engineering, technical systems and infrastructure solutions. Our focus is on translating project requirements into practical, reliable and efficient systems.</p><Link className="industry-button" to="/contact.html">Discuss a project</Link></section>
    <div className="industry-inset industry-reveal"><ImageFrame image="engineers-industrial-site.jpg" alt="Two engineers discussing work at an industrial site" /></div>
    <section className="industry-inset industry-reveal" id="disciplines"><div className="industry-section-heading"><h2>Engineering across disciplines.</h2><p>Our planned capability spans design, technical consultancy and project support.</p></div><ImageTabs id="engineering-focus" items={engineeringAreas} /><p className="industry-scope">Specific capabilities and delivery scope are confirmed with our team before engagement.</p></section>
    <section className="industry-inset industry-reveal" id="approach"><div className="industry-section-heading"><h2>Defined around the project.</h2><p>A clear brief connects technical decisions to the work on site.</p></div><div className="industry-three-up">
      <article><ImageFrame image="africa/lagos-collaboration.jpg" alt="Colleagues reviewing a project on a laptop" /><h3>Understand the brief</h3><p>Establish the intended use, site conditions and technical requirements.</p></article>
      <article><ImageFrame image="doiteck-building.jpg" alt="Building exterior supplied for DOI-TECK" /><h3>Coordinate the design</h3><p>Bring the disciplines together around a consistent project scope.</p></article>
      <article><ImageFrame image="africa/lagos-meeting.jpg" alt="Professionals reviewing information around a meeting table" /><h3>Support the work</h3><p>Keep technical information, responsibilities and project decisions aligned.</p></article>
    </div></section>
    <section className="industry-support industry-reveal"><div><h2>Technical direction.<br />Practical context.</h2><p>Engineering sits alongside construction and the Group&apos;s other specialist businesses. Each brings a different perspective to how a project is planned, delivered and used.</p><Link className="industry-text-link" to="/construction.html">Explore DOI-TECK Construction</Link></div><ImageFrame image="modern-towers-1600.webp" alt="Modern architectural towers viewed from below" /></section>
    <section className="industry-contact industry-reveal"><h2>Work with DOI-TECK Engineering</h2><Link className="industry-button" to="/contact.html">Contact us</Link></section>
  </IndustryShell>;
}
