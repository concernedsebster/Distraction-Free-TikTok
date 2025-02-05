// BLOCKING OVERLAY MANAGEMENT 
// This function creates (or re-displays) the blocking overlay for the specified page.
// The overlay only covers the main content (from 390px from the left onward), so your
// left navigation remains visible.
window.createBlockingOverlay = function(pageType) {
  let overlayId =
    pageType === "For You Page" ? "focusMessageFYP" :
    pageType === "Explore Page" ? "focusMessageExplore" :
    "focusMessageOverlay";
    
  let existing = document.getElementById(overlayId);
  if (existing) {
    // If the overlay exists (or was re-inserted), ensure it’s visible.
    existing.style.display = "flex";
    return;
  }
  
  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: calc(100vw - 390px);  /* leave left 390px for navigation */
    position: fixed;
    top: 0;
    left: 390px;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    text-align: center;
    z-index: 99999;
  `;
  overlay.innerText = `🔵 Stay Focused – The ${pageType} is blocked by Distraction-Free TikTok.`;
  document.body.appendChild(overlay);
  console.log(`✅ Blocking overlay for "${pageType}" created.`);

  // In case TikTok or another script removes the overlay, observe and re-add it.
  const overlayObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === overlay) {
          console.warn(`⚠️ Overlay ${overlayId} was removed – re-adding it.`);
          window.createBlockingOverlay(pageType); // ✅ Fix: Ensure correct reference
        }
      });
    });
  });
  overlayObserver.observe(document.body, { childList: true });
}

// PAGE BLOCKING FUNCTIONS
// Block the For You Page (unless on search results) and the Explore Page.
window.isSearchResultsPage = function() {
  return window.location.pathname.includes("/search");
}

window.blockForYouPage = function () {
if (window.isSearchResultsPage()) {  // ✅ Fix: Ensure correct reference
  console.log("🔎 Search results detected, skipping For You Page block.");
  return;
}
console.log("✅ Blocking For You Page...");
window.createBlockingOverlay("For You Page"); // ✅ Fix: Ensure correct reference
}

window.blockExplorePage = function () {
if (window.isSearchResultsPage()) {  // ✅ Fix: Ensure correct reference
  console.log("🔎 Search results detected, skipping For You Page block.");
  return;
}
console.log("✅ Blocking Explore Page...");
window.createBlockingOverlay("Explore Page"); // ✅ Fix: Ensure correct reference
}