import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { leaders } from "../content";
import { Layout } from "../layouts/Layout";

const profiles = [
  {
    displayName: "Moshe Douglas Teki, FNIQS, RQS",
    shortName: ["Moshe Douglas", "Teki"],
    paragraphs: [
      "Moshe Douglas Teki is the Founder and Chief Executive Officer of Integral Holdings Ltd, a business leader and entrepreneur with extensive experience across construction, fabrication, oil and gas, automobiles and agriculture.",
      "He provides strategic direction for the Group, bringing together sector knowledge, commercial judgement and a purposeful approach to business development. He holds a first degree in Quantity Surveying with Second-Class Honours (Upper Division).",
      "A registered quantity surveyor and Fellow of the Nigerian Institute of Quantity Surveyors (FNIQS), he brings a professional grounding in cost planning, resource management and the commercial dimensions of project delivery to his leadership responsibilities.",
      "His vision for Integral Holdings is to develop enduring enterprises that create commercial value while contributing to infrastructure, industry, employment and economic development.",
    ],
  },
  {
    displayName: "Ezinne T. Anya",
    shortName: ["Ezinne T.", "Anya"],
    paragraphs: [
      "Ezinne Thelma Anya is a human resources professional with a strong interest in people development, strategic HR management and organisational effectiveness.",
      "She holds a B.Sc. in Marketing from Madonna University, Okija, Anambra State, and professional HR certifications including CIPM and PHRi.",
      "As Head of Human Resources, her professional focus is on aligning people priorities with business objectives and helping to build a capable, engaged and high-performing workforce.",
      "She is passionate about creating an environment in which employees can develop their capabilities and contribute meaningfully to organisational performance.",
    ],
  },
  {
    displayName: "Douye Faith Debakenana",
    shortName: ["Douye Faith", "Debakenana"],
    paragraphs: [
      "Douye Faith Debakenana is a detail-oriented administrative professional with a B.Sc. in Computer Science and more than five years of experience across administration, customer relations and operations.",
      "Her experience includes serving as an Administrative Officer at DOI-TECK Construction Company, supporting the coordination and efficiency of day-to-day business activities.",
      "Her capabilities cover office operations, meeting coordination, reporting, database tracking and supply management.",
      "With a foundation in digital marketing and strong technical literacy, her professional focus is on streamlining workflows, strengthening coordination and delivering commercial value through reliable, efficient support.",
    ],
  },
  {
    displayName: "Uchechukwu Eneda Philip, ACA",
    shortName: ["Uchechukwu", "Eneda Philip"],
    paragraphs: [
      "Uchechukwu Eneda Philip, ACA, serves as Head of Accounts, providing leadership for the accounts function.",
      "Her role supports the financial discipline and accountability central to effective business management.",
      "Within the Group, the accounts function supports responsible reporting, financial coordination and the business controls required for sustainable operations.",
    ],
  },
];

export function LeadershipPage() {
  const [selected, setSelected] = useState(null);
  const closeButton = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const match = location.hash.match(/^#leader-([1-4])$/);
    if (match) setSelected(Number(match[1]) - 1);
  }, [location.hash]);

  useEffect(() => {
    if (selected === null) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [selected]);

  const person = selected === null ? null : { ...leaders[selected], ...profiles[selected] };
  const nameButton = (index) => <button id={`leader-${index + 1}`} className="integral-directory-name" type="button" onClick={() => setSelected(index)} key={leaders[index].name} aria-label={`View ${leaders[index].name}'s profile`}>{profiles[index].shortName.map((line) => <span key={line}>{line}</span>)}</button>;

  return <Layout header={1} footer={1}>
    <section className="integral-governance-hero" aria-labelledby="governance-title"><div className="container"><h1 id="governance-title">Corporate Governance</h1></div></section>
    <section className="integral-leadership-directory" aria-label="Integral leadership directory">
      <div className="integral-directory-column"><h2>Leadership</h2><div className="integral-directory-names"><div>{nameButton(0)}<Link className="integral-founder-directory-link" to="/founder.html">Founder profile <span aria-hidden="true">↗</span></Link></div></div></div>
      <div className="integral-directory-column"><h2>Department Heads</h2><div className="integral-directory-names integral-directory-grid">{[1, 2, 3].map(nameButton)}</div></div>
    </section>
    {person && <div className="integral-profile-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="integral-profile-panel" role="dialog" aria-modal="true" aria-labelledby="profile-title"><button ref={closeButton} className="integral-profile-close" type="button" onClick={() => setSelected(null)} aria-label="Close profile">×</button><img src={person.image} alt={person.name} /><div className="integral-profile-copy"><span className="td-section-title-pre">{person.role}</span><h2 id="profile-title">{person.displayName}</h2>{person.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{selected === 0 && <Link className="integral-profile-full" to="/founder.html">View full profile <span aria-hidden="true">↗</span></Link>}</div></section></div>}
  </Layout>;
}

export function FounderPage() {
  const founder = profiles[0];
  return <Layout header={1} footer={1}><main className="integral-founder-page">
    <div className="integral-founder-intro"><div className="integral-founder-portrait"><img src={leaders[0].image} alt="Moshe Douglas Teki" /></div><div className="integral-founder-heading"><span className="td-section-title-pre">Founder & Chief Executive Officer</span><h1>Moshe Douglas Teki</h1><p>FNIQS, RQS</p></div></div>
    <section className="integral-founder-story" aria-labelledby="founder-story-title"><div><span className="td-section-title-pre">Leadership</span><h2 id="founder-story-title">Building enduring enterprises.</h2></div><div>{founder.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Link to="/leadership.html" className="integral-founder-back">← Leadership directory</Link></div></section>
  </main></Layout>;
}
