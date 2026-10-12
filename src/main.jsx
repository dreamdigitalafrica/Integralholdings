import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// necessary css
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/spacing.css";
import "./assets/css/main.css";
import "./assets/css/integral.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
