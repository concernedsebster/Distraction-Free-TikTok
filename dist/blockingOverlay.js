(function() {
  console.log("✅ blockingOverlay.js is running!");

  if (!window.blockingOverlay) {
    window.blockingOverlay = {};
  }

  Object.assign(window.blockingOverlay, {
    isExplorePage: function() {
      return window.location.pathname.includes("/explore");
    },

    isSearchResultsPage: function() {
      return window.location.pathname.includes("/search");
    },

    createBlockingOverlay: function() {
      console.log("🛠️ createBlockingOverlay() was called");
    
      let overlayId = "focusMessageOverlay";  
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
      overlay.innerText = "🔵 Stay Focused – This page is blocked by Distraction-Free TikTok.";
      
      document.body.appendChild(overlay);
      console.log(`✅ Blocking overlay created.`);
    },

    blockForYouPage: function() {
      if (window.blockingOverlay.isSearchResultsPage()) {  
        console.log("🔎 Search results detected, skipping block.");
        return;
      }
      console.log("🛠️ Blocking page with generic overlay.");
      window.blockingOverlay.createBlockingOverlay();
    },

    blockExplorePage: function() {
      if (window.blockingOverlay.isSearchResultsPage()) {  
        console.log("🔎 Search results detected, skipping block.");
        return;
      }
      console.log("🛠️ Blocking page with generic overlay.");
      window.blockingOverlay.createBlockingOverlay();
    }
  });

  console.log("✅ blockingOverlay.js is fully initialized!");

  // ✅ Automatically block pages on load
  if (window.blockingOverlay.isExplorePage() || window.location.pathname.includes("/")) { 
    console.log("🛑 Blocking this page with a standard overlay.");
    window.blockingOverlay.createBlockingOverlay();
  } else {
    console.log("✅ Not blocking this page (Search Results or other).");
  }

})();
