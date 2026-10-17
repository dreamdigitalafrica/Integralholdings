import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FooterOne } from "../components/footers/FooterOne";
import { ScrollToTopButton } from "../components/scroll_to_top_btn/ScrollToTopButton";

const sectors = [
  { name: "Energy", image: "/integral/home-service-energy.jpg", alt: "Energy facility", description: "Supply, logistics and infrastructure that keep industry moving.", path: "/oil-gas.html" },
  { name: "Engineering", image: "/integral/sector-engineering-real.jpg", alt: "Survey drone over a work site", description: "Technical design, systems and execution for complex briefs.", path: "/engineering.html" },
  { name: "Construction", image: "/integral/home-service-infrastructure.jpg", alt: "Construction work in progress", description: "From project planning to civil works and delivery on site.", path: "/construction.html" },
  { name: "Automobiles", image: "/integral/autos-showroom.webp", alt: "Vehicles in a showroom", description: "Vehicles, fleets and technical services for everyday use.", path: "/automobiles.html" },
  { name: "Realty", image: "/integral/realty-sector-stock.jpg", alt: "Residential development", description: "Property development, management and investment.", path: "/real-estate.html" },
  { name: "Agriculture", image: "/integral/sector-farms.jpg", alt: "Agricultural land", description: "Productive land use, farm operations and agricultural trade.", path: "/agriculture.html" },
];

const departments = [
  { name: "Project delivery", image: "/integral/editorial/construction.jpg", alt: "Construction project", description: "Plan work, coordinate teams and follow a project through to handover.", path: "/construction.html" },
  { name: "Engineering", image: "/integral/sector-engineering-real.jpg", alt: "Survey drone over a work site", description: "Connect design, technical systems and practical execution.", path: "/engineering.html" },
  { name: "Automotive services", image: "/integral/autos-workshop.webp", alt: "Automotive workshop", description: "Work across vehicle specification, repairs and fleet support.", path: "/automobiles.html" },
  { name: "Business operations", image: "/integral/editorial/office.jpg", alt: "Office workplace", description: "Keep the commercial and administrative work behind each business moving.", path: "/about.html" },
];

const learning = [
  { number: "01", title: "Understand the work", text: "See how Integral's businesses operate across essential sectors, and where their responsibilities meet.", image: "/integral/home-office-interior.jpg", alt: "Office interior", path: "/about.html", link: "Explore the Group" },
  { number: "02", title: "Meet the people", text: "Get to know the leaders responsible for the Group's direction, people and operations.", image: "/integral/leadership-hero-team.jpg", alt: "Integral leadership team", path: "/leadership.html", link: "Meet the team" },
  { number: "03", title: "Explore a sector", text: "Go deeper into the services, projects and technical scope of each business.", image: "/integral/editorial/planning.jpg", alt: "Project planning workspace", path: "/#subsidiaries", link: "View the sectors" },
];

