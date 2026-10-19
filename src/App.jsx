import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { HomeTemplate as HomeOne } from "./pages/home/HomeTemplate";
import { AboutPage, AutosPage } from "./pages/IntegralPages";
import { MetricPage, EngineeringPage } from "./pages/IndustryPages";
import { CareersPage } from "./pages/CareersPage";
import { RealtyPage } from "./pages/RealtyPage";
import { ConstructionPage } from "./pages/ConstructionPage";
import { FarmsPage } from "./pages/FarmsPage";
import { BlogDetailsPage, ContactPage, UpdatesPage } from "./pages/EditorialPages";
import { FounderPage, LeadershipPage } from "./pages/LeadershipExperience";

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
    <Route path="/updates/:slug" element={<BlogDetailsPage />} />
    <Route path="/contact.html" element={<ContactPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/careers.html" element={<CareersPage />} />
    <Route path="/careers" element={<CareersPage />} />
    <Route path="/automobiles.html" element={<AutosPage />} />
    <Route path="/real-estate.html" element={<RealtyPage />} />
    <Route path="/real-estate" element={<RealtyPage />} />
    <Route path="/construction.html" element={<ConstructionPage />} />
    <Route path="/construction" element={<ConstructionPage />} />
    <Route path="/agriculture.html" element={<FarmsPage />} />
    <Route path="/agriculture" element={<FarmsPage />} />
    <Route path="/oil-gas.html" element={<MetricPage />} />
    <Route path="/oil-gas" element={<MetricPage />} />
    <Route path="/engineering.html" element={<EngineeringPage />} />
    <Route path="/engineering" element={<EngineeringPage />} />
    <Route path="*" element={<HomeOne />} />
  </Routes>;
}

export default App;
