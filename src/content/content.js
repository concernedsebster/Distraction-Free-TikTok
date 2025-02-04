// Place all imports at the very top.
import { blockForYouPage, blockExplorePage } from "./pageBlocking.js";
import { disableAutoplay } from "./autoplayControl.js";
import { setupSearchBarListeners } from "./searchBarListeners.js";

console.log("✅ content.js is running on TikTok!");
console.log("Module URL:", import.meta.url); // Should log a chrome-extension:// URL

// When the page loads, initialize all core features.
window.addEventListener("load", () => {
  console.log("🚀 Running page load functions...");
  blockForYouPage();
  blockExplorePage();
  disableAutoplay();
  setupSearchBarListeners();
}); 