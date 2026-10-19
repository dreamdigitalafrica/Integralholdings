import { useEffect, useRef, useState } from "react";

const slides = [
  { image: "/integral/autos-open-road.jpg", alt: "SUV travelling on an open road", title: "84th Autos", text: "Vehicle sales, rental and fleet support." },
  { image: "/integral/autos-classic-road.jpg", alt: "Classic sports car on a country road", title: "For the drive", text: "Find a vehicle for work, weekends and everything between." },
  { image: "/integral/autos-red-city.webp", alt: "Red sedan beside modern city buildings", title: "For every day", text: "Choose with your journey in mind." },
];

export function AutosShowcase() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlaying(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setActive(index => (index + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [playing]);
  const go = index => { setActive((index + slides.length) % slides.length); setPlaying(false); };
  return <section className="autos-showcase" aria-label="84th Autos highlights" aria-roledescription="carousel">
    {slides.map((slide, index) => <div className={`autos-showcase-slide${active === index ? " is-active" : ""}`} key={slide.image} aria-hidden={active !== index}>
      <img src={slide.image} alt={slide.alt} fetchPriority={index === 0 ? "high" : "auto"} />
      <div className="autos-showcase-copy">{index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}<p>{slide.text}</p><div className="autos-showcase-actions"><a href="#autos-contact-title" tabIndex={active === index ? 0 : -1}>Contact us</a><a href="#autos-services" tabIndex={active === index ? 0 : -1}>Explore services</a></div></div>
    </div>)}
    <button className="autos-slide-control previous" aria-label="Previous highlight" onClick={() => go(active - 1)}><i className="fa-solid fa-chevron-left" aria-hidden="true" /></button>
    <button className="autos-slide-control next" aria-label="Next highlight" onClick={() => go(active + 1)}><i className="fa-solid fa-chevron-right" aria-hidden="true" /></button>
    <div className="autos-slide-dots">{slides.map((slide, index) => <button key={slide.title} aria-label={`Show ${slide.title}`} aria-pressed={index === active} onClick={() => go(index)} />)}</div>
    <button className="autos-slide-control playback" aria-label={playing ? "Pause slideshow" : "Play slideshow"} onClick={() => setPlaying(!playing)}><i className={`fa-solid fa-${playing ? "pause" : "play"}`} aria-hidden="true" /></button>
  </section>;
}

export function AutosVideoFeature() {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const element = video.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced.matches) element.play().catch(() => {});
      else element.pause();
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <section className="autos-drive-feature">
    <div><span>84th Autos</span><h2>Make the most of every journey.</h2><p>Buy for the long term. Rent for a trip. Plan for your fleet.</p><a href="#autos-services">Find your service</a></div>
    <div className="autos-drive-film"><video ref={video} muted loop playsInline preload="metadata" poster="/integral/autos-city-drive-poster.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Convertible travelling through city streets"><source src="/integral/autos-city-drive.mp4" type="video/mp4" /></video><button className="autos-slide-control playback" aria-label={playing ? "Pause driving video" : "Play driving video"} onClick={() => playing ? video.current.pause() : video.current.play().catch(() => {})}><i className={`fa-solid fa-${playing ? "pause" : "play"}`} aria-hidden="true" /></button></div>
  </section>;
}

const services = [
  { title: "Sales", category: "Your next vehicle", image: "/integral/africa/autos-friends-driving.jpg", alt: "Friends enjoying a drive in a sedan", text: "Compare vehicles around your budget and how you drive." },
  { title: "Rental", category: "For a trip or a project", image: "/integral/autos-white-suv.webp", alt: "White SUV parked outdoors", text: "The space you need, for the time you need it." },
  { title: "Fleet management", category: "For your business", image: "/integral/autos-city-cars.webp", alt: "Vehicles parked along a city street", text: "Vehicle allocation, maintenance and availability, coordinated." },
];

export function AutosServiceRail() {
  const rail = useRef(null);
  const [active, setActive] = useState(0);
  const go = index => {
    const next = Math.max(0, Math.min(index, services.length - 1));
    const card = rail.current.children[next];
    rail.current.scrollTo({ left: card.offsetLeft - rail.current.children[0].offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section className="autos-service-showcase" id="autos-services" aria-label="Vehicle services" aria-roledescription="carousel">
    <div className="autos-service-rail" ref={rail} onScroll={() => { const first = rail.current.children[0]; const step = rail.current.children[1].offsetLeft - first.offsetLeft; setActive(Math.round(rail.current.scrollLeft / step)); }}>
      {services.map(service => <article className="autos-service-slide" key={service.title}><img src={service.image} alt={service.alt} loading="lazy" /><span>{service.category}</span><div><h2>{service.title}</h2><p>{service.text}</p><a href="#autos-contact-title">Enquire now</a></div></article>)}
    </div>
    <button className="autos-slide-control previous" disabled={active === 0} aria-label="Previous service" onClick={() => go(active - 1)}><i className="fa-solid fa-chevron-left" aria-hidden="true" /></button>
    <button className="autos-slide-control next" disabled={active === services.length - 1} aria-label="Next service" onClick={() => go(active + 1)}><i className="fa-solid fa-chevron-right" aria-hidden="true" /></button>
    <div className="autos-slide-dots">{services.map((service, index) => <button key={service.title} aria-label={`View ${service.title}`} aria-pressed={active === index} onClick={() => go(index)} />)}</div>
  </section>;
}
