import { useCallback, useEffect, useRef, useState } from "react";

const vehicles = [
  ["Personal sourcing", "Vehicle commerce", "Careful selection. Clear decisions.", "autos-showroom.webp", "autos-sourcing"],
  ["Choice and value", "Vehicle sourcing", "Options that match the way you move.", "autos-models.webp", "autos-sourcing"],
  ["Executive mobility", "Automotive advisory", "Thoughtful support beyond the vehicle.", "autos-white-suv.webp", "autos-advisory"],
  ["Fleet solutions", "Business mobility", "Reliable movement for growing operations.", "autos-city-cars.webp", "autos-fleet"],
  ["Project vehicles", "Project mobility", "Practical choices for demanding work.", "autos-salvage.webp", "autos-fleet"],
  ["Alternative mobility", "Everyday movement", "Flexible choices for changing cities.", "autos-city-bikes.webp", "autos-fleet"],
];

export function AutosCarousel() {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [maxIndex, setMaxIndex] = useState(vehicles.length - 1);

  const metrics = useCallback(() => {
    const element = track.current;
    if (!element) return { step: 1, max: 0 };
    const card = element.querySelector(".integral-autos-card");
    const gap = parseFloat(getComputedStyle(element).gap) || 0;
    const step = (card?.getBoundingClientRect().width || 1) + gap;
    return { step, max: Math.min(vehicles.length - 1, Math.round((element.scrollWidth - element.clientWidth) / step)) };
  }, []);

  const goTo = useCallback((index) => {
    const { step, max } = metrics();
    const target = Math.max(0, Math.min(index, max));
    track.current?.scrollTo({ left: target * step, behavior: "smooth" });
    setActive(target);
  }, [metrics]);

  useEffect(() => {
    const element = track.current;
    if (!element) return undefined;
    const sync = () => {
      const { step, max } = metrics();
      setMaxIndex(max);
      setActive(Math.min(max, Math.max(0, Math.round(element.scrollLeft / step))));
    };
    sync();
    element.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      element.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [metrics]);

  return <section className="integral-autos-collection" id="autos-collection" aria-labelledby="autos-collection-title">
    <div className="integral-autos-section-head integral-autos-live-reveal"><div><span className="td-section-title-pre">Our approach</span><h2 id="autos-collection-title">Mobility for every journey</h2></div><p>Explore the services shaping 84th Autos, from individual sourcing to fleet and project mobility.</p></div>
    <div className="integral-autos-carousel">
      <div className="integral-autos-track" ref={track} tabIndex={0} aria-label="Mobility services" onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); } }}>
        {vehicles.map(([title, category, description, image, target], index) => <article className="integral-autos-card" key={title} aria-label={title}>
          <img src={`/integral/${image}`} alt={`Automobile photograph for ${title.toLowerCase()}`} loading={index < 3 ? "eager" : "lazy"} />
          <a className="integral-autos-more" href={`#${target}`} aria-label={`Learn more about ${title}`}>+</a>
          <div className="integral-autos-card-content"><p>0{index + 1} / {category}</p><h3>{title}</h3><span>{description}</span></div>
        </article>)}
      </div>
      <button className="integral-autos-arrow integral-autos-prev" type="button" aria-label="Previous service" disabled={active === 0} onClick={() => goTo(active - 1)}>‹</button>
      <button className="integral-autos-arrow integral-autos-next" type="button" aria-label="Next service" disabled={active >= maxIndex} onClick={() => goTo(active + 1)}>›</button>
      <div className="integral-autos-dots" role="group" aria-label="Choose a service">{vehicles.map(([title], index) => <button key={title} type="button" aria-label={`Show ${title}`} aria-current={active === index ? "true" : "false"} hidden={index > maxIndex} onClick={() => goTo(index)} />)}</div>
    </div>
  </section>;
}
