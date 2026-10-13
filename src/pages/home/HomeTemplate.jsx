import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { values } from "../../content";
import { filters, panels, sectors, works } from "./homeData";
import { HomeTemplateMore } from "./HomeTemplateMore";

const Arrow = () => <span aria-hidden="true">↗</span>;

function useTemplateReveal() {
  useLayoutEffect(() => {
    const elements = document.querySelectorAll(".integral-template-home .wow");
    const reveal = (element) => {
      element.style.animationDuration = element.dataset.wowDuration || "0.8s";
      element.style.animationDelay = element.dataset.wowDelay || "0s";
      element.classList.add("animated");
    };

    const revealInView = () => {
      elements.forEach((element) => {
        if (element.classList.contains("animated")) return;
        const { top, bottom } = element.getBoundingClientRect();
        if (top < window.innerHeight * 0.94 && bottom > 0) reveal(element);
      });
    };

    const reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      elements.forEach(reveal);
      return undefined;
    }

    revealInView();
    if (typeof window.IntersectionObserver !== "function") {
      const pollForVisibleSections = window.setInterval(() => {
        revealInView();
        if (Array.from(elements).every((element) => element.classList.contains("animated"))) {
          window.clearInterval(pollForVisibleSections);
        }
      }, 180);
      window.addEventListener("scroll", revealInView, { passive: true });
      window.addEventListener("resize", revealInView);
      return () => {
        window.clearInterval(pollForVisibleSections);
        window.removeEventListener("scroll", revealInView);
        window.removeEventListener("resize", revealInView);
      };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.08 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Hero() {
  return <section className="td-hero-area td-hero-spacing bg-position template-hero" aria-labelledby="home-title">
    <div className="td-hero-text-slider mb-70 template-hero-marquee" aria-hidden="true"><div className="template-hero-track"><span>Building Legacies</span><span>Building Legacies</span><span>Building Legacies</span></div></div>
    <div className="td-hero-bottom"><div className="container"><div className="row align-items-end">
      <div className="col-lg-9 mb-30"><div className="td-hero-achive wow fadeInLeft" data-wow-duration="1s"><h1 id="home-title" className="td-hero-achive-title">Securing<br /><span className="template-hero-arrow" aria-hidden="true">↗</span>the future<span className="td-title-border">.</span></h1></div></div>
      <div className="col-lg-3 d-flex justify-content-end align-items-end mb-50"><div className="td-hero-expertise d-flex align-items-center wow fadeInRight" data-wow-duration="1s"><i className="fa-light fa-globe" aria-hidden="true" /><p>One group.<br />A lasting outlook.</p></div></div>
    </div></div></div>
  </section>;
}

function About() {
  const [active, setActive] = useState(2);
  return <section className="td-about-area fix pt-145 pb-120 template-about" aria-labelledby="home-about-title"><div className="container"><div className="row">
    <div className="col-xl-6 col-lg-7 col-md-12 mb-30"><div className="row-custom-wrapper wow fadeInLeft" data-wow-duration="1s"><div className="row-custom">
      {panels.map((item, index) => <div key={item.number} className={`col-custom ${active === index ? "active" : ""}`} role="button" tabIndex={0} aria-expanded={active === index} onClick={() => setActive(index)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setActive(index); } }}>
        <div className="td-panel-item"><div className="td-panel-content"><span>{item.number}.</span><h3 className="td-panel-title">{item.title}</h3></div></div>
        <div className="td-panel-item-2"><div className="td-panel-content-2"><div className="td-panel-thumb"><img className="w-100" src={item.image} alt="" loading="lazy" /></div><div className="td-panel-content-inner fix p-relative"><span className="td-panel-shape">{item.number}</span><h3 className="td-panel-title-2 mb-10">{item.heading}</h3><p>{item.text}</p><Link className="td-btn td-left-right" to={item.path}>Read More <Arrow /></Link></div></div></div>
      </div>)}
    </div></div></div>
    <div className="col-xl-6 col-lg-5 mb-30"><div className="td-about-content-wrap p-relative ml-45 wow fadeInRight" data-wow-duration="1s"><span className="template-about-watermark" aria-hidden="true">I</span><span className="td-section-title-pre mb-10">The Group</span><h2 id="home-about-title" className="td-section-title td-about-right-space">Focused businesses. Shared ambition.</h2><p className="td-about-para pr-10">Integral Holdings brings complementary businesses together to build value across essential sectors.</p></div></div>
  </div></div></section>;
}

function Services() {
  const [active, setActive] = useState(1);
  return <section id="subsidiaries" className="td-service-area fix bg-position mb-130 p-relative template-services" aria-label="Sectors"><div className="container-fluid g-0"><div className="service__slider-8"><div id="service-bg-img" className={`service-img-${active + 1}`}>{sectors.map((item, index) => <div key={item.label} className={`service-bg service-img-${index + 1}`} style={{ backgroundImage: `url(${item.image})` }} />)}</div></div>
    <div className="row gx-0 row-cols-xl-5 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">{sectors.map((item, index) => <div className="col td-service-border service__item-8" key={item.label} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}><div className="td-service-wrap p-relative"><span className={`td-service-cetagory td-service-cetagory-${index + 1}`}>Sectors</span><h2 className="td-service-number">0{index + 1}</h2><div className="td-service-content"><h3 className="td-service-title"><Link to={item.path}>{item.label}</Link></h3><div className="td-service-content-inner"><p className="td-service-content-para mb-45">{item.summary}</p><Link className="td-btn td-btn-2 td-left-right" to={item.path}>Explore <Arrow /></Link></div></div></div></div>)}</div>
  </div></section>;
}

