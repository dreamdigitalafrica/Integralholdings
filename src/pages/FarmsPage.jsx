import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FooterOne } from "../components/footers/FooterOne";
import { ScrollToTopButton } from "../components/scroll_to_top_btn/ScrollToTopButton";

const livestock = [
  { name: "Poultry", image: "/integral/farm-poultry.jpg", alt: "Chickens in a poultry barn", copy: "Poultry rearing is part of the farm's livestock operation, supported by feed production and day-to-day husbandry." },
  { name: "Piggery", image: "/integral/farm-piggery.jpg", alt: "Pigs being fed on a farm", copy: "Piggery brings breeding, feeding and animal care together in a dedicated production line." },
  { name: "Fishery", image: "/integral/farm-fishery.jpg", alt: "Fish farming ponds in a rural landscape", copy: "Fishery adds aquaculture to the farm's food production activities." },
  { name: "Snailery", image: "/integral/farm-snailery-better.jpg", alt: "Snail moving across dewy grass", copy: "Snail rearing is another part of the farm's livestock mix." },
  { name: "Cattle", image: "/integral/farm-cattle.jpg", alt: "Cattle grazing in a pasture", copy: "Cattle rearing rounds out a livestock programme spanning small and large animals." },
];

export const FarmsPage = () => {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "84th Farms | Integral Holdings";
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.1 });
    document.querySelectorAll(".farms-reveal").forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); document.title = previousTitle; };
  }, []);

  const submitEnrollment = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = "84th Farms Academy enrollment enquiry";
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Area of interest: ${data.get("interest")}`,
      `Message: ${data.get("message") || "Not provided"}`,
    ].join("\n");
    window.location.href = `mailto:Integralholdings@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const moveTab = (event, index) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? livestock.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + livestock.length) % livestock.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return <>
    <header className="farms-header">
      <Link to="/" className="farms-brand" aria-label="Integral Holdings home"><img src="/integral/integral-logo-transparent.png" alt="Integral" /><span>84th Farms</span></Link>
      <nav className={menuOpen ? "is-open" : ""} aria-label="Farms navigation">
        <a href="#overview" onClick={() => setMenuOpen(false)}>Overview</a>
        <a href="#operations" onClick={() => setMenuOpen(false)}>Operations</a>
        <a href="#livestock" onClick={() => setMenuOpen(false)}>Livestock</a>
        <a href="#academy" onClick={() => setMenuOpen(false)}>Academy</a>
        <Link to="/contact.html" onClick={() => setMenuOpen(false)}>Contact</Link>
      </nav>
      <button className="farms-menu" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>

    <main className="farms-page" id="main-content">
      <section className="farms-hero" aria-labelledby="farms-title">
        <img src="/integral/africa/zaria-greenhouse.jpg" alt="Farmer inspecting crops in a greenhouse in Zaria, Nigeria" fetchPriority="high" />
        <div className="farms-hero-shade" />
        <div className="farms-hero-heading"><span>Agriculture / Integral Holdings</span><h1 id="farms-title">84th Farms</h1><p>Feed. Farming. Food. Training.</p></div>
        <a className="farms-hero-action" href="#overview">Explore the farm</a>
      </section>

      <section className="farms-intro farms-reveal" id="overview" aria-labelledby="farms-overview-title">
        <div className="farms-intro-copy"><span className="farms-kicker">Overview</span><h2 id="farms-overview-title">From input to output</h2><p>84th Farms brings feed manufacturing, livestock rearing, greenhouse growing and agro-food processing into one agricultural operation.</p><p>The Academy of Agriculture extends that work into practical training.</p></div>
        <img src="/integral/farm-feed-silos.jpg" alt="Aerial view of grain silos at an agricultural facility" loading="lazy" />
      </section>

      <section className="farms-production farms-reveal" id="operations" aria-labelledby="farms-production-title">
        <div className="farms-production-heading"><span className="farms-kicker">Production</span><h2 id="farms-production-title">More than the harvest</h2><p>Feed supports animal production. Greenhouse farming brings crops into a controlled growing environment. Agro-food processing moves produce toward its next use.</p></div>
        <div className="farms-production-image"><img src="/integral/africa/african-spice-processing.jpg" alt="African women preparing and sifting food ingredients" loading="lazy" /></div>
        <div className="farms-production-lines">
          <article><span>01</span><h3>Feed manufacturing</h3><p>Producing feed for the needs of farm animals.</p></article>
          <article><span>02</span><h3>Greenhouse farming</h3><p>Growing crops in a managed environment.</p></article>
          <article><span>03</span><h3>Agro-food processing</h3><p>Preparing farm produce for use beyond the farm.</p></article>
        </div>
      </section>

      <section className="farms-livestock farms-reveal" id="livestock" aria-labelledby="farms-livestock-title">
        <div className="farms-livestock-intro"><span className="farms-kicker">Livestock</span><h2 id="farms-livestock-title">Five lines of animal production</h2><p>Explore poultry, piggery, fishery, snailery and cattle rearing.</p></div>
        <div className="farms-livestock-gallery">
          <div className="farms-livestock-media" id="farm-animal-panel" role="tabpanel" aria-labelledby={`farm-animal-tab-${active}`}><img key={livestock[active].image} src={livestock[active].image} alt={livestock[active].alt} loading="lazy" /></div>
          <div className="farms-livestock-tabs" role="tablist" aria-label="Livestock types">{livestock.map((item, index) => <button key={item.name} ref={(node) => { tabRefs.current[index] = node; }} id={`farm-animal-tab-${index}`} type="button" role="tab" aria-controls="farm-animal-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} onKeyDown={(event) => moveTab(event, index)}>{item.name}</button>)}</div>
          <div className="farms-livestock-caption" aria-live="polite"><h3>{livestock[active].name}</h3><p>{livestock[active].copy}</p></div>
        </div>
      </section>

      <section className="farms-academy farms-reveal" id="academy" aria-labelledby="farms-academy-title">
        <img src="/integral/africa/nigerian-cassava-team.jpg" alt="Nigerian farmers together in a cassava field" loading="lazy" />
        <div className="farms-academy-shade" />
        <div className="farms-academy-copy"><span className="farms-kicker">Academy of Agriculture</span><h2 id="farms-academy-title">Learn the work of agriculture</h2><p>Training for people ready to develop practical farming skills.</p><button type="button" onClick={() => dialogRef.current?.showModal()}>Enroll now</button></div>
      </section>
    </main>

    <dialog className="farms-dialog" ref={dialogRef} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} aria-labelledby="farms-dialog-title">
      <div className="farms-dialog-inner"><button type="button" className="farms-dialog-close" aria-label="Close enrollment form" onClick={() => dialogRef.current?.close()}>&times;</button><span className="farms-kicker">Academy of Agriculture</span><h2 id="farms-dialog-title">Enrollment enquiry</h2><p>Tell us what you would like to study. We will reply with available training details.</p>
        <form onSubmit={submitEnrollment}><label>Full name<input name="name" type="text" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required /></label><label>Area of interest<select name="interest" required defaultValue=""><option value="" disabled>Select an area</option><option>General agriculture</option><option>Livestock farming</option><option>Greenhouse farming</option><option>Feed manufacturing</option><option>Agro-food processing</option></select></label><label className="farms-form-wide">Message (optional)<textarea name="message" rows="3" /></label><button type="submit">Continue to email</button></form>
      </div>
    </dialog>
    <FooterOne /><ScrollToTopButton />
  </>;
};
