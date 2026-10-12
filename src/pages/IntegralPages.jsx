/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { subsidiaries, values } from "../content";
import { AutosCarousel } from "../components/AutosCarousel";

const PageHero = ({ eyebrow, title, description, image, video }) => <section className="integral-page-hero" style={{ backgroundImage: `url(${image})` }}>{video && <video className="integral-page-hero-video" autoPlay loop muted playsInline preload="none" poster={image} aria-hidden="true"><source src={video} type="video/mp4" /></video>}<div className="container"><span className="td-section-title-pre">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>;
const NextLink = ({ to, children }) => <Link className="integral-next-link" to={to}>{children}<span aria-hidden="true">↗</span></Link>;

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
    <PageHero eyebrow={item.category} title={item.name} description={item.intro} image={item.image} video={id === "autos" ? "/integral/autos-light.mp4" : undefined} />
    <section className="integral-page-statement"><div className="container"><span className="td-section-title-pre">{item.category} / Integral Holdings</span><h2>{item.summary}</h2><p>{item.detail}</p></div></section>
    {id === "autos" && <AutosCarousel />}
    <section id={id === "autos" ? "autos-capabilities" : undefined} className="integral-page-capabilities"><div className="container"><div><span className="td-section-title-pre">Capabilities</span><h2>Focused scope.</h2></div><ul>{item.capabilities.map((capability, index) => <li key={capability}><span>0{index + 1}</span>{capability}</li>)}</ul></div></section>
    {id === "autos" && <section className="integral-page-values"><div className="container"><span className="td-section-title-pre">The 84th Autos approach</span><h2>Built around the journey.</h2><div className="integral-page-value-grid">{[
      ["Understand", "We begin with intended use, budget and ownership priorities."], ["Source", "Options are assessed against suitability, availability and value."], ["Coordinate", "Clear communication connects decisions, documentation and delivery."], ["Support", "Practical guidance helps keep the vehicle useful beyond handover."],
    ].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>}
    {id === "realty" && <section id="crest" className="integral-collection"><div className="container"><span className="td-section-title-pre">Completed projects</span><h2 className="td-section-title">Crest 1.0</h2><p>A completed residential development by 84th Luxury Realty, presented through selected site and interior views.</p><div className="integral-collection-grid">{crestImages.map((image, index) => <img key={image} src={`/integral/${image}`} alt={`Crest 1.0 project view ${index + 1}`} loading="lazy" />)}</div></div></section>}
    <NextLink to="/">Explore the Integral portfolio.</NextLink>
  </Layout>;
};

export const UpdatesPage = () => <Layout header={1} footer={1}><PageHero eyebrow="From the Group" title="Updates" description="Perspectives on the businesses and principles shaping Integral Holdings." image="/integral/home-news-01.jpg" /><section className="integral-page-updates"><div className="container">{[
  ["A platform for essential sectors", "Integral Holdings is preparing a multi-sector operating platform with focused businesses across energy, infrastructure, engineering, property, agriculture and mobility."],
  ["Building legacies across the portfolio", "Each subsidiary brings a specialised sector focus to a shared long-term investment philosophy."],
  ["Professional standards for a growing portfolio", "Planning, accountability and dependable delivery remain central to the Group's direction."],
].map(([title, text], index) => <article key={title}><span>0{index + 1} / Integral Holdings</span><h2>{title}</h2><p>{text}</p></article>)}</div></section><NextLink to="/about.html">Discover the Group.</NextLink></Layout>;

export const CareersPage = () => <Layout header={1} footer={1}><PageHero eyebrow="People" title="Careers" description="Build meaningful work across essential sectors." image="/integral/home-portfolio-02.jpg" /><section className="integral-page-statement"><div className="container"><span className="td-section-title-pre">Careers at Integral</span><h2>Work with purpose.</h2><p>Integral Holdings is developing businesses that need capable people, sound judgment and a commitment to doing things well. Explore the disciplines that support our portfolio.</p></div></section><section className="integral-page-values"><div className="container"><div className="integral-page-value-grid">{["Project delivery", "Operations", "Business growth", "Graduate pipeline"].map((title, index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>Opportunities in this area will be shared as the Group grows.</p></article>)}</div></div></section><NextLink to="/leadership.html">Meet the leadership team.</NextLink></Layout>;
