// BLOCKING OVERLAY MANAGEMENT  
window.blockingOverlay = {
  isExplorePage: function() {
    return window.location.pathname.includes("/explore");
  },
  createBlockingOverlay: function(pageType) {
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

    // Observe for removal
    if (document.body) {
      const overlayObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === overlay) {
              console.warn(`⚠️ Overlay ${overlayId} was removed – re-adding it.`);
              window.blockingOverlay.createBlockingOverlay(pageType);
            }
          });
        });
      });
      overlayObserver.observe(document.body, { childList: true });
    }
  },

  isSearchResultsPage: function() {
    return window.location.pathname.includes("/search");
  },

  blockForYouPage: function() {
    if (window.blockingOverlay.isSearchResultsPage()) {
      console.log("🔎 Search results detected, skipping For You Page block.");
      return;
    }
    console.log("✅ Blocking For You Page...");
    window.blockingOverlay.createBlockingOverlay("For You Page");
  },

  blockExplorePage: function() {
    if (window.blockingOverlay.isSearchResultsPage()) {
      console.log("🔎 Search results detected, skipping Explore Page block.");
      return;
    }
    console.log("✅ Blocking Explore Page...");
    window.blockingOverlay.createBlockingOverlay("Explore Page");
  }
};
