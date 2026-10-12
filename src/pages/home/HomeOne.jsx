import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { leaders, subsidiaries, values } from "../../content";

const projects = [
  { title: "Crest 1.0", type: "Completed residential development", image: "/integral/crest-1-06.jpg", href: "/real-estate.html#crest" },
  { title: "Spaces that last", type: "Construction and development", image: "/integral/about-platform-construction.jpg", href: "/construction.html" },
  { title: "Mobility considered", type: "84th Autos", image: "/integral/autos-custom-suv.jpg", href: "/automobiles.html" },
  { title: "Technical futures", type: "Engineering systems", image: "/integral/sector-engineering.jpg", href: "/engineering.html" },
];

const updates = [
  { number: "01", title: "A platform for essential sectors", text: "Integral Holdings is preparing a connected operating platform across six strategic sectors." },
  { number: "02", title: "Building legacies", text: "Our businesses work with a long-term view of commercial and societal value." },
  { number: "03", title: "Professional standards", text: "Disciplined execution and dependable delivery shape the Group's direction." },
];

export const HomeOne = () => {
  const [activePanel, setActivePanel] = useState(2);
  const [activeSector, setActiveSector] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);

  return (
    <Layout header={1} footer={1}>
      <section className="td-hero-area td-hero-spacing integral-hero" aria-labelledby="home-title">
        <div className="integral-hero-media" aria-hidden="true" />
        <div className="td-hero-text-slider integral-marquee" aria-hidden="true">
          <div className="integral-marquee-track"><span>Integral</span><span>Integral</span><span>Integral</span><span>Integral</span></div>
        </div>
        <div className="td-hero-bottom integral-hero-bottom">
          <div className="container"><div className="row align-items-end">
            <div className="col-lg-9"><p className="td-section-title-pre integral-hero-kicker">Integral Holdings</p><h1 id="home-title" className="td-hero-achive-title">Securing the future<span className="integral-hero-second">Building legacies.</span></h1></div>
            <div className="col-lg-3 integral-hero-aside"><p>One group. Six strategic sectors. A long-term view of value.</p><a className="integral-circle-link" href="#subsidiaries" aria-label="Explore our subsidiaries"><span aria-hidden="true">↘</span></a></div>
          </div></div>
        </div>
      </section>

      <section className="td-about-area integral-about pt-145 pb-120" aria-labelledby="about-heading"><div className="container"><div className="row align-items-center">
        <div className="col-xl-6 col-lg-7"><div className="row-custom-wrapper"><div className="row-custom">
          {[
            { number: "01", title: "Build", image: "/integral/sector-construction.jpg", text: "Infrastructure shaped by disciplined planning and durable outcomes." },
            { number: "02", title: "Move", image: "/integral/sector-autos.jpg", text: "Thoughtful mobility for people, projects and business." },
            { number: "03", title: "Grow", image: "/integral/sector-farms.jpg", text: "Productive land use and stronger links between production and markets." },
          ].map((panel, index) => <button className={`col-custom integral-panel ${activePanel === index ? "active" : ""}`} key={panel.number} type="button" onClick={() => setActivePanel(index)} aria-expanded={activePanel === index}>
            <span className="td-panel-item"><span className="td-panel-content"><span>{panel.number}.</span><strong className="td-panel-title">{panel.title}</strong></span></span>
            <span className="td-panel-item-2"><img src={panel.image} alt="" loading="lazy" /><span className="integral-panel-copy"><strong>{panel.title} with purpose.</strong><span>{panel.text}</span></span></span>
          </button>)}
        </div></div></div>
        <div className="col-xl-6 col-lg-5"><div className="td-about-content-wrap ml-45"><span className="td-section-title-pre mb-10">About the Group</span><h2 id="about-heading" className="td-section-title td-about-right-space">Businesses built for the world ahead.</h2><p className="td-about-para">Integral Holdings is a diversified Nigerian holding company developing businesses across sectors fundamental to everyday life and economic growth.</p><Link className="td-btn td-left-right" to="/about.html">Discover Integral <span aria-hidden="true">↗</span></Link></div></div>
      </div></div></section>

      <section id="subsidiaries" className="td-service-area integral-services" aria-labelledby="subsidiaries-title">
        <div className="integral-service-background" style={{ backgroundImage: `url(${subsidiaries[activeSector].image})` }} />
        <div className="integral-section-intro"><span className="td-section-title-pre">Our portfolio</span><h2 id="subsidiaries-title">Six sectors. One direction.</h2></div>
        <div className="integral-service-grid">{subsidiaries.map((item, index) => <article key={item.id} className={`td-service-border service__item-8 ${activeSector === index ? "active" : ""}`} onMouseEnter={() => setActiveSector(index)} onFocus={() => setActiveSector(index)}>
          <div className="td-service-wrap"><span className="td-service-cetagory">{item.category}</span><span className="td-service-number">0{index + 1}</span><div className="td-service-content"><h3 className="td-service-title"><Link to={item.path}>{item.name}</Link></h3><div className="td-service-content-inner"><p>{item.summary}</p><Link className="td-btn td-btn-2" to={item.path}>Explore <span aria-hidden="true">↗</span></Link></div></div></div>
        </article>)}</div>
      </section>

      <section className="td-awards-area integral-principles" aria-labelledby="principles-title"><div className="container"><div className="td-awards-title-wrap text-center"><span className="td-section-title-pre">Our values</span><h2 id="principles-title" className="td-section-title">The principles behind the work.</h2></div>{values.map((value, index) => <div className="td-awards-wrapper" key={value.title}><div className="integral-value-row"><span>0{index + 1}</span><h3>{value.title}</h3><p>{value.text}</p><span aria-hidden="true">↗</span></div></div>)}</div></section>

      <section className="td-portfolio-area td-portfolio-space integral-portfolio" aria-labelledby="work-title"><div className="container"><div className="td-portfolio-title-wrap"><span className="td-section-title-pre">Selected work</span><h2 id="work-title" className="td-section-title">Built to make an impact.</h2></div><div className="integral-project-controls"><p>Projects and portfolio perspectives across the Group.</p><div><button type="button" onClick={() => setProjectIndex((projectIndex + projects.length - 1) % projects.length)} aria-label="Previous project">←</button><button type="button" onClick={() => setProjectIndex((projectIndex + 1) % projects.length)} aria-label="Next project">→</button></div></div><div className="integral-project-grid">{[0, 1, 2].map((offset) => { const project = projects[(projectIndex + offset) % projects.length]; return <Link className="integral-project" key={project.title} to={project.href}><img src={project.image} alt="" loading="lazy" /><span>{project.type}</span><h3>{project.title}</h3><span className="integral-project-arrow" aria-hidden="true">↗</span></Link>; })}</div><div className="integral-project-dots" aria-label="Project carousel position">{projects.map((project, index) => <button key={project.title} type="button" className={projectIndex === index ? "active" : ""} aria-label={`Show project ${index + 1}`} aria-current={projectIndex === index ? "true" : undefined} onClick={() => setProjectIndex(index)} />)}</div></div></section>

      <section className="td-testimonial-area integral-message" aria-labelledby="message-title"><div className="container"><span className="integral-big-word" aria-hidden="true">Future</span><div className="integral-message-inner"><span className="td-section-title-pre">Our perspective</span><h2 id="message-title">We build with tomorrow in mind.</h2><p>From strategic investment to day-to-day execution, each Integral business brings a focused capability to a wider ambition: lasting commercial and societal value.</p><Link className="td-btn" to="/about.html">Our story <span aria-hidden="true">↗</span></Link></div></div></section>

      <section className="integral-brand-strip" aria-label="Integral subsidiaries">{subsidiaries.map((item) => <Link key={item.id} to={item.path}>{item.name}</Link>)}</section>

      <section className="td-video-area integral-vision" aria-labelledby="vision-title"><div className="container-fluid g-0"><div className="td-video-wrapper"><h2 id="vision-title" className="td-video-title"><span>Building</span><br /><b><span className="td-video-title-border">legacies</span> together</b></h2><div className="td-video-thumb"><img src="/integral/about-hero-towers.jpg" alt="Modern buildings against the sky" loading="lazy" /></div><Link className="integral-vision-link" to="/about.html" aria-label="Read about Integral">↗</Link></div></div></section>

      <section className="td-counter-area integral-numbers" aria-label="Integral at a glance"><div className="integral-numbers-image"><img src="/integral/about-platform-construction.jpg" alt="A modern building under development" loading="lazy" /></div><div className="integral-numbers-copy"><span className="td-section-title-pre">The Group</span><p>A connected portfolio, built on sector expertise and a shared commitment to quality.</p><Link className="td-btn" to="/about.html">About Integral <span aria-hidden="true">↗</span></Link></div><div className="integral-numbers-stats"><div><strong>06</strong><span>Strategic sectors</span></div><div><strong>01</strong><span>Long-term vision</span></div></div></section>

      <section className="integral-leadership" aria-labelledby="leadership-title"><div className="container"><div className="integral-section-heading"><div><span className="td-section-title-pre">Leadership</span><h2 id="leadership-title" className="td-section-title">The people shaping Integral.</h2></div><Link className="td-btn" to="/leadership.html">Meet the team <span aria-hidden="true">↗</span></Link></div><div className="integral-leader-grid">{leaders.map((person) => <Link key={person.name} to="/leadership.html" className="integral-leader"><img src={person.image} alt={person.name} loading="lazy" /><h3>{person.name}</h3><p>{person.role}</p></Link>)}</div></div></section>

      <section className="integral-updates" aria-labelledby="updates-title"><div className="container"><div className="integral-section-heading"><div><span className="td-section-title-pre">From the Group</span><h2 id="updates-title" className="td-section-title">Latest perspectives.</h2></div><Link className="td-btn" to="/updates.html">All updates <span aria-hidden="true">↗</span></Link></div><div className="integral-updates-grid">{updates.map((item) => <Link className="integral-update" key={item.number} to="/updates.html"><span>{item.number} / Integral Holdings</span><h3>{item.title}</h3><p>{item.text}</p><span aria-hidden="true">↗</span></Link>)}</div></div></section>
    </Layout>
  );
};
