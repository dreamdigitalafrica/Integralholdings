import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { leaders, subsidiaries } from "../../content";
import { updates } from "./homeData";

const Arrow = () => <span aria-hidden="true">↗</span>;

function Brands() {
  return <section className="td-brands-area td-grey-bg pb-50 template-brands" aria-label="Integral businesses"><div className="template-brand-track">{[...subsidiaries, ...subsidiaries].map((item, index) => <Link className="td-brand-single-logo" key={`${item.id}-${index}`} to={item.path}>{item.name}</Link>)}</div></section>;
}

function Film() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return <><section className="td-video-area pb-140 pt-150 fix template-video" aria-labelledby="video-title"><div className="container-fluid g-0"><div className="td-video-wrapper p-relative"><h2 id="video-title" className="td-video-title"><span className="td-video-title-spacing wow fadeInRight" data-wow-duration="1s">Building</span><br /><b className="wow fadeInLeft" data-wow-duration="1s"><span className="td-video-title-border">legacies</span> together</b></h2><div className="td-video-thumb p-relative"><img className="w-100" src="/integral/home-film-poster.jpg" alt="Integral film preview" loading="lazy" /><div className="td-video-popup"><button type="button" className="td-video-play td-pulse-border" aria-label="Play Integral film" onClick={() => setOpen(true)}><span aria-hidden="true">▶</span></button></div></div><div className="td-video-page-icon"><Link to="/about.html" aria-label="About Integral"><Arrow /></Link></div></div></div></section>
    {open && <div className="template-video-modal" role="dialog" aria-modal="true" aria-label="Integral film" onClick={() => setOpen(false)}><button type="button" aria-label="Close video" onClick={() => setOpen(false)}>×</button><video controls autoPlay playsInline onClick={(event) => event.stopPropagation()} src="/integral/film-light.mp4" /></div>}
  </>;
}

function Group() {
  return <section className="td-counter-area fix p-relative template-counter" aria-label="About Integral"><div className="container-fluid g-0"><div className="row gx-0"><div className="col-xl-4 col-lg-6"><div className="td-counter-thumb p-relative"><img className="w-100" src="/integral/leadership-hero-team.jpg" alt="Integral team at a completed property" loading="lazy" /></div></div><div className="col-xl-5 col-lg-6 mb-40"><div className="td-counter-content ml-110 mr-150"><p className="mb-45">We develop businesses with <span>purpose</span>, drawing on complementary expertise and a shared commitment to <span>quality</span>.</p><p className="mb-35">Our focus is on dependable execution and enduring value for the people and places we serve.</p><Link className="td-btn td-btn-3 td-left-right" to="/about.html">About Integral <Arrow /></Link></div></div><div className="col-xl-3 col-lg-6 mb-40"><div className="td-counter-count-wrap"><div className="td-counter-single td-counter-single-border mb-35"><h2 className="td-counter-count">04</h2><span className="td-counter-count-para">Group leaders</span></div><div className="td-counter-single"><h2 className="td-counter-count">01</h2><span className="td-counter-count-para">Shared ambition</span></div></div></div></div></div></section>;
}

function Team() {
  return <section className="td-team-area td-grey-bg pt-140 pb-100 template-team" aria-labelledby="team-title"><div className="container"><div className="td-team-title-wrap text-center mb-95 wow fadeInUp" data-wow-duration="1s"><span className="td-section-title-pre mb-10">Our team</span><h2 id="team-title" className="td-section-title">Meet the people shaping Integral</h2></div><div className="row">{leaders.map((person, index) => <div className="col-lg-3 col-md-6 col-sm-6 mb-35" key={person.name}><div className="td-team-wrapper wow fadeInUp" data-wow-duration="1s"><div className="td-team-thumb mb-35 p-relative"><img className="w-100" src={person.image} alt={person.name} loading="lazy" /><div className="td-team-social"><ul><li><Link to={`/leadership.html#leader-${index + 1}`} aria-label={`View ${person.name}'s profile`}><i className="fa-light fa-globe" aria-hidden="true" /></Link></li><li><span aria-hidden="true"><i className="fa-brands fa-linkedin-in" /></span></li><li><span aria-hidden="true"><i className="fa-brands fa-twitter" /></span></li><li><span aria-hidden="true"><i className="fa-brands fa-facebook-f" /></span></li></ul></div></div><div className="td-team-content text-center"><h3 className="td-team-title"><Link to={`/leadership.html#leader-${index + 1}`}>{person.name}</Link></h3><span className="td-team-designation">{person.role}</span></div></div></div>)}</div></div></section>;
}

function News() {
  return <section className="td-blog-area template-news" aria-labelledby="news-title"><div className="container"><div className="td-blog-title-wrap wow fadeInUp" data-wow-duration="1s"><span className="td-section-title-pre mb-10">From the Group</span><h2 id="news-title" className="td-section-title">Latest perspectives</h2></div><div className="template-news-grid">{updates.map((item, index) => <article className="template-news-column wow fadeInUp" data-wow-duration="1s" key={item.title}>{index !== 1 && <Link className="template-news-quote" to="/updates.html"><span>Integral / {item.category}</span><h3>{item.summary}</h3><b aria-hidden="true">“</b></Link>}<Link className="template-news-story" to="/updates.html"><img src={item.image} alt="" loading="lazy" /><span>Integral / {item.category}</span><h3>{item.title}</h3><Arrow /></Link>{index === 1 && <Link className="template-news-quote" to="/updates.html"><span>Integral / Perspective</span><h3>Securing the future. Building legacies.</h3><b aria-hidden="true">“</b></Link>}</article>)}</div></div></section>;
}

export const HomeTemplateMore = () => <><Brands /><Film /><Group /><Team /><News /></>;
