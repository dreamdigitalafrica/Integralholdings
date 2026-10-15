import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { HomeTemplate as HomeOne } from "./pages/home/HomeTemplate";
import { AboutPage, AutosPage, CareersPage, SubsidiaryPage } from "./pages/IntegralPages";
import { ContactPage, UpdatesPage } from "./pages/EditorialPages";
import { FounderPage, LeadershipPage } from "./pages/LeadershipExperience";
import { subsidiaries } from "./content";

function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return <Routes>
    <Route path="/" element={<HomeOne />} />
    <Route path="/index.html" element={<HomeOne />} />
    <Route path="/about.html" element={<AboutPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/leadership.html" element={<LeadershipPage />} />
    <Route path="/leadership" element={<LeadershipPage />} />
    <Route path="/founder.html" element={<FounderPage />} />
    <Route path="/founder" element={<FounderPage />} />
    <Route path="/updates.html" element={<UpdatesPage />} />
    <Route path="/updates" element={<UpdatesPage />} />
    <Route path="/contact.html" element={<ContactPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/careers.html" element={<CareersPage />} />
    <Route path="/careers" element={<CareersPage />} />
    <Route path="/automobiles.html" element={<AutosPage />} />
    {subsidiaries.filter((item) => item.id !== "autos").map((item) => <Route key={item.id} path={item.path} element={<SubsidiaryPage id={item.id} />} />)}
    <Route path="*" element={<HomeOne />} />
  </Routes>;
}

export default App;
