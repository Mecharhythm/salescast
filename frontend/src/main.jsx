import "./i18n/index.js"; // ← 追加：これだけでOK
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Privacy from "./Privacy.jsx";
import Guide from "./Guide.jsx";
import UseCases from "./UseCases.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/usecases" element={<UseCases />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
