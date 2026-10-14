/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { subsidiaries, values } from "../content";
import { AutosCarousel } from "../components/AutosCarousel";

const PageHero = ({ eyebrow, title, description, image }) => <section className="integral-page-hero" style={{ backgroundImage: `url(${image})` }}><div className="container"><span className="td-section-title-pre">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>;
const NextLink = ({ to, children }) => <Link className="integral-next-link" to={to}>{children}<span aria-hidden="true">↗</span></Link>;

function useAutosReveals() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll(".integral-autos-page .integral-autos-live-reveal"));
    const reveal = (item) => item.classList.add("is-visible");
    const revealInView = () => items.forEach((item) => {
      if (item.classList.contains("is-visible")) return;
      const { top, bottom } = item.getBoundingClientRect();
      if (top < window.innerHeight * .9 && bottom > 0) reveal(item);
    });

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(reveal);
      return undefined;
    }

    revealInView();
    if (typeof window.IntersectionObserver !== "function") {
      window.addEventListener("scroll", revealInView, { passive: true });
      window.addEventListener("resize", revealInView);
      return () => { window.removeEventListener("scroll", revealInView); window.removeEventListener("resize", revealInView); };
    }

    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target); }
    }), { threshold: .08, rootMargin: "0px 0px -40px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

export const AboutPage = () => <Layout header={1} footer={1}>
  <PageHero eyebrow="The Group" title="About Integral Holdings" description="Building legacies. Securing the future." image="/integral/home-hero-poster.jpg" />
  <section className="integral-page-statement"><div className="container"><span className="td-section-title-pre">Sectors</span><h2>Building across the sectors that shape everyday life.</h2><p>Integral Holdings Ltd is a diversified Nigerian holding company established to build, develop and manage businesses across sectors fundamental to economic growth and long-term development.</p><p>Each subsidiary maintains a specialised focus while benefiting from the strategic direction, corporate identity and long-term investment philosophy of the wider Group.</p></div></section>
  <section className="integral-page-image-band"><img src="/integral/home-service-infrastructure.jpg" alt="Construction work in progress" loading="lazy" /><div><span className="td-section-title-pre">Portfolio platform</span><h2>Structured for essential sectors.</h2><p>Commercial ambition meets innovation, excellence, professionalism, transparency and people-oriented development.</p></div></section>
  <section className="integral-page-values"><div className="container"><span className="td-section-title-pre">Group philosophy</span><h2>Built for long-term value creation.</h2><div className="integral-page-value-grid">{[
    ["Strategic investment", "Developing opportunities capable of creating sustainable commercial and economic value."],
    ["Operational excellence", "Supporting high standards of planning, execution, accountability and performance."],
    ["Brand integrity", "Building relationships on professionalism, transparency and dependable delivery."],
    ["Lasting value", "Investing with a perspective beyond immediate returns."],
  ].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
  <section className="integral-page-mission"><article><span className="td-section-title-pre">Vision</span><h2>To be a leading contributor to exponential development in Nigeria and Sub-Saharan Africa.</h2></article><article><span className="td-section-title-pre">Mission</span><h2>Leveraging our expertise and brand integrity to optimise our investments through commitment to quality and effective delivery.</h2></article></section>
  <section className="integral-page-values"><div className="container"><span className="td-section-title-pre">Core values</span><h2>Principles that guide how the Group builds.</h2><div className="integral-page-value-grid">{values.map((value) => <article key={value.title}><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></div></section>
  <NextLink to="/leadership.html">Meet the leadership shaping the Group.</NextLink>
</Layout>;

const crestImages = ["crest-1-01.jpg", "crest-1-02.jpg", "crest-1-03.jpg", "crest-1-04.jpg", "crest-1-05.jpg", "crest-1-06.jpg"];
export const SubsidiaryPage = ({ id }) => {
  const item = subsidiaries.find((entry) => entry.id === id);
  if (!item) return null;
  return <Layout header={1} footer={1}>
    <PageHero eyebrow={item.category} title={item.name} description={item.intro} image={item.image} />
    <section className="integral-page-statement"><div className="container"><span className="td-section-title-pre">{item.category} / Integral Holdings</span><h2>{item.summary}</h2><p>{item.detail}</p></div></section>
    <section id={id === "autos" ? "autos-capabilities" : undefined} className="integral-page-capabilities"><div className="container"><div><span className="td-section-title-pre">Capabilities</span><h2>Focused scope.</h2></div><ul>{item.capabilities.map((capability, index) => <li key={capability}><span>0{index + 1}</span>{capability}</li>)}</ul></div></section>
    {id === "autos" && <section className="integral-page-values"><div className="container"><span className="td-section-title-pre">The 84th Autos approach</span><h2>Built around the journey.</h2><div className="integral-page-value-grid">{[
      ["Understand", "We begin with intended use, budget and ownership priorities."], ["Source", "Options are assessed against suitability, availability and value."], ["Coordinate", "Clear communication connects decisions, documentation and delivery."], ["Support", "Practical guidance helps keep the vehicle useful beyond handover."],
    ].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>}
    {id === "realty" && <section id="crest" className="integral-collection"><div className="container"><span className="td-section-title-pre">Completed projects</span><h2 className="td-section-title">Crest 1.0</h2><p>A completed residential development by 84th Luxury Realty, presented through selected site and interior views.</p><div className="integral-collection-grid">{crestImages.map((image, index) => <img key={image} src={`/integral/${image}`} alt={`Crest 1.0 project view ${index + 1}`} loading="lazy" />)}</div></div></section>}
    <NextLink to="/">Explore the Integral portfolio.</NextLink>
  </Layout>;
};

export const AutosPage = () => {
  useAutosReveals();
  return <Layout header={1} footer={1}><main className="integral-autos-page">
  <section className="integral-autos-hero" aria-labelledby="autos-title"><img src="/integral/autos-red-city.webp" alt="Red car against contemporary city architecture" /><div className="integral-autos-hero-shade" /><div className="integral-autos-hero-content integral-autos-live-reveal"><span>84th Autos / Integral Holdings</span><h1 id="autos-title">Mobility, made considered.</h1><p>Vehicle sourcing, fleet supply and ownership support for people and businesses that need to keep moving.</p><div className="integral-autos-hero-actions"><a href="#autos-collection">Explore services <span aria-hidden="true">↘</span></a><a href="#autos-process">Our approach <span aria-hidden="true">↘</span></a></div></div></section>
  <AutosCarousel />
  <section className="integral-autos-intro-band integral-autos-live-reveal" aria-labelledby="autos-intro-title"><p className="integral-autos-kicker">Automobiles &amp; Mobility</p><h2 id="autos-intro-title">A clearer way to move.</h2><p>84th Autos brings vehicle sourcing, fleet supply and practical ownership support together in one focused mobility business.</p></section>
  <section className="integral-autos-editorial integral-autos-live-reveal" id="autos-sourcing" aria-labelledby="autos-sourcing-title"><div className="integral-autos-editorial-media"><img src="/integral/autos-charge-yellow.webp" alt="Yellow electric vehicle charging" loading="lazy" /></div><div className="integral-autos-editorial-copy"><p className="integral-autos-kicker">01 / Vehicle sourcing</p><h2 id="autos-sourcing-title">Find the right fit.</h2><p>We start with your real needs, then shape clear, considered options around the vehicle, budget and use case that will serve them best.</p><a href="#autos-process">How we work <span aria-hidden="true">→</span></a></div></section>
  <section className="integral-autos-editorial integral-autos-editorial-reverse integral-autos-live-reveal" id="autos-advisory" aria-labelledby="autos-advisory-title"><div className="integral-autos-editorial-media"><img src="/integral/autos-charge-blue.webp" alt="Blue electric vehicle connected to a charger" loading="lazy" /></div><div className="integral-autos-editorial-copy"><p className="integral-autos-kicker">02 / Ownership support</p><h2 id="autos-advisory-title">Confidence beyond purchase.</h2><p>We help make the ownership journey clearer with practical support that considers the demands of everyday driving, maintenance and continuity.</p><a href="#autos-process">How we work <span aria-hidden="true">→</span></a></div></section>
  <section className="integral-autos-editorial integral-autos-live-reveal" id="autos-workshop" aria-labelledby="autos-workshop-title"><div className="integral-autos-editorial-media"><img src="/integral/autos-workshop.webp" alt="Vehicles in a modern automobile workshop" loading="lazy" /></div><div className="integral-autos-editorial-copy"><p className="integral-autos-kicker">03 / Technical support</p><h2 id="autos-workshop-title">Keep the journey moving.</h2><p>Practical, informed coordination supports vehicle readiness and helps make every journey more dependable over time.</p><a href="#autos-process">How we work <span aria-hidden="true">→</span></a></div></section>
  <section className="integral-autos-fleet integral-autos-live-reveal" id="autos-fleet" aria-labelledby="autos-fleet-title"><img src="/integral/autos-fuel.webp" alt="Fuel nozzles at a service station" loading="lazy" /><div><p className="integral-autos-kicker">04 / Fleet solutions</p><h2 id="autos-fleet-title">Business in motion.</h2><p>Coordinated vehicle supply and practical support for organisations, project teams and commercial operations.</p></div></section>
  <section className="integral-autos-process" id="autos-process" aria-labelledby="autos-process-title"><div className="integral-autos-section-head integral-autos-live-reveal"><div><span className="td-section-title-pre">The 84th Autos approach</span><h2 id="autos-process-title">Built around the journey.</h2></div></div><div className="integral-autos-process-grid">{[["Understand", "We begin with the intended use, budget and ownership priorities."], ["Source", "Options are assessed against suitability, availability and value."], ["Coordinate", "Clear communication connects decisions, documentation and delivery."], ["Support", "Practical guidance helps keep the vehicle useful beyond handover."]].map(([title, text], index) => <article className="integral-autos-live-reveal" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main></Layout>;
};

export const UpdatesPage = () => <Layout header={1} footer={1}><PageHero eyebrow="Insights" title="Business insights" description="Perspectives on the businesses and principles shaping Integral Holdings." image="/integral/home-news-business.jpg" /><section className="integral-page-updates"><div className="container">{[
  ["Focused businesses. Shared ambition.", "Integral Holdings brings specialist businesses together across energy, construction, mobility, property, agriculture and engineering. Each is focused on its own work, with a shared commitment to sound decisions and dependable delivery."],
  ["Building for the long term", "Planning, clear accountability and careful execution connect the Group's ambitions to outcomes that last."],
  ["The people behind the work", "Leaders and teams bring sector knowledge and practical judgment to the everyday work of building the Group."],
].map(([title, text], index) => <article key={title}><span>0{index + 1} / Integral Holdings</span><h2>{title}</h2><p>{text}</p></article>)}</div></section><NextLink to="/about.html">Discover the Group.</NextLink></Layout>;

export const CareersPage = () => <Layout header={1} footer={1}><PageHero eyebrow="People" title="Careers" description="Build meaningful work across essential sectors." image="/integral/home-portfolio-02.jpg" /><section className="integral-page-statement"><div className="container"><span className="td-section-title-pre">Careers at Integral</span><h2>Work with purpose.</h2><p>Integral Holdings is developing businesses that need capable people, sound judgment and a commitment to doing things well. Explore the disciplines that support our portfolio.</p></div></section><section className="integral-page-values"><div className="container"><div className="integral-page-value-grid">{["Project delivery", "Operations", "Business growth", "Graduate pipeline"].map((title, index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>Opportunities in this area will be shared as the Group grows.</p></article>)}</div></div></section><NextLink to="/leadership.html">Meet the leadership team.</NextLink></Layout>;
