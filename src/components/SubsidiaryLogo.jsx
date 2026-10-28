/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import "../assets/css/subsidiary-brands.css";
export const brandNames = { autos: "84th Autos", metric: "Metric Oil and Gas", realty: "84th Luxury Realty & Property", farms: "84th Farms & Agro", engineering: "Doi-Teck Engineering", construction: "Doi-Teck Construction" };
export function usePageBrand() {
  const { pathname } = useLocation();
  return ({ automobiles: "autos", "oil-gas": "metric", "real-estate": "realty", agriculture: "farms", engineering: "engineering", construction: "construction" })[pathname.replace(/^\//, "").replace(/\.html$/, "")];
}
export function SubsidiaryLogo({ brand, white = false, className = "" }) {
  return <img className={`subsidiary-logo subsidiary-logo--${brand} ${className}`} src={`/integral/brands/${brand}-${white ? "white" : "color"}.svg`} alt={brandNames[brand]} decoding="async" />;
}
