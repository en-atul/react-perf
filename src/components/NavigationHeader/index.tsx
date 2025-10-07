import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationHeader.scss";
import { JsxAtom } from "../Svg";

export function NavigationHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/" || location.pathname === "/topics";

  return (
    <header className="navigation-header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate("/")}>
          <JsxAtom className="logo-icon" />
          <span className="logo-text">React Performance</span>
        </div>

        <div className="header-actions">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            disabled={isHome}
          >
            ← Back
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavigationHeader;