function Standards() {
  return <section className="td-awards-area template-standards" aria-labelledby="standards-title"><div className="container"><div className="td-awards-title-wrap mb-60 text-center wow fadeInUp" data-wow-duration="1s"><span className="td-section-title-pre mb-10">Our standards</span><h2 id="standards-title" className="td-section-title">What guides our work</h2></div>
    {values.map((item, index) => <div className="td-awards-wrapper p-relative wow fadeInUp" key={item.title} data-wow-duration="1s"><div className="row align-items-center"><div className="col-lg-8 col-md-8 mb-20"><div className="td-awards-content d-flex align-items-center"><span>0{index + 1}</span><h3 className="td-awards-title">{item.title}</h3></div></div><div className="col-lg-4 col-md-4 mb-20"><div className="td-awards-meta"><span>{item.text}</span></div></div></div></div>)}
  </div></section>;
}

function Portfolio() {
  const [filter, setFilter] = useState("Planning");
  const track = useRef(null);
  const items = works.filter((item) => item.filter === filter);
  return <section className="td-portfolio-area td-portfolio-space fix pt-135 pb-200 template-portfolio" aria-labelledby="portfolio-title"><div className="container"><div className="td-portfolio-title-wrap mb-75 wow fadeInUp" data-wow-duration="1s"><span className="td-section-title-pre mb-10">Case Studies</span><h2 id="portfolio-title" className="td-section-title">Our work and success stories</h2></div><div className="row align-items-center pb-10"><div className="col-lg-8 pb-30"><div className="nav td-portfolio-tab-btn-list" role="tablist" aria-label="Case study categories">{filters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} className={`td-portfolio-tab-btn nav-link ${filter === item ? "active" : ""}`} onClick={() => { setFilter(item); track.current?.scrollTo({ left: 0, behavior: "smooth" }); }}>{item}</button>)}</div></div><div className="col-lg-4 pb-30"><div className="td-portfolio-right-btn text-right"><Link className="td-btn td-btn-3 td-left-right" to="/about.html">Explore the Group <Arrow /></Link></div></div></div>
    <div className="template-portfolio-viewport"><div className="template-portfolio-track" ref={track}>{items.map((item) => <Link className="td-portfolio-wrap template-portfolio-item" to={item.path} key={`${filter}-${item.title}`}><div className="td-poerfolio-thumb mb-30"><img className="w-100" src={item.image} alt="" loading="lazy" /></div><div className="td-portfolio-cetagory mb-20"><span>{item.category}</span></div><h3 className="td-portfolio-title">{item.title}</h3></Link>)}</div></div><div className="template-portfolio-controls"><button type="button" aria-label="Previous work" onClick={() => track.current?.scrollBy({ left: -track.current.clientWidth / 2, behavior: "smooth" })}>←</button><button type="button" aria-label="Next work" onClick={() => track.current?.scrollBy({ left: track.current.clientWidth / 2, behavior: "smooth" })}>→</button></div>
  </div></section>;
}

export const HomeTemplate = () => {
  useTemplateReveal();
  return <Layout header={1} footer={1}><div className="integral-template-home"><Hero /><About /><Services /><Standards /><Portfolio /><HomeTemplateMore /></div></Layout>;
};
