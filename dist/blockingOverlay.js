// BLOCKING OVERLAY MANAGEMENT  
window.blockingOverlay = {
  isExplorePage: function() {
    return window.location.pathname.includes("/explore");
  },

  isSearchResultsPage: function() {
    return window.location.pathname.includes("/search");
  },

  createBlockingOverlay: function(pageType) {
    console.log("🛠️ createBlockingOverlay() was called with pageType:", pageType);

    let overlayId =
      pageType === "For You Page" ? "focusMessageFYP" :
      pageType === "Explore Page" ? "focusMessageExplore" :
      "focusMessageOverlay";
      
    let existing = document.getElementById(overlayId);
    if (existing) {
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
      width: calc(100vw - 390px);
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

    // Observe for removal and re-add if necessary
    if (document.body) {
      const overlayObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === overlay) {
              console.warn(`⚠️ Overlay ${overlayId} was removed – re-adding it.`);
              window.blockingOverlay.createBlockingOverlay(overlayId.includes("FYP") ? "For You Page" : "Explore Page");
            }
          });
        });
      });
      overlayObserver.observe(document.body, { childList: true });
    }
  },

  blockForYouPage: function() {
    if (window.blockingOverlay.isSearchResultsPage()) {  // ✅ FIX: Directly reference `window.blockingOverlay`
      console.log("🔎 Search results detected, skipping For You Page block.");
      return;
    }
    console.log("🛠️ Calling createBlockingOverlay() with: For You Page");
    window.blockingOverlay.createBlockingOverlay("For You Page");
  },

  blockExplorePage: function() {
    if (window.blockingOverlay.isSearchResultsPage()) {  // ✅ FIX: Directly reference `window.blockingOverlay`
      console.log("🔎 Search results detected, skipping Explore Page block.");
      return;
    }
    console.log("🛠️ Calling createBlockingOverlay() with: Explore Page");
    window.blockingOverlay.createBlockingOverlay("Explore Page");
  }
};

// Automatically block the correct page on load
if (window.blockingOverlay.isExplorePage()) {
  window.blockingOverlay.blockExplorePage();
} else {
  window.blockingOverlay.blockForYouPage();
}
