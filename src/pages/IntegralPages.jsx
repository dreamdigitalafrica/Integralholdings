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
  <PageHero eyebrow="The Group" title="About Integral Holdings" description="Building legacies. Securing the future." image="/integral/editorial/teamwork.jpg" />
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
  const services = [
    ["Sales", "Vehicle selection starts with the job the vehicle needs to do. We help customers compare suitable options, understand the purchase terms and plan a clear handover."],
    ["Fabrication", "Body and component fabrication for defined vehicle requirements, with attention to fit, function and the conditions in which the vehicle will work."],
    ["Rental", "Short and longer-term vehicle access for individuals, project teams and organisations, matched to the trip, duration and operating need."],
    ["Fleet management", "Vehicle planning, allocation and maintenance coordination that helps organisations track usage, manage downtime and keep essential journeys covered."],
    ["Repairs", "Inspection, fault diagnosis and repair coordination focused on restoring safe, dependable vehicle operation and keeping owners informed of the work required."],
    ["Coupling", "Integration of vehicle bodies, equipment and components against a defined specification, with fit and readiness checked before the vehicle is put to work."],
    ["Manufacturing", "Vehicle production and assembly work shaped by the intended use, component requirements and a clear path from specification through delivery."],
  ];
  return <Layout header={1} footer={1}><main className="integral-autos-page">
  <section className="integral-autos-hero" aria-labelledby="autos-title"><img src="/integral/autos-red-city.webp" alt="Red car against contemporary city architecture" /><div className="integral-autos-hero-shade" /><div className="integral-autos-hero-content integral-autos-live-reveal"><span>84th Autos / Integral Holdings</span><h1 id="autos-title">Vehicles for the work ahead.</h1><p>Sales, rental, fleet management and technical services for people and businesses that depend on their vehicles every day.</p><div className="integral-autos-hero-actions"><a href="#autos-services">Explore services <span aria-hidden="true">↘</span></a><a href="#autos-process">Our approach <span aria-hidden="true">↘</span></a></div></div></section>
  <AutosCarousel />
  <section className="integral-autos-intro-band integral-autos-live-reveal" aria-labelledby="autos-intro-title"><p className="integral-autos-kicker">Automobiles &amp; Mobility</p><h2 id="autos-intro-title">One business. The full vehicle lifecycle.</h2><p>84th Autos brings vehicle supply, access and technical capability together, from the first specification to daily operation and repair.</p></section>
  <section className="integral-autos-service-directory" id="autos-services" aria-labelledby="autos-services-title"><div className="integral-autos-service-directory-heading integral-autos-live-reveal"><span className="integral-autos-kicker">What we do</span><h2 id="autos-services-title">Seven ways we keep you moving.</h2><p>Choose the right vehicle, put it to work and keep it ready for what comes next.</p></div><div className="integral-autos-service-list">{services.map(([title, description], index) => <article className="integral-autos-service-row integral-autos-live-reveal" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
  <section className="integral-autos-editorial integral-autos-live-reveal" id="autos-sourcing" aria-labelledby="autos-sourcing-title"><div className="integral-autos-editorial-media"><img src="/integral/autos-charge-yellow.webp" alt="Yellow electric vehicle charging" loading="lazy" /></div><div className="integral-autos-editorial-copy"><p className="integral-autos-kicker">Sales &amp; rental</p><h2 id="autos-sourcing-title">The right vehicle for the right assignment.</h2><p>Whether the requirement is a personal vehicle, a temporary rental or a project fleet, the brief comes first: capacity, operating conditions, duration and total cost.</p><a href="#autos-services">View services <span aria-hidden="true">→</span></a></div></section>
  <section className="integral-autos-editorial integral-autos-editorial-reverse integral-autos-live-reveal" id="autos-advisory" aria-labelledby="autos-advisory-title"><div className="integral-autos-editorial-media"><img src="/integral/autos-charge-blue.webp" alt="Blue electric vehicle connected to a charger" loading="lazy" /></div><div className="integral-autos-editorial-copy"><p className="integral-autos-kicker">Fleet management</p><h2 id="autos-advisory-title">Know what your fleet needs next.</h2><p>A useful fleet plan accounts for utilisation, scheduled maintenance and vehicles off the road. We bring those decisions into one operational view.</p><a href="#autos-services">View services <span aria-hidden="true">→</span></a></div></section>
  <section className="integral-autos-editorial integral-autos-live-reveal" id="autos-workshop" aria-labelledby="autos-workshop-title"><div className="integral-autos-editorial-media"><img src="/integral/autos-workshop.webp" alt="Vehicles in a modern automobile workshop" loading="lazy" /></div><div className="integral-autos-editorial-copy"><p className="integral-autos-kicker">Repairs &amp; technical work</p><h2 id="autos-workshop-title">Keep vehicles ready for service.</h2><p>Inspection and repair start with the fault and its effect on safe operation. Fabrication and component coupling start with a defined specification and a proper fit.</p><a href="#autos-services">View services <span aria-hidden="true">→</span></a></div></section>
  <section className="integral-autos-fleet integral-autos-live-reveal" id="autos-fleet" aria-labelledby="autos-fleet-title"><img src="/integral/autos-fuel.webp" alt="Fuel nozzles at a service station" loading="lazy" /><div><p className="integral-autos-kicker">Manufacturing &amp; fleet</p><h2 id="autos-fleet-title">Built for the duty, managed for the distance.</h2><p>Vehicle assembly and fleet planning should answer the same question: what must this vehicle do reliably, day after day? We work from that specification through delivery and operation.</p></div></section>
  <section className="integral-autos-process" id="autos-process" aria-labelledby="autos-process-title"><div className="integral-autos-section-head integral-autos-live-reveal"><div><span className="td-section-title-pre">How we work</span><h2 id="autos-process-title">From brief to road readiness.</h2></div></div><div className="integral-autos-process-grid">{[["Specify", "Define the vehicle's duty, operating conditions, capacity and budget before a recommendation is made."], ["Select", "Review suitable vehicles or components against availability, fit and total ownership cost."], ["Prepare", "Agree the supply or technical scope, documentation, handover requirements and next steps."], ["Maintain", "Plan inspection and repair needs so vehicles remain useful after delivery."]].map(([title, text], index) => <article className="integral-autos-live-reveal" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main></Layout>;
};

export const UpdatesPage = () => <Layout header={1} footer={1}><PageHero eyebrow="Insights" title="Business insights" description="Perspectives on the businesses and principles shaping Integral Holdings." image="/integral/home-news-business.jpg" /><section className="integral-page-updates"><div className="container">{[
  ["Focused businesses. Shared ambition.", "Integral Holdings brings specialist businesses together across energy, construction, mobility, property, agriculture and engineering. Each is focused on its own work, with a shared commitment to sound decisions and dependable delivery."],
  ["Building for the long term", "Planning, clear accountability and careful execution connect the Group's ambitions to outcomes that last."],
  ["The people behind the work", "Leaders and teams bring sector knowledge and practical judgment to the everyday work of building the Group."],
].map(([title, text], index) => <article key={title}><span>0{index + 1} / Integral Holdings</span><h2>{title}</h2><p>{text}</p></article>)}</div></section><NextLink to="/about.html">Discover the Group.</NextLink></Layout>;

export const CareersPage = () => <Layout header={1} footer={1}><PageHero eyebrow="People" title="Careers" description="Build meaningful work across essential sectors." image="/integral/home-portfolio-02.jpg" /><section className="integral-page-statement"><div className="container"><span className="td-section-title-pre">Careers at Integral</span><h2>Work with purpose.</h2><p>Integral Holdings is developing businesses that need capable people, sound judgment and a commitment to doing things well. Explore the disciplines that support our portfolio.</p></div></section><section className="integral-page-values"><div className="container"><div className="integral-page-value-grid">{["Project delivery", "Operations", "Business growth", "Graduate pipeline"].map((title, index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>Opportunities in this area will be shared as the Group grows.</p></article>)}</div></div></section><NextLink to="/leadership.html">Meet the leadership team.</NextLink></Layout>;
