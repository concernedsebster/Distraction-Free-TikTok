(function() {
  console.log("✅ blockingOverlay.js is running!");

  // Ensure `window.blockingOverlay` exists
  if (!window.blockingOverlay) {
    window.blockingOverlay = {};
  }

  Object.assign(window.blockingOverlay, {
    isSearchResultsPage: function() {
      return window.location.pathname.startsWith("/search");
    },

    isVideoPage: function() {
      return window.location.pathname.includes("/video/");
    },

    isProfilePage: function() {
      // Detects if the path is structured like a username (e.g., `/@sebdoesbetter`)
      return /^\/@[a-zA-Z0-9_.-]+$/.test(window.location.pathname);
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

    blockPage: function() {
      if (this.isSearchResultsPage() || this.isVideoPage() || this.isProfilePage()) {  
        console.log("✅ Not blocking this page (Search, Video, or Profile Page).");
        return;
      }
      console.log("🛠️ Blocking page with generic overlay.");
      this.createBlockingOverlay();
    }
  });

  console.log("✅ blockingOverlay.js is fully initialized!");

  // ✅ Automatically block pages on load
  window.blockingOverlay.blockPage();

})();