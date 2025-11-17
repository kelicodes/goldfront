// src/analytics.js
import ReactGA from "react-ga4";

// Replace with your GA4 Measurement ID
const GA_MEASUREMENT_ID = "G-T661WRB21T";

// Initialize GA
export const initGA = () => ReactGA.initialize(GA_MEASUREMENT_ID);

// Log a page view
export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Log an event (for button clicks, etc.)
export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
