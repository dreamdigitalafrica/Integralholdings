import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { HomeTemplate as HomeOne } from "./pages/home/HomeTemplate";
import { AboutPage, AutosPage } from "./pages/IntegralPages";
import { MetricPage, EngineeringPage } from "./pages/IndustryPages";
import { CareersPage } from "./pages/CareersPage";
import { RealtyPage } from "./pages/RealtyPage";
import { ConstructionPage } from "./pages/ConstructionPage";
import { FarmsPage } from "./pages/FarmsPage";
import { BlogDetailsPage, ContactPage, UpdatesPage } from "./pages/EditorialPages";
import { FounderPage, LeadershipPage } from "./pages/LeadershipExperience";
const AdminApp = lazy(() => import('./admin/AdminApp'));

function App() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return <Routes>
    <Route path="/admin/*" element={<Suspense fallback={<div aria-busy="true" aria-label="Opening workspace" />}><AdminApp /></Suspense>} />
    <Route path="/" element={<HomeOne />} />
    <Route path="/index.html" element={<Navigate replace to={"/" + search + hash} />} />
    <Route path="/about.html" element={<Navigate replace to={"/about" + search + hash} />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/leadership.html" element={<Navigate replace to={"/leadership" + search + hash} />} />
    <Route path="/leadership" element={<LeadershipPage />} />
    <Route path="/founder.html" element={<Navigate replace to={"/founder" + search + hash} />} />
    <Route path="/founder" element={<FounderPage />} />
    <Route path="/updates.html" element={<Navigate replace to={"/updates" + search + hash} />} />
    <Route path="/updates" element={<UpdatesPage />} />
    <Route path="/updates/:slug" element={<BlogDetailsPage />} />
    <Route path="/contact.html" element={<Navigate replace to={"/contact" + search + hash} />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/careers.html" element={<Navigate replace to={"/careers" + search + hash} />} />
    <Route path="/careers" element={<CareersPage />} />
    <Route path="/automobiles.html" element={<Navigate replace to={"/automobiles" + search + hash} />} />
    <Route path="/automobiles" element={<AutosPage />} />
    <Route path="/real-estate.html" element={<Navigate replace to={"/real-estate" + search + hash} />} />
    <Route path="/real-estate" element={<RealtyPage />} />
    <Route path="/construction.html" element={<Navigate replace to={"/construction" + search + hash} />} />
    <Route path="/construction" element={<ConstructionPage />} />
    <Route path="/agriculture.html" element={<Navigate replace to={"/agriculture" + search + hash} />} />
    <Route path="/agriculture" element={<FarmsPage />} />
    <Route path="/oil-gas.html" element={<Navigate replace to={"/oil-gas" + search + hash} />} />
    <Route path="/oil-gas" element={<MetricPage />} />
    <Route path="/engineering.html" element={<Navigate replace to={"/engineering" + search + hash} />} />
    <Route path="/engineering" element={<EngineeringPage />} />
    <Route path="*" element={<HomeOne />} />
  </Routes>;
}

export default App;
