import JobsSitesSupported from "./jobs-sites-supported";
import "../css/input.css";

// Initializes the monitor when the DOM is ready
console.log("Jobs To PdA: 🚀 Starting extension...");

if (document.readyState === "loading") {
  console.log("Jobs To PdA: ⏳ Waiting for DOM to load...");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Jobs To PdA: ✅ DOM loaded! Starting monitor...");
    new JobsSitesSupported();
  });
} else {
  console.log("Jobs To PdA: ✅ DOM is already ready! Starting monitor...");
  new JobsSitesSupported();
}