export const CareersPage = () => {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All sectors");
  const [activeDepartment, setActiveDepartment] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const railRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".careers-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const moveSlide = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll(".careers-sector-card");
    const next = Math.min(Math.max(activeSlide + direction, 0), cards.length - 1);
    if (cards[next]) rail.scrollTo({ left: cards[next].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
    setActiveSlide(next);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" });
  };

  const department = departments[activeDepartment];

  return <>
    <header className="careers-header">
      <Link className="careers-header-brand" to="/" aria-label="Integral Holdings home"><img src="/integral/integral-logo-transparent.png" alt="Integral" /><span>Careers</span></Link>
      <nav className={menuOpen ? "careers-header-nav is-open" : "careers-header-nav"} aria-label="Careers navigation">
        <a href="#openings" onClick={() => setMenuOpen(false)}>Explore jobs</a>
        <a href="#sectors" onClick={() => setMenuOpen(false)}>Our businesses</a>
        <a href="#departments" onClick={() => setMenuOpen(false)}>Departments</a>
        <a href="#life" onClick={() => setMenuOpen(false)}>Life at Integral</a>
        <a href="#learn" onClick={() => setMenuOpen(false)}>Learn</a>
        <Link to="/about.html">About us</Link>
      </nav>
      <button className={menuOpen ? "careers-menu-toggle is-open" : "careers-menu-toggle"} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span aria-hidden="true" /><span aria-hidden="true" /></button>
    </header>
    <main className="careers-page" id="main-content">
      <section className="careers-hero" aria-labelledby="careers-title">
        <img src="/integral/editorial/people.jpg" alt="Two professionals walking together" />
        <div className="careers-hero-shade" />
        <div className="careers-hero-title"><span>Integral Holdings</span><h1 id="careers-title">Careers</h1><p>Work across the businesses shaping everyday life.</p></div>
        <form className="careers-hero-search" onSubmit={submitSearch}><label htmlFor="careers-hero-query" className="sr-only">Search roles or departments</label><i className="fa-light fa-magnifying-glass" aria-hidden="true" /><input id="careers-hero-query" type="search" placeholder="Search roles or departments" value={search} onChange={(event) => setSearch(event.target.value)} /><button type="submit">Explore jobs</button></form>
      </section>

      <section className="careers-intro careers-shell careers-reveal" aria-labelledby="careers-intro-title">
        <div className="careers-facts" aria-label="Integral at a glance"><div><strong>06</strong><span>Sectors</span></div><div><strong>01</strong><span>Group</span></div><div><strong>Nigeria</strong><span>Our home market</span></div></div>
        <div className="careers-intro-copy"><span className="careers-kicker">One Group. Different disciplines.</span><h2 id="careers-intro-title">Find where your work fits.</h2><p>Integral Holdings develops businesses in energy, engineering, construction, automobiles, realty and agriculture. Each has a distinct job to do. Together they bring technical, commercial and operational work under one Group.</p></div>
      </section>

      <section className="careers-sector-section careers-reveal" id="sectors" aria-labelledby="careers-sectors-title"><div className="careers-shell"><div className="careers-section-heading"><h2 id="careers-sectors-title">Work across all six sectors</h2><span className="careers-sector-count">{String(activeSlide + 1).padStart(2, "0")} / {String(sectors.length).padStart(2, "0")}</span></div><div className="careers-sector-rail" ref={railRef} onScroll={(event) => { const cards = event.currentTarget.querySelectorAll(".careers-sector-card"); if (cards.length > 1) { const step = cards[1].offsetLeft - cards[0].offsetLeft; setActiveSlide(Math.min(sectors.length - 1, Math.round(event.currentTarget.scrollLeft / step))); } }}>
        {sectors.map((item) => <article className="careers-sector-card" key={item.name}><Link to={item.path} className="careers-sector-image" aria-label={`Learn about ${item.name}`}><img src={item.image} alt={item.alt} loading="lazy" /></Link><h3>{item.name}</h3><div className="careers-sector-actions"><a href="#openings">View jobs</a><Link to={item.path}>Learn more</Link></div><p>{item.description}</p></article>)}
      </div></div><div className="careers-rail-nav" aria-label="Sector carousel controls"><button type="button" onClick={() => moveSlide(-1)} disabled={activeSlide === 0} aria-label="Previous sector">‹</button><button type="button" onClick={() => moveSlide(1)} disabled={activeSlide === sectors.length - 1} aria-label="Next sector">›</button></div></section>

      <section className="careers-departments careers-reveal" id="departments" aria-labelledby="careers-departments-title"><div className="careers-shell"><h2 id="careers-departments-title">Featured departments</h2><div className="careers-department-stage"><img key={department.image} src={department.image} alt={department.alt} loading="lazy" /><div className="careers-department-content" aria-live="polite"><span>0{activeDepartment + 1} / 0{departments.length}</span><h3>{department.name}</h3><p>{department.description}</p><Link to={department.path}>Learn more</Link></div></div><div className="careers-department-tabs" role="group" aria-label="Departments">{departments.map((item, index) => <button type="button" key={item.name} className={activeDepartment === index ? "is-active" : ""} aria-pressed={activeDepartment === index} onClick={() => setActiveDepartment(index)}><span>0{index + 1}</span>{item.name}</button>)}</div></div></section>

      <section className="careers-life careers-shell careers-reveal" id="life" aria-labelledby="careers-life-title"><div className="careers-life-intro"><h2 id="careers-life-title">Life at Integral</h2><p>Our businesses have different specialisms. The standard is shared: plan carefully, take responsibility for the work and deliver with integrity.</p><Link to="/about.html">Learn about the Group</Link></div><div className="careers-life-grid"><article><img src="/integral/editorial/teamwork.jpg" alt="Colleagues working together" loading="lazy" /><h3>Work across disciplines</h3><p>Project, technical and commercial teams each bring a different perspective to delivery.</p></article><article><img src="/integral/editorial/boardroom.jpg" alt="Business meeting" loading="lazy" /><h3>Accountability in practice</h3><p>Clear responsibilities and considered decisions matter in every business we build.</p></article></div></section>

      <section className="careers-learn careers-reveal" id="learn" aria-labelledby="careers-learn-title"><div className="careers-shell"><div className="careers-learn-heading"><span className="careers-kicker">Learn</span><h2 id="careers-learn-title">Know the work before you apply.</h2><p>Explore the people, projects and sectors behind Integral Holdings.</p></div>{learning.map((item) => <article className="careers-learn-row" key={item.number}><div className="careers-learn-copy"><span>{item.number} / 03</span><h3>{item.title}</h3><p>{item.text}</p><Link to={item.path}>{item.link}</Link></div><img src={item.image} alt={item.alt} loading="lazy" /></article>)}</div></section>

      <section className="careers-openings careers-reveal" id="openings" aria-labelledby="openings-title"><div className="careers-shell"><div className="careers-openings-heading"><span className="careers-kicker">Opportunities</span><h2 id="openings-title">Explore jobs</h2><p>Open positions across the Group will appear here.</p></div><div className="careers-openings-filters"><label><span className="sr-only">Search roles</span><i className="fa-light fa-magnifying-glass" aria-hidden="true" /><input type="search" placeholder="Search roles or keywords" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label><span className="sr-only">Filter by sector</span><select value={sector} onChange={(event) => setSector(event.target.value)}>{["All sectors", "Energy", "Engineering", "Construction", "Automobiles", "Realty", "Agriculture"].map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="careers-openings-empty" role="status"><h3>No open roles right now.</h3><p>{search || sector !== "All sectors" ? "Try another search or clear the filters." : "Check back for opportunities across the Group."}</p>{(search || sector !== "All sectors") && <button type="button" onClick={() => { setSearch(""); setSector("All sectors"); }}>Clear filters</button>}</div></div></section>

      <section className="careers-join" aria-labelledby="careers-join-title"><img src="/integral/home-news-business.jpg" alt="Professionals together in an office" loading="lazy" /><div><h2 id="careers-join-title">Join the work.</h2><p>There are no open roles listed today. You can still reach the Group directly.</p><a href="mailto:Integralholdings@gmail.com?subject=Career%20inquiry">Contact Integral</a></div></section>
    </main>
    <FooterOne />
    <ScrollToTopButton />
  </>;
};
