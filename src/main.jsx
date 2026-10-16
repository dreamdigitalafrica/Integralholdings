import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// necessary css
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/integral-icons.css";
import "./assets/css/animate.css";
import "./assets/css/spacing.css";
import "./assets/css/main.css";
import "./assets/css/integral.css";
import "./assets/css/integral-template.css";
import "./assets/css/careers.css";
import "./assets/css/realty.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
