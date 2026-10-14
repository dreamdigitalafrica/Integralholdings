import { Link } from "react-router-dom";
import { leaders, subsidiaries } from "../../content";

const Arrow = () => <span aria-hidden="true">↗</span>;

function Brands() {
  return <section className="td-brands-area td-grey-bg pb-50 template-brands" aria-label="Integral businesses"><div className="template-brand-track">{[...subsidiaries, ...subsidiaries].map((item, index) => <Link className="td-brand-single-logo" key={`${item.id}-${index}`} to={item.path}>{item.name}</Link>)}</div></section>;
}

function Group() {
  return <section className="td-counter-area fix p-relative template-counter" aria-label="About Integral"><div className="container-fluid g-0"><div className="row gx-0"><div className="col-xl-4 col-lg-6"><div className="td-counter-thumb p-relative"><img className="w-100" src="/integral/editorial/people.jpg" alt="Business leaders walking together" loading="lazy" /></div></div><div className="col-xl-5 col-lg-6 mb-40"><div className="td-counter-content ml-110 mr-150"><p className="mb-45">We develop businesses with <span>purpose</span>, drawing on complementary expertise and a shared commitment to <span>quality</span>.</p><p className="mb-35">Our focus is on dependable execution and enduring value for the people and places we serve.</p><Link className="td-btn td-btn-3 td-left-right" to="/about.html">About Integral <Arrow /></Link></div></div><div className="col-xl-3 col-lg-6 mb-40"><div className="td-counter-count-wrap"><div className="td-counter-single td-counter-single-border mb-35"><h2 className="td-counter-count">04</h2><span className="td-counter-count-para">Group leaders</span></div><div className="td-counter-single"><h2 className="td-counter-count">01</h2><span className="td-counter-count-para">Shared ambition</span></div></div></div></div></div></section>;
}

function Team() {
  return <section className="td-team-area td-grey-bg pt-140 pb-100 template-team" aria-labelledby="team-title"><div className="container"><div className="td-team-title-wrap text-center mb-95 wow fadeInUp" data-wow-duration="1s"><span className="td-section-title-pre mb-10">Our team</span><h2 id="team-title" className="td-section-title">Meet the people shaping Integral</h2></div><div className="row">{leaders.map((person, index) => <div className="col-lg-3 col-md-6 col-sm-6 mb-35" key={person.name}><div className="td-team-wrapper wow fadeInUp" data-wow-duration="1s"><div className="td-team-thumb mb-35 p-relative"><img className="w-100" src={person.image} alt={person.name} loading="lazy" /><div className="td-team-social"><ul><li><Link to={`/leadership.html#leader-${index + 1}`} aria-label={`View ${person.name}'s profile`}><i className="fa-light fa-globe" aria-hidden="true" /></Link></li><li><span aria-hidden="true"><i className="fa-brands fa-linkedin-in" /></span></li><li><span aria-hidden="true"><i className="fa-brands fa-twitter" /></span></li><li><span aria-hidden="true"><i className="fa-brands fa-facebook-f" /></span></li></ul></div></div><div className="td-team-content text-center"><h3 className="td-team-title"><Link to={`/leadership.html#leader-${index + 1}`}>{person.name}</Link></h3><span className="td-team-designation">{person.role}</span></div></div></div>)}</div></div></section>;
}

function News() {
  const columns = [
    [
      { type: "quote dark", category: "Integral / Perspective", title: "A considered view of where we build next." },
      { type: "story", category: "Integral / Our work", title: "Building capability across the Group.", image: "/integral/home-news-business.jpg", alt: "Business team gathered in an office" },
    ],
    [
      { type: "story", category: "Integral / Business cases", title: "Execution is a shared practice.", image: "/integral/editorial/office.jpg", alt: "Contemporary business workspace" },
      { type: "quote light", category: "Integral / Perspective", title: "Clear decisions create room for lasting value." },
    ],
    [
      { type: "quote dark", category: "Integral / Our success stories", title: "The people behind each lasting result." },
      { type: "story", category: "Integral / People", title: "Progress is built together.", image: "/integral/editorial/people.jpg", alt: "Business professionals walking together" },
    ],
  ];
  return <section className="td-blog-area template-news" aria-labelledby="news-title"><div className="container"><div className="td-blog-title-wrap wow fadeInUp" data-wow-duration="1s"><span className="td-section-title-pre mb-10">Insights</span><h2 id="news-title" className="td-section-title">Latest insights</h2></div><div className="template-news-grid">{columns.map((column, columnIndex) => <div className="template-news-column" key={`column-${columnIndex}`}>{column.map((item) => <article className={`template-news-card template-news-card-${item.type.replace(" ", "-")} wow fadeInUp`} data-wow-duration="1s" key={item.title}><Link to="/updates.html">{item.type.includes("story") ? <><div className="template-news-image"><img src={item.image} alt={item.alt} loading="lazy" /></div><div className="template-news-story-content"><p>{item.category}</p><h3>{item.title}</h3><span className="template-news-arrow" aria-hidden="true">↗</span></div></> : <><p>{item.category}</p><span className="template-news-quote" aria-hidden="true">“</span><h3>{item.title}</h3></>}</Link></article>)}</div>)}</div></div></section>;
}

export const HomeTemplateMore = () => <><Brands /><Group /><Team /><News /></>;
