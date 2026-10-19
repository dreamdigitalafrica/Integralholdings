import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FooterOne } from "../components/footers/FooterOne";
import { ScrollToTopButton } from "../components/scroll_to_top_btn/ScrollToTopButton";

const stages = [
  { title: "Planning", image: "/integral/africa/lagos-collaboration.jpg", alt: "Colleagues reviewing a plan in Lagos", text: "A project begins with the site, the intended use and a workable development brief." },
  { title: "On site", image: "/integral/editorial/construction.jpg", alt: "Construction work in progress", text: "Construction brings the design, contractors and delivery programme together on site." },
  { title: "Handover", image: "/integral/africa/lagos-residential.jpg", alt: "Residential building in Lagos", text: "The final checks, documentation and transition to use deserve the same attention as the build." },
];

const services = [
  { title: "Development", text: "Residential and commercial projects shaped by the site, the market and the people who will use them." },
  { title: "Sales & marketing", text: "Clear information and a considered presentation help buyers understand the property in front of them." },
  { title: "Management", text: "Property needs attention after completion. We look at the practical work of protecting its use and value." },
];

export const RealtyPage = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".realty-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <>
    <header className="realty-header">
      <Link className="realty-brand" to="/" aria-label="Integral Holdings home"><img src="/integral/integral-logo-transparent.png" alt="Integral" /><span>84th Luxury Realty</span></Link>
      <nav className={menuOpen ? "realty-nav is-open" : "realty-nav"} aria-label="Realty navigation">
        <a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a>
        <a href="#completed" onClick={() => setMenuOpen(false)}>Completed</a>
        <a href="#progress" onClick={() => setMenuOpen(false)}>In progress</a>
        <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
        <Link to="/contact.html">Contact</Link>
      </nav>
      <button className={menuOpen ? "realty-menu is-open" : "realty-menu"} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>
    <main className="realty-page" id="main-content">
      <section className="realty-hero" aria-labelledby="realty-title">
        <img src="/integral/crest-1-05.jpg" alt="Crest residential property with glass balconies" />
        <div className="realty-hero-content">
          <span>Integral Holdings / Property</span>
          <h1 id="realty-title">84th Luxury Realty</h1>
          <p>Development, sales and property management.</p>
          <div className="realty-actions"><a href="#completed">View projects</a><Link to="/contact.html">Contact us</Link></div>
        </div>
      </section>

      <section className="realty-feature realty-wrap realty-reveal" id="approach" aria-labelledby="realty-approach-title">
        <img className="realty-feature-media" src="/integral/crest-1-01.jpg" alt="Crest interior with a chandelier and glass staircase" loading="lazy" />
        <div className="realty-feature-copy"><h2 id="realty-approach-title">Built for the way people use space.</h2><p>84th Luxury Realty develops and manages property with a clear brief: what the site can support, who the space is for and what it must deliver over time.</p></div>
        <div className="realty-principles">
          <article><span>01</span><h3>Understand the site</h3><p>Location, access and context shape the first decisions.</p></article>
          <article><span>02</span><h3>Define the use</h3><p>The plan starts with the people and activities the property will serve.</p></article>
          <article><span>03</span><h3>Plan beyond delivery</h3><p>Management and upkeep belong in the conversation from the outset.</p></article>
        </div>
      </section>

      <section className="realty-feature realty-wrap realty-reveal" id="completed" aria-labelledby="realty-completed-title">
        <img className="realty-feature-media" src="/integral/crest-1-06.jpg" alt="Crest 1.0 residential development exterior" loading="lazy" />
        <div className="realty-feature-copy"><span className="realty-kicker">Completed project</span><h2 id="realty-completed-title">Crest 1.0</h2><p>A completed residential development by 84th Luxury Realty. Contact our team for project details.</p><div className="realty-inline-actions"><Link to="/contact.html">Enquire about Crest 1.0</Link><button type="button" disabled title="Project brochure is not available yet">View project brochure</button></div></div>
      </section>

      <section className="realty-stages realty-reveal" id="progress" aria-labelledby="realty-progress-title">
        <div className="realty-wrap"><div className="realty-section-heading"><span className="realty-kicker">In progress</span><h2 id="realty-progress-title">From plan to handover.</h2><p>Project-specific updates will appear here as they are released. These images show the stages of development, not announced properties.</p></div>
          <div className="realty-stage-frame"><img key={stages[activeStage].image} src={stages[activeStage].image} alt={stages[activeStage].alt} loading="lazy" /></div>
          <div className="realty-tabs" role="tablist" aria-label="Development stages">{stages.map((stage, index) => <button key={stage.title} type="button" role="tab" aria-selected={activeStage === index} aria-controls="realty-stage-panel" onClick={() => setActiveStage(index)}><span>{stage.title}</span><small>{stage.text}</small></button>)}</div>
          <div className="realty-tab-panel" role="tabpanel" id="realty-stage-panel" aria-live="polite"><strong>{stages[activeStage].title}</strong><p>{stages[activeStage].text}</p></div>
        </div>
      </section>

      <section className="realty-services realty-reveal" id="services" aria-labelledby="realty-services-title">
        <div className="realty-wrap"><img className="realty-feature-media" src="/integral/home-office-interior.jpg" alt="Contemporary interior space" loading="lazy" /><div className="realty-feature-copy"><span className="realty-kicker">What we do</span><h2 id="realty-services-title">Property, beyond the build.</h2><p>Development is one part of the work. Sales, marketing and ongoing management give each property a life after construction.</p></div><div className="realty-tabs realty-service-tabs" role="tablist" aria-label="Property services">{services.map((service, index) => <button key={service.title} type="button" role="tab" aria-selected={activeService === index} aria-controls="realty-service-panel" onClick={() => setActiveService(index)}><span>{service.title}</span><small>{service.text}</small></button>)}</div><div className="realty-tab-panel" role="tabpanel" id="realty-service-panel" aria-live="polite"><strong>{services[activeService].title}</strong><p>{services[activeService].text}</p></div></div>
      </section>

      <section className="realty-final" aria-labelledby="realty-final-title"><img src="/integral/africa/lagos-coast.jpg" alt="Residential and commercial buildings in Lagos" loading="lazy" /><div><h2 id="realty-final-title">Find out what comes next.</h2><p>Ask about a property or discuss a development brief with 84th Luxury Realty.</p><div className="realty-actions"><Link to="/contact.html">Contact us</Link><a href="#completed">View completed work</a></div></div></section>
    </main>
    <FooterOne />
    <ScrollToTopButton />
  </>;
};
